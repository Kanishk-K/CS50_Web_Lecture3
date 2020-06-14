from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.views.decorators.http import require_http_methods
from .models import *
from django.apps import apps
from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import UserCreationForm
from django.contrib import messages
from .forms import UserRegisterForm
from django.contrib.admin.views.decorators import staff_member_required



# Create your views here.
def index(request):
    if request.user.is_authenticated:
        print(f"User is authenticated {request.user.username}")
        return render(request, "orders/layout.html", {"logged":True,"user":request.user.username})
    else:
        return render(request, "orders/layout.html", {"logged":False})

@require_http_methods(["POST"])
def AjaxSqlRequest(request):
    Selection = apps.get_model('orders', request.POST.get("Selection"))
    AllSelectionOptions = []
    if request.POST.get("Selection") == "Pizzas":
        versions = []
        PizzaTypes = []
        sizes = []
        ToppingList = []
        PizzaToppingsObject = PizzaToppings.objects.all()
        for Toppings in PizzaToppingsObject:
            ToppingList.append(Toppings.name)
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
        AllSelectionOptions.append(ToppingList)
        AllSelectionOptions.append(ToppingList)
        AllSelectionOptions.append(ToppingList)
    if request.POST.get("Selection") == "Subs" or request.POST.get("Selection") == "Platters":
        AlreadyAdded = []
        ToppingList = []
        SubToppingsObject = SubToppings.objects.all()
        for Toppings in SubToppingsObject:
            ToppingList.append(Toppings.name)
        for item in Selection.objects.all():
            if item.name not in AlreadyAdded:
                if Selection.objects.filter(name=item.name).count() == 2:
                    AllSelectionOptions.append({"name":item.name,"SmallPrice":Selection.objects.filter(name=item.name,size="Small").first().price,"LargePrice":Selection.objects.filter(name=item.name,size="Large").first().price,"Toppings":ToppingList})
                    AlreadyAdded.append(item.name)
                else:
                    AllSelectionOptions.append({"name":item.name,"price":item.price,"size":item.size,"Toppings":ToppingList})
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
def Register(request):
    if request.method == "POST":
        form = UserRegisterForm(request.POST)
        if form.is_valid():
            form.save()
            user = form.cleaned_data.get('username')
            messages.success(request, f'You have successfully created an account, {user}.')
            return redirect('login')
    else:
        form = UserRegisterForm()
    return render(request,'orders/register.html',{'form':form})
@require_http_methods(["POST"])
def Toppings(request):
    ToppingList = []
    Selection = request.POST.get("Selection")
    if Selection == "Pizzas":
        PizzaToppingsObject = PizzaToppings.objects.all()
        for Toppings in PizzaToppingsObject:
            ToppingList.append(Toppings.name)
        return JsonResponse({"Toppings":ToppingList})
def Orders(request):
    if request.method == "POST":
        description = request.POST.get("items").replace(",","\n")
        f = Order(user_id=request.POST.get("user"),total=request.POST.get("total"),description=description)
        f.save()
        return HttpResponse("Placeholder")
    else:
        OrderList = Order.objects.filter(user_id=request.user.username)
        return render(request, "orders/UserOrders.html",{"user":request.user.username,"orders":OrderList})
@staff_member_required
def AllOrders(request):
    if request.method == "POST":
        SelectedOrder = Order.objects.filter(id=request.POST.get("id")).first()
        SelectedOrder.status = request.POST.get("action")
        SelectedOrder.save()
        print(SelectedOrder.status)
        return HttpResponse("Placeholder")
    else:
        ActiveOrders = Order.objects.all().exclude(status="Completed")
        return render(request,'orders/AllOrders.html',{"user":request.user.username,"orders":ActiveOrders})
