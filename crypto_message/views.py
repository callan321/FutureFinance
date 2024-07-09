from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import User, Message
from .serializers import UserSerializer, MessageSerializer
from django.shortcuts import render
from django.db.models import Q

class UserListCreate(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class MessageListCreate(generics.ListCreateAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

class UserMessagesList(generics.ListAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        username = self.kwargs['username']
        other_username = self.request.query_params.get('other_username')
        if not other_username:
            return Message.objects.none()
        user = User.objects.get(username=username)
        other_user = User.objects.get(username=other_username)
        return Message.objects.filter(
            Q(sender=user, receiver=other_user) | Q(sender=other_user, receiver=user)
        ).order_by('timestamp')

def index(request):
    return render(request, 'index.html')
