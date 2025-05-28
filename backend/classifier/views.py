from rest_framework.response import Response
from rest_framework.decorators import api_view

from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline
from skops import hub_utils
from sentence_transformers import SentenceTransformer
import os
import re
import pickle

# Create your views here.
@api_view(['POST'])
def send_prompt(request):

    def preprocess(text):
        # convert text to lowercase
        text = text.lower()

        # remove comma from numbers
        text = re.sub(r'(?<=\d),(?=\d)', '', text)

        # fix hyphenation across line breaks or space
        text = re.sub(r'(\w+)-\s+(\w+)', r'\1\2', text)

        # remove http and https links
        text = re.sub(r'http\S+', '', text)  # \S+ = one or more non-whitespace characters

        # remove multiple spaces
        text = re.sub(r'\s+', ' ', text)

        # convert '\/' to '/'
        text = text.replace('\\/', '/')

        # elimintate any leading or trailing remaining white spaces after cleaning
        text = text.strip()

        return text

    def tcfdbert(data):
        model_path = "doanmgd/TCFD-Bert"

        tokenizer = AutoTokenizer.from_pretrained(model_path)
        model = AutoModelForSequenceClassification.from_pretrained(model_path)

        # create the classification pipeline
        clf = pipeline("text-classification", model=model, tokenizer=tokenizer, truncation=True)
        
        cleaned_data = preprocess(data)

        response = {'prompt': data, 'response': clf(cleaned_data)[0]['label'], 'model': 'TCFD-BERT'}

        return response

    def tlsvc(data):
        # generate sentence embeddings
        cleaned_data = preprocess(data)

        model = SentenceTransformer('all-MiniLM-L6-v2')
        embeddings = model.encode([cleaned_data], show_progress_bar=True)

        
        # download the repo where the first layer SVC is stored
        bin_dir = "local-bin-svc"
        bin_repo_id = "doanmgd/TCFD-BIN-SVC"
        bin_local_repo = "local-bin-svc"

        if not os.path.exists(bin_dir):
            hub_utils.download(repo_id=bin_repo_id, dst=bin_local_repo)
        else: # if repo already exists
            print("Directory already exists.")

        # open the model file for the first layer classifier
        with open(f"{bin_local_repo}/tcfd-bin-svc.pkl", "rb") as f:
            clf_bin = pickle.load(f)

        
        # download the repo where the second layer SVC is stored
        multi_dir = "local-svc"
        multi_repo_id = "doanmgd/TCFD-SVC"
        multi_local_repo = "local-svc"

        if not os.path.exists(multi_dir):
            hub_utils.download(repo_id=multi_repo_id, dst=multi_local_repo)
        else: # if repo already exists
            print("Directory already exists.")

        # open the model file for the second layer classifier
        with open(f"{multi_local_repo}/tcfd-svc.pkl", "rb") as f:
            clf = pickle.load(f)

        # define the pipeline
        def predict_pipeline(x_vec, threshold=0.7): # define the confidence threshold
            prob_climate = clf_bin.predict_proba(x_vec)[0][1]
            if prob_climate < threshold:
                return 0  # predict "none"
            else: # if confidence does not reach the threshold
                return clf.predict(x_vec)[0]

        id2label = {0: 'none', 1: 'metrics', 2: 'strategy', 3: 'risk', 4: 'governance'}

        print(predict_pipeline(embeddings[0:1]))

        response = {'prompt': data, 'response': id2label[predict_pipeline(embeddings)], 'model': 'Two-Layer SVC'}

        print(response)

        return response


    prompt = request.data['prompt']
    model_id = request.data['model']
    response = {}

    match model_id:
        case '0':
            response = tcfdbert(prompt)
        case '1':
            response = tlsvc(prompt)
        case _:
            pass
    
    return Response(response)