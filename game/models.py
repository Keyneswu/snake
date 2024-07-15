# game/models.py
from django.db import models

class HighScore(models.Model):
    username = models.CharField(max_length=30)
    score = models.IntegerField()
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.username} - {self.score}"
