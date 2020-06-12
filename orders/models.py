from django.db import models

# Create your models here.
size = (('Small', 'Small'), ("Large", "Large"))
class Pizzas(models.Model):
    name = models.CharField(max_length=64)
    price = models.DecimalField(max_digits=5, decimal_places=2)
    toppings = models.IntegerField()
    size = models.CharField(max_length=5,choices=size)

    def __str__(self):
        return f"{self.name} Pizza is a {self.size} pizza with {self.toppings} toppings which costs {self.price}."

class PizzaToppings(models.Model):
    name = models.CharField(max_length=64)

class Subs(models.Model):
    name = models.CharField(max_length=64)
    price = models.DecimalField(max_digits=5, decimal_places=2)
    size = models.CharField(max_length=5,choices=size)

class SubToppings(models.Model):
    name = models.CharField(max_length=64)
    size = models.CharField(max_length=5,choices=size)
    price = models.DecimalField(max_digits=5, decimal_places=2)

class Pastas(models.Model):
    name = models.CharField(max_length=64)
    price = models.DecimalField(max_digits=5, decimal_places=2)

class Salads(models.Model):
    name = models.CharField(max_length=64)
    price = models.DecimalField(max_digits=5, decimal_places=2)

class Platters(models.Model):
    name = models.CharField(max_length=64)
    size = models.CharField(max_length=5,choices=size)
    price = models.DecimalField(max_digits=5, decimal_places=2)

