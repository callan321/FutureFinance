# Generated by Django 5.0.6 on 2024-07-06 13:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('crypto_message', '0002_message_iv'),
    ]

    operations = [
        migrations.AlterField(
            model_name='message',
            name='iv',
            field=models.CharField(blank=True, max_length=32, null=True),
        ),
    ]
