from django.db import models

# Create your models here.
class Pizza(models.Model):
    name = models.CharField(max_length=64)
    price = models.FloatField()
    toppings = models.IntegerField()
    size = models.CharField(max_length=64)

    def __str__(self):
        return f"{self.name} is a {self.size} pizza with {self.toppings} toppings which costs ${self.price}."

class PizzaToppings(models.Model):
    name = models.CharField(max_length=64)

class Sub(models.Model):
    name = models.CharField(max_length=64)
    price = models.FloatField()
    size = models.CharField(max_length=64)

class SubToppings(models.Model):
    name = models.CharField(max_length=64)
    size = models.CharField(max_length=64)
    price = models.FloatField()

class Pasta(models.Model):
    name = models.CharField(max_length=64)
    price = models.FloatField()

class Salad(models.Model):
    name = models.CharField(max_length=64)
    price = models.FloatField()

class DinnerPlatters(models.Model):
    name = models.CharField(max_length=64)
    size = models.CharField(max_length=64)
    price = models.FloatField()

