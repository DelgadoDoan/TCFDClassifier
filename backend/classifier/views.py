from rest_framework.response import Response
from rest_framework.decorators import api_view
from transformers import pipeline

# Create your views here.
@api_view(['POST'])
def send_prompt(request):
    prompt = request.data['prompt']
    model_id = request.data['model']

    model_dict = {0: 'doanmgd/TCFD-Bert', 1: 'doanmgd/TCFD-Bert'}

    classifier = pipeline('text-classification', model=model_dict[model_id])

    response = {'response': classifier(prompt), 'model': model_id}

    return Response(response)