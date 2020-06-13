from django.urls import path
from django.contrib.auth import views as auth_views

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("Menu",views.AjaxSqlRequest, name="AjaxSqlRequest"),
    path("Price",views.PriceRequest,name="PriceRequest"),
    path("Order",views.Order,name="Order"),
    path("Register",views.Register,name="Register"),
    path("Login",auth_views.LoginView.as_view(template_name='orders/login.html'),name="login"),
    path("Logout",auth_views.LogoutView.as_view(template_name='orders/logout.html'),name="logout")
]
