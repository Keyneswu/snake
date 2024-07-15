# game/views.py
from django.shortcuts import render, redirect
from .models import HighScore
from django.http import JsonResponse


def index(request):
    return render(request, 'game/index.html')


def save_score(request):
    if request.method == 'POST':
        username = request.POST['username']
        score = request.POST['score']
        HighScore.objects.create(username=username, score=score)
        return JsonResponse({'status': 'ok'})
    return JsonResponse({'status': 'fail'})


def high_scores(request):
    scores = HighScore.objects.all().order_by('-score')[:10]
    return render(request, 'game/high_scores.html', {'scores': scores})
