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
    AllSelection = []
    for item in Selection.objects.all():
        if item.size != None:
            AllSelection.append({"name": item.name, "price": item.price, "size":item.size})
        else:
            AllSelection.append({"name": item.name, "price": item.price})
    return HttpResponse(JsonResponse(AllSelection,safe=False))
