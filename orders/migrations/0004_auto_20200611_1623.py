# Generated by Django 3.0.7 on 2020-06-11 21:23

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0003_auto_20200611_1621'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='DinnerPlatters',
            new_name='Platters',
        ),
    ]