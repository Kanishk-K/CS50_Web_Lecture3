# Project 3

Web Programming with Python and JavaScript

# orders/admin.py
===============
Adds models to the admin gui

# orders/forms.py
=================
Sets up the login and login forms for the user.

# orders/models.py
=================
Sets up the objects for pizzas/menu items.

# orders/views.py
===================
Sets up the views, while it is commented I will go over a brief summary.
- The index file checks if the user has been authenticated, if they have then it will send them to the logged in webpage, else send them to the not logged in one.
- The AjaxSQLRequest returns information regarding each of the types of food selected. For example, if the user selects a Pasta it will return all available pastas in the database.
- The Register function will simply register users for the website.
- The Toppings function will return a list of toppings that are for the Pizza.
- The Orders function will either take a sent order and add it to the database or either fetch the user's current orders and send a webpage to them
- The AllOrders request will show the admins of the website all currently active orders.

# orders/static/scripts/AllOrders.js
===================================
While it does have comments I'll go over a brief summary.
- It is pretty simple, it will for each "Complete" button add an event handler for an onclick. Thus when the button is pressed it will set the order to complete, send that to the server and then delete the order from pending orders
- Similarly it allows for the "Ready" button when clicked to set the order's status to Ready and reflect it on the server as well.

# orders/static/scripts/layout.js
===================================
This file seems to be very lengthy but it is in all aspects quite simple, the reason for its redundant length is mainly because I made an early decision to make my app dynamically generate the options rather than have Django template it which was definetely a mistake.
- Firstly it defines some basic variables and objects around the webpage
- It then checks constantly if any of the selection buttons are pressed, for example if the user selects the Platters button then query for all Platter objects. Then display to the screen. (In hindsight I should have just sent a template with all the items present and used javascript to toggle the hidden feature on/off)
- It will then take that information and dynamically generate objects to represent the information sent over.
- When the cart is selected it will take everything that the cart variable held in Javascript and display it as a list.
- When the confirm button is clicked it will first submit the order to the server, delete the cart's contents, refresh the page and display a message confirming the order as placed.
