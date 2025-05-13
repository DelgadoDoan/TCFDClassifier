from django.urls import path

from classifier.views import send_prompt

urlpatterns = [
    path('prompter/', send_prompt, name='prompter'),
]