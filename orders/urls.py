from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("Menu",views.AjaxSqlRequest, name="AjaxSqlRequest")
]
