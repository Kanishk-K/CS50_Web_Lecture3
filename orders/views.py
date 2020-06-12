from django.http import HttpResponse
from django.shortcuts import render
from django.views.decorators.http import require_http_methods
from .models import *
from django.apps import apps
from django.http import JsonResponse



# Create your views here.
def index(request):
    return render(request, "orders/layout.html")

@require_http_methods(["POST"])
def AjaxSqlRequest(request):
    Selection = apps.get_model('orders', request.POST.get("Selection"))
    AllSelectionOptions = []
    if request.POST.get("Selection") == "Pizzas":
        versions = []
        PizzaTypes = []
        sizes = []
        for item in Selection.objects.all():
            if item.version not in versions:
                versions.append(item.version)
            if item.pizzatype not in PizzaTypes:
                PizzaTypes.append(item.pizzatype)
            if item.size not in sizes:
                sizes.append(item.size)
        AllSelectionOptions.append(versions)
        AllSelectionOptions.append(PizzaTypes)
        AllSelectionOptions.append(sizes)
    if request.POST.get("Selection") == "Subs" or request.POST.get("Selection") == "Platters":
        AlreadyAdded = []
        for item in Selection.objects.all():
            if item.name not in AlreadyAdded:
                if Selection.objects.filter(name=item.name).count() == 2:
                    AllSelectionOptions.append({"name":item.name,"SmallPrice":Selection.objects.filter(name=item.name,size="Small").first().price,"LargePrice":Selection.objects.filter(name=item.name,size="Large").first().price})
                    AlreadyAdded.append(item.name)
                else:
                    AllSelectionOptions.append({"name":item.name,"price":item.price,"size":item.size})
                    AlreadyAdded.append(item.name)
    if request.POST.get("Selection") == "Pastas" or request.POST.get("Selection") == "Salads":
        for item in Selection.objects.all():
            AllSelectionOptions.append({"name":item.name,"price":item.price})
    return HttpResponse(JsonResponse(AllSelectionOptions,safe=False))
@require_http_methods(["POST"])
def PriceRequest(request):
    PizzaType = request.POST.get("Pizza_Type")
    ToppingType = request.POST.get("Topping_Type")
    Size = request.POST.get("Size")
    print(f"{PizzaType},{Size},{ToppingType}")
    SelectedPizza = Pizzas.objects.filter(version=str(PizzaType),pizzatype=str(ToppingType),size=str(Size)).first()
    try:
        return JsonResponse({"Price":str(SelectedPizza.price)})
    except AttributeError:
        return JsonResponse({"Error":"Sorry that combination can't exist."})
