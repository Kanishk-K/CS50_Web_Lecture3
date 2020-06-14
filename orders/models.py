from django.db import models

# Create your models here.
size = (('Small', 'Small'), ("Large", "Large"))
versionPizza = (('Regular','Regular'),('Sicilian', 'Sicilian'))
PizzaType = (
    ('Cheese','Cheese'),
    ("1 Topping","1 Topping"),
    ("2 Topping","2 Topping"),
    ("3 Topping","3 Topping"),
    ("Special", "Special")
)
class PizzaToppings(models.Model):
    name = models.CharField(max_length=64)
    
    def __str__(self):
        return f"{self.name}"

class Pizzas(models.Model):
    version = models.CharField(max_length=64,choices=versionPizza)
    price = models.DecimalField(max_digits=5, decimal_places=2)
    pizzatype = models.CharField(max_length=64,choices=PizzaType)
    size = models.CharField(max_length=5,choices=size)
    toppings = models.ManyToManyField(PizzaToppings, blank=True)

    def __str__(self):
        return f"{self.version} {self.size} {self.pizzatype} pizza."

class SubToppings(models.Model):
    name = models.CharField(max_length=64)
    price = models.DecimalField(max_digits=5, decimal_places=2)

class Subs(models.Model):
    name = models.CharField(max_length=64)
    price = models.DecimalField(max_digits=5, decimal_places=2)
    size = models.CharField(max_length=5,choices=size)
    toppings = models.ManyToManyField(SubToppings, blank=True)

    def __str__(self):
        return f"{self.size} {self.name} sub."


class Pastas(models.Model):
    name = models.CharField(max_length=64)
    price = models.DecimalField(max_digits=5, decimal_places=2)
    
    def __str__(self):
        return f"{self.name}"

class Salads(models.Model):
    name = models.CharField(max_length=64)
    price = models.DecimalField(max_digits=5, decimal_places=2)
    
    def __str__(self):
        return f"{self.name}"

class Platters(models.Model):
    name = models.CharField(max_length=64)
    size = models.CharField(max_length=5,choices=size)
    price = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return f"{self.size} {self.name} platter."

class Order(models.Model):
    STATUSES = (
		('Preparing', "Preparing"),
		('Ready', "Ready"),
		('Completed', "Completed")
	)
    user_id = models.CharField(max_length=255)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()
    status = models.CharField(max_length=30, choices=STATUSES, default="Preparing")

    def __str__(self):
        return f"{self.user_id} paid ${self.total} for {self.description}. {self.status}."


