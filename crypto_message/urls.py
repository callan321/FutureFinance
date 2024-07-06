from django.urls import path
from . import views

urlpatterns = [
    path('users/', views.UserListCreate.as_view(), name='user-list-create'),
    path('messages/', views.MessageListCreate.as_view(), name='message-list-create'),
    path('users/<str:username>/messages/', views.UserMessagesList.as_view(), name='user-messages-list'),
    path('', views.index, name='index'),
]