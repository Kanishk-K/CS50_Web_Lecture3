# Generated by Django 3.0.7 on 2020-06-14 03:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0010_remove_subtoppings_size'),
    ]

    operations = [
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_id', models.CharField(max_length=255)),
                ('total', models.DecimalField(decimal_places=2, max_digits=10)),
                ('description', models.TextField()),
                ('status', models.CharField(choices=[('PREP', 'Preparing'), ('RDY', 'Ready'), ('CMPL', 'Completed')], default='PREP', max_length=30)),
            ],
        ),
    ]
