# TCFD Recommendations Classification
##### By: Doan Michael G. Delgado, Daniel S. Yap

This repository contains Python notebooks for classifying Task Force on Climate-related Financial Disclosures (TCFD) recommendations ([fsb-tcfd.org](fsb-tcfd.org)) into five (5) categories labelled as follows:

| 0 | 1 | 2 | 3 | 4 |
|---|---|---|---|---|
| none | metrics | strategy | risk | governance |

#
We employed two (2) methods:
- BERT Fine-Tuning
- Two-Layer Support Vector Classifier (SVC) on Sentence Embeddings
#
### Setup
**It is recommended that the notebooks are ran in Google Colab with GPU set for the runtime for some packages to be readily imported.**
The steps to run the notebook codes are as simple as they get with the following steps:
1. Drag the files (e.g. train.json, dev.csv, test.csv, etc.) needed to the content folder.
2. Run the cells in sequence.
3. Wait for the cells to complete their execution.  

#
## Table of Contents
- [Project Overview](#project-overview)
- [Methodology](#methodology)
- [Results](#results)
- [References](#references)

That's it.
#

### Project Overview
The goal of this project is to automate the classification of TCFD-related recommendations using state-of-the-art NLP techniques, which facilitates better tracking and analysis of climate-related disclosures by companies.

#
### Methodology
Each method involves data preprocessing steps and data augmentation in an attempt to handle the class imbalances in the training dataset. Additionally, both models were uploaded to the Hugging Face platform for public use.
####  BERT Fine-Tuning
1. <b>Data preprocessing</b> - We performed the following preprocessing steps with our dataset:
    - conversion of text to lowercase
    - removal of comma separators in digits
    - joining of words separated by a hyphen and a space (- )
    - removal of http/https links
    - removal of any possibly remaining extra spaces
2. <b>Data augmentation</b> - Using the nlpaug library, we generated 2 additional augmented (insertion of 1 word) samples for each text in the minority class (label 4) using the [distilbert-based-uncased](https://huggingface.co/distilbert/distilbert-base-uncased) model.
3. <b>Setup of the model and tokenizer</b> - We again used the [distilbert-based-uncased](https://huggingface.co/distilbert/distilbert-base-uncased) model and tokenizer from Hugging Face.
4. <b>Training the model</b> - We trained the model with the following hyperparameters set:  
       - Learning rate: 2e-5  
       - Batch size: 32  
       - Epochs: 10
5. <b>Saving the model</b> - the model was uploaded to the Hugging Face platform where it can be accessed publicly via [doanmgd/TCFD-Bert](https://huggingface.co/doanmgd/TCFD-Bert).
6. <b>Tuning the hyperparameters</b> - We didn't use any known techniques for tuning the hyperparameters.

#### Two-Layer SVC
1. <b>Data preprocessing</b> - We performed the same preprocessing step as with the first solution.
2. <b>Data augmentation</b> - We performed the same data augmentation step as with the first solution.
3. <b>Generating the sentence embeddings</b> - We used the [all-MiniLM-L6-v2](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2) model from Hugging Face to generate the sentence embeddings of our texts.
4. <b>Training the first layer SVC</b> - We first trained an SVC that served as the first layer to separate non-climate text (label = 0) texts from climate texts (label != 0) with the following hyperparameters:
    - class weights: balanced
    - kernel: rbf
    - gamma: 1
    - C: 2
5. <b>Training the second layer SVC</b> - We then trained another SVC that served as the second layer to classify the climate texts into the four (4) remaining categories with the following hyperparameters:
    - class weights: balanced
    - kernel: rbf
    - gamma: 1
    - C: 1.5
6. <b>Saving the model</b> - We uploaded models to the Hugging Face platform where it can be accessed publicly via [doanmgd/TCFD-BIN-SVC](https://huggingface.co/doanmgd/TCFD-BIN-SVC) (first-layer) and [doanmgd/TCFD-SVC](https://huggingface.co/doanmgd/TCFD-SVC) (second-layer).
7. <b>Tuning the hyperparameters</b> - We continuously and iteratively searched for the best hyperparameters using grid search.

#
### Results
We ran our models on the dev set and obtained the following results:
| Method | Accuracy | Macro f1-score | Weighted f1-score |
|---|---|---|---|
| BERT Fine-Tuning | 82.50%| 76.82% | 82.14% |
| Two-Layer SVC | 77.00% | 73.88% | 77.19% |

#
### References
- [Fine-Tuning BERT for Text Classification (w/ Example Code)](https://www.youtube.com/watch?v=4QHg8Ix8WWQ) - Shaw Talebi
- [Hosting scikit-learn Models on the Hugging Face Hub with skops](https://medium.com/nlplanet/hosting-scikit-learn-models-on-the-hugging-face-hub-with-skops-2349fcba1ec2)
- [NLPAug : a fantastic text augmentation library
](https://vtiya.medium.com/why-is-data-augmentation-important-de73ec606588)
- [DistilBERT, a distilled version of BERT: smaller, faster, cheaper and lighter
](https://arxiv.org/abs/1910.01108)

