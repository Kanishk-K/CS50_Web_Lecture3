# Generated by Django 3.0.7 on 2020-06-14 02:21

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0009_subs_toppings'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='subtoppings',
            name='size',
        ),
    ]
