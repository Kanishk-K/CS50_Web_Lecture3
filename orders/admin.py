from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register(Pizzas)
admin.site.register(PizzaToppings)
admin.site.register(Subs)
admin.site.register(SubToppings)
admin.site.register(Pastas)
admin.site.register(Salads)
admin.site.register(Platters)
admin.site.register(Order)