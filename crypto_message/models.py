from django.db import models

class User(models.Model):
    username = models.CharField(max_length=15, unique=True)

    def __str__(self):
        return self.username

class Message(models.Model):
    sender = models.ForeignKey(User, related_name='sent_messages', on_delete=models.CASCADE)
    receiver = models.ForeignKey(User, related_name='received_messages', on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    iv = models.CharField(max_length=32, null=True, blank=True)  

    def __str__(self):
        return f"{self.sender} -> {self.receiver}: {self.content[:20]}"
