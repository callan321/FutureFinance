from rest_framework import generics
from .models import User, Message
from .serializers import UserSerializer, MessageSerializer
from django.shortcuts import render

class UserListCreate(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class MessageListCreate(generics.ListCreateAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer

class UserMessagesList(generics.ListAPIView):
    serializer_class = MessageSerializer

    def get_queryset(self):
        username = self.kwargs['username']
        user = User.objects.get(username=username)
        return Message.objects.filter(sender=user).order_by('timestamp')
    

def index(request):
    return render(request, 'index.html')