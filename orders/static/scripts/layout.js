document.addEventListener('DOMContentLoaded', function(){
    const PizzaButton = document.querySelector(".Pizza");
    const SubButton = document.querySelector(".Sub");
    const PastaButton = document.querySelector(".Pasta");
    const SaladButton = document.querySelector(".Salad");
    const PlatterButton = document.querySelector(".Platter");
    const CSRFToken = document.querySelector("input[name='csrfmiddlewaretoken']").value;
    const ResponseField = document.querySelector(".Response");
    const Username = document.querySelector(".Username")
    const Added = document.querySelector(".Added")

    let buttons = document.querySelectorAll('.Selector');
    let CartButton = document.querySelectorAll(".Price");
    const PizzaObjects = ["Pizza_Type","Topping_Type","Size","Topping_1","Topping_2","Topping_3"];
    var total = 0;
    if (localStorage.getItem("CartItems") === null){
        var CartItems = [];
    }
    else {
        var CartItems = JSON.parse(localStorage.getItem("CartItems"));
        for (item in CartItems){
            CartItems[item]["id"] = item.toString();
        }
        console.log(CartItems)
    }
    if (localStorage.getItem("OrderPlaced") !== null){
        Added.hidden = false;
        Added.innerText = "Order Successfully Placed";
    }
    buttons.forEach((btn) => {
        btn.addEventListener("click", (event) => {
            document.querySelectorAll(".Response .Card").forEach(div => div.remove());
            Added.hidden = true;
            Added.innerText = "";
            total = 0;
            buttons.forEach((btn) => {
                if (btn.className.indexOf("btn-dark") != -1){
                    btn.className = btn.className.replace("btn-dark", "btn-outline-dark");
                }
            })
            let Selection = event.target.innerText;
            let EventObject = event.target;
            EventObject.className = EventObject.className.replace("btn-outline-dark", "btn-dark");
            for (item in CartItems){
                CartItems[item]["id"] = item.toString();
            }
            if (Selection == ""){
                var newColumn = document.createElement("div");
                newColumn.className = "Card col-sm-12";
                var ConfirmButton = document.createElement("button");
                ConfirmButton.className = "btn btn-success m-2";
                ResponseField.appendChild(newColumn);
                for (item in CartItems){
                    total = total + parseFloat(CartItems[item]["price"]);
                    var newList = document.createElement("div");
                    newList.className = "row";
                    newList.id = `Item${item}`;
                    newColumn.appendChild(newList);
                    var NameCol = document.createElement("div");
                    NameCol.className = "col-8";
                    var PriceCol = document.createElement("div");
                    PriceCol.className = "col";
                    var CancelCol = document.createElement("div");
                    CancelCol.className = "col justify-content-start"
                    newList.appendChild(NameCol);
                    newList.appendChild(PriceCol);
                    newList.appendChild(CancelCol);
                    var ItemName = document.createElement("h6");
                    var ItemPrice = document.createElement("h6");
                    var CancelButton = document.createElement("input");
                    CancelButton.type = "image";
                    CancelButton.src = "/static/styles/close.png";
                    CancelButton.className = "CancelButton align-self-start"
                    CancelButton.onclick = (event) => {
                        console.log(event.target.parentElement.parentElement.id)
                        for (item in CartItems){
                            if(CartItems[item]["id"] == event.target.parentElement.parentElement.id.replace("Item","")){
                                total = total - CartItems[item]["price"]
                                ConfirmButton.innerText = `Confirm Order Total: $${Math.abs(total).toFixed(2)}`;
                                CartItems.splice(item,1);
                                if (CartItems.length == 0){
                                    ConfirmButton.disabled = true;
                                    ConfirmButton.className="btn btn-danger m-2";
                                }
                                localStorage.setItem("CartItems",JSON.stringify(CartItems));
                                console.log(CartItems);
                            }
                        }
                        event.target.parentElement.parentElement.parentElement.removeChild(event.target.parentElement.parentElement);
                    }
                    ItemName.className = "Name align-self-start text-left";
                    ItemPrice.className = "align-self-end text-right";
                    NameCol.appendChild(ItemName);
                    PriceCol.appendChild(ItemPrice);
                    CancelCol.appendChild(CancelButton);
                    ItemPrice.innerHTML = `$${CartItems[item]["price"]}`;
                    if(CartItems[item]["type"] == "Pizzas"){
                        ItemName.innerText = `${CartItems[item]["Size"]} ${CartItems[item]["Pizza_Type"]} ${CartItems[item]["Topping_Type"]} ${CartItems[item]["type"].slice(0,-1)} `;
                        if (CartItems[item]["toppings"].length != 0){
                            ItemName.innerText += "[ "
                            for(topping in CartItems[item]["toppings"]){
                                ItemName.innerText += ` ${CartItems[item]["toppings"][topping]} `
                            }
                            ItemName.innerText += " ]"
                        }
                    }
                    if(CartItems[item]["type"] == "Subs" || CartItems[item]["type"] == "Platters"){
                        if (CartItems[item]["type"] == "Platters"){
                            ItemName.innerText = `${CartItems[item]["Size"]} ${CartItems[item]["name"]} ${CartItems[item]["type"].slice(0,-1)}`;
                        }
                        else {
                            console.log(CartItems[item]['Toppings'])
                            if (CartItems[item]['Toppings'] != "default"){
                                ItemName.innerText = `${CartItems[item]["Size"]} ${CartItems[item]["name"]} ${CartItems[item]["type"].slice(0,-1)} ${CartItems[item]["Toppings"]}`
                            }
                            else{
                                ItemName.innerText = `${CartItems[item]["Size"]} ${CartItems[item]["name"]} ${CartItems[item]["type"].slice(0,-1)}`
                            }
                        }
                    }
                    if(CartItems[item]["type"] == "Pastas" || CartItems[item]["type"] == "Salads"){
                        ItemName.innerText = `${CartItems[item]["name"]} ${CartItems[item]["type"].slice(0,-1)}`
                    }
                    newColumn.appendChild(ConfirmButton);
                }
                ConfirmButton.innerText = `Confirm Order Total: $${Math.abs(total).toFixed(2)}`
                ConfirmButton.onclick = () => {
                    const request = new XMLHttpRequest();
                    request.open('POST', 'Orders');
                    request.onload = () => {
                        localStorage.clear()
                        localStorage.setItem("OrderPlaced",true);
                        location.reload()
                    }
                    const OrderRequest = new FormData();
                    OrderItems = []
                    OrderRequest.append("user",document.querySelector(".Username").innerText.replace("Username: ",""));
                    OrderRequest.append("total",Math.abs(total).toFixed(2))
                    document.querySelectorAll(".col-8").forEach((div) => {
                        OrderItems.push(div.querySelector("h6").innerText)
                    })
                    OrderRequest.append("items",OrderItems)
                    OrderRequest.append("csrfmiddlewaretoken",CSRFToken)
                    request.send(OrderRequest);
                }
            }
            const request = new XMLHttpRequest();
            request.open('POST', '/Menu');
            request.onload = () => {
                const response = JSON.parse(request.responseText);
                if (Selection == "Pizzas"){
                    var newForm = document.createElement('form');
                    newForm.className = "Card Holder bg-dark rounded";
                    for (item in PizzaObjects){
                        var DropdownDiv = document.createElement('div');
                        DropdownDiv.className = "form-group ml-5 mr-5 mt-2 mb-2";
                        var Dropdown = document.createElement('select');
                        Dropdown.className = `${PizzaObjects[item]} Dropdown form-control`;
                        var Label = document.createElement('option')
                        Label.disabled = true;
                        Label.selected = true;
                        Label.hidden = true;
                        Label.innerText = `Select a ${PizzaObjects[item].replace("_"," ")}`;
                        Label.value = "default";
                        Dropdown.appendChild(Label);
                        for (attribute in response[item]){
                            var Option = document.createElement('option');
                            Option.value = response[item][attribute];
                            var TextNode = document.createTextNode(response[item][attribute]);
                            Option.appendChild(TextNode);
                            Dropdown.appendChild(Option);
                        }
                        Dropdown.id = PizzaObjects[item];
                        DropdownDiv.appendChild(Dropdown);
                        newForm.appendChild(DropdownDiv);
                        ResponseField.appendChild(newForm);
                    }
                    for(var z = 1; z<4 ; z++){
                        document.querySelector(`.Topping_${z}`).hidden = true;
                    }
                    var FilledText = document.createElement('p');
                    FilledText.className = "text-white";
                    FilledText.hidden = true;
                    newForm.appendChild(FilledText);
                    var newButton = document.createElement('button');
                    newButton.className = "ConfirmButton btn btn-success ml-5 mr-5 mt-2 mb-2";
                    newButton.innerText = "Add To Cart";
                    newButton.disabled = true;
                    newButton.type = "button";
                    newForm.appendChild(newButton);
                    let Dropdowns = document.querySelectorAll(".Dropdown");
                    Dropdowns.forEach((Dropdown) => {
                        Dropdown.addEventListener("change", (event) => {
                            for(var z = 1; z<4 ; z++){
                                document.querySelector(`.Topping_${z}`).hidden = true;
                            }
                            if(document.querySelector(`.Topping_Type`).value != 'default' && document.querySelector(`.Topping_Type`).value != 'Cheese' && document.querySelector(`.Topping_Type`).value != 'Special'){
                                for(var z = 0; z<parseInt(document.querySelector(`.Topping_Type`).value) ; z++){
                                    document.querySelector(`.Topping_${z+1}`).hidden = false;
                                }
                            }
                            var allSelected = true;
                            for (var i = 0; i < PizzaObjects.length+parseInt(document.querySelector(`.Topping_Type`).value)-3; i++){
                                if (allSelected == true){
                                    if (document.querySelector(`.${PizzaObjects[i]}`).value == 'default'){
                                        allSelected = false;
                                    }
                                }
                            }
                            if (allSelected == true){
                                console.log("Sending Request")
                                const pricing = new XMLHttpRequest();
                                pricing.open('POST', '/Price');
                                pricing.onload = () => {
                                    const PricingResponse = JSON.parse(pricing.responseText)
                                    if (PricingResponse.Error != undefined){
                                        console.log(PricingResponse.Error);
                                        FilledText.hidden=false;
                                        FilledText.innerHTML = PricingResponse.Error;
                                    }
                                    else{
                                        FilledText.innerHTML = `Your order will cost: $${PricingResponse.Price}`;
                                        FilledText.hidden=false;
                                        
                                        if (Username != null){
                                            newButton.disabled = false;
                                        }
                                        newButton.onclick = () =>{
                                            ToppingDict = []
                                            for (var i = 0; i<parseInt(document.querySelector(`.Topping_Type`).value);i++){
                                                console.log(document.querySelector(`.Topping_${i+1}`).value)
                                                ToppingDict.push(document.querySelector(`.Topping_${i+1}`).value)
                                            }
                                            var Data = {"id": CartItems.length.toString(), "type":Selection,"Pizza_Type":document.querySelector(`#${PizzaObjects[0]}`).value,"Topping_Type":document.querySelector(`#${PizzaObjects[1]}`).value,"Size":document.querySelector(`#${PizzaObjects[2]}`).value,"price":PricingResponse.Price,"toppings":ToppingDict};
                                            CartItems.push(Data);
                                            Added.innerText = `Successfully added ${Data["Size"]} ${Data["Pizza_Type"]} ${Data["Topping_Type"]} Pizza to cart.`;
                                            Added.hidden = false;
                                            localStorage.setItem("CartItems",JSON.stringify(CartItems));
                                            console.log(Data)
                                        };
                                    }
                                }
                                const PriceRequest = new FormData();
                                for(var i = 0; i < PizzaObjects.length; i++){
                                    PriceRequest.append(`${PizzaObjects[i]}`,document.querySelector(`.${PizzaObjects[i]}`).value);
                                }
                                PriceRequest.append("csrfmiddlewaretoken",CSRFToken)
                                pricing.send(PriceRequest);
                            }
                        })
                    })
                }
                if (Selection == "Subs" || Selection == "Platters"){
                    for(item in response){
                        if (response[item].SmallPrice != undefined){
                            var newTitle = document.createElement("h6");
                            newTitle.className = "card-title text-white bg-dark";
                            newTitle.innerHTML = `${response[item].name}`;
                            var newSmallButton = document.createElement("a");
                            if (Username != null){
                                newSmallButton.className = `Sub${item} Price btn btn-success m-2`;
                            }
                            else{
                                newSmallButton.className = `Sub${item} Price btn btn-success m-2 disabled`;
                            }
                            newSmallButton.innerHTML = `$${response[item].SmallPrice}`;
                            var newLargeButton = document.createElement("a");
                            if (Username != null){
                                newLargeButton.className = `Sub${item} Price btn btn-danger m-2`;
                            }
                            else{
                                newLargeButton.className = `Sub${item} Price btn btn-danger m-2 disabled`;
                            }
                            newLargeButton.innerHTML = `$${response[item].LargePrice}`;
                            var newCardBody = document.createElement("div");
                            newCardBody.className = "card-body";
                            newCardBody.appendChild(newTitle);
                            newCardBody.appendChild(newSmallButton);
                            newCardBody.appendChild(newLargeButton);
                            if (Selection == "Subs"){
                                var Dropdown = document.createElement('select');
                                Dropdown.className = `Sub${item} Dropdown form-control`;
                                var Label = document.createElement('option')
                                Label.disabled = true;
                                Label.selected = true;
                                Label.hidden = true;
                                Label.innerText = `Add a Topping?`;
                                Label.value = "default";
                                Dropdown.appendChild(Label);
                                for (Topping in response[item]["Toppings"]){
                                    var Option = document.createElement('option');
                                    Option.value = response[item]["Toppings"][Topping];
                                    var TextNode = document.createTextNode(response[item]["Toppings"][Topping]);
                                    Option.appendChild(TextNode);
                                    Dropdown.appendChild(Option);
                                }
                                newCardBody.appendChild(Dropdown)
                            }
                            var newCard = document.createElement("div");
                            newCard.className = "ItemCard card bg-dark m-2";
                            newCard.appendChild(newCardBody);
                            var newColumn = document.createElement("div");
                            newColumn.className = "Card col-sm-3";
                            newColumn.appendChild(newCard);
                            ResponseField.append(newColumn);
                        }
                        else {
                            var newTitle = document.createElement("h6");
                            newTitle.className = "card-title text-white bg-dark";
                            newTitle.innerHTML = `${response[item].name}`;
                            var newButton = document.createElement("a");
                            if (response[item].size == "Small"){
                                if (Username != null){
                                    newButton.className = `${item} Price btn btn-success m-2`;
                                }
                                else{
                                    newButton.className = `${item} Price btn btn-success m-2 disabled`;
                                }
                            }
                            else {
                                if (Username != null){
                                    newButton.className = `${item} Price btn btn-danger m-2`;
                                }
                                else{
                                    newButton.className = `${item} Price btn btn-danger m-2 disabled`;
                                }
                            }
                            newButton.innerHTML = `$${response[item].price}`
                            var newCardBody = document.createElement("div");
                            newCardBody.className = "card-body";
                            newCardBody.appendChild(newTitle);
                            newCardBody.appendChild(newButton);
                            if (Selection == "Subs"){
                                var Dropdown = document.createElement('select');
                                Dropdown.className = `Sub${item} Dropdown form-control`;
                                var Label = document.createElement('option')
                                Label.disabled = true;
                                Label.selected = true;
                                Label.hidden = true;
                                Label.innerText = `Add a Topping?`;
                                Label.value = "default";
                                Dropdown.appendChild(Label);
                                for (Topping in response[item]["Toppings"]){
                                    var Option = document.createElement('option');
                                    Option.value = response[item]["Toppings"][Topping];
                                    var TextNode = document.createTextNode(response[item]["Toppings"][Topping]);
                                    Option.appendChild(TextNode);
                                    Dropdown.appendChild(Option);
                                }
                                newCardBody.appendChild(Dropdown)
                            }
                            var newCard = document.createElement("div");
                            newCard.className = "ItemCard card bg-dark m-2";
                            newCard.appendChild(newCardBody);
                            var newColumn = document.createElement("div");
                            newColumn.className = "Card col-sm-3";
                            newColumn.appendChild(newCard);
                            ResponseField.append(newColumn);
                        }
                    }
                document.querySelectorAll(".Price").forEach((PriceButton) => {
                    PriceButton.addEventListener("click",(event) => {
                        if (PriceButton.className.includes("btn-success")){
                            var size = "Small"
                        }
                        else {
                            var size = "Large"
                        }
                        if (Selection != "Subs"){
                            var Data = {"id": CartItems.length.toString(), "type":Selection,"name":PriceButton.parentElement.querySelector("h6").innerText,"price":PriceButton.innerText.replace("$",""),"Size":size};
                        }
                        else{
                            console.log(PriceButton.parentElement.querySelector(".Dropdown").value)
                            var price = parseFloat(PriceButton.innerText.replace("$",""));
                            if (PriceButton.parentElement.querySelector(".Dropdown").value != "default"){
                                price += .5;
                            }
                            var Data = {"id": CartItems.length.toString(), "type":Selection,"name":PriceButton.parentElement.querySelector("h6").innerText,"price":price.toFixed(2),"Size":size,"Toppings":PriceButton.parentElement.querySelector(".Dropdown").value};
                        }
                        CartItems.push(Data);
                        Added.innerText = `Successfully added ${Data["Size"]} ${Data["name"]} to cart.`;
                        Added.hidden = false;
                        localStorage.setItem("CartItems",JSON.stringify(CartItems));
                    })
                })
                }
                if (Selection == "Pastas" || Selection == "Salads"){
                    for (item in response){
                        var newTitle = document.createElement("h6");
                        newTitle.className = "card-title text-white bg-dark";
                        newTitle.innerHTML = `${response[item].name}`;
                        var newButton = document.createElement("a");
                        if (Username != null){
                            newButton.className = "Pricing btn btn-success m-2";
                        }
                        else {
                            newButton.className = "Pricing btn btn-success m-2 disabled";
                        }
                        newButton.innerHTML = `$${response[item].price}`
                        var newCardBody = document.createElement("div");
                        newCardBody.className = "card-body";
                        newCardBody.appendChild(newTitle);
                        newCardBody.appendChild(newButton);
                        var newCard = document.createElement("div");
                        newCard.className = "ItemCard card bg-dark";
                        newCard.appendChild(newCardBody);
                        var newColumn = document.createElement("div");
                        newColumn.className = "Card col-sm-3";
                        newColumn.appendChild(newCard);
                        ResponseField.append(newColumn);
                    }
                }
                document.querySelectorAll(".Pricing").forEach((PriceButton) => {
                    PriceButton.addEventListener("click",(event) => {
                        var Data = {"id": CartItems.length.toString(), "type":Selection,"name":PriceButton.parentElement.querySelector("h6").innerText,"price":PriceButton.innerText.replace("$","")};
                        CartItems.push(Data);
                        Added.innerText = `Successfully added ${Data["name"]} to cart.`;
                        Added.hidden = false;
                        localStorage.setItem("CartItems",JSON.stringify(CartItems));
                    })
                })
            }
            const AjaxSqlRequest = new FormData();
            if (Selection != ""){
                AjaxSqlRequest.append("Selection",Selection);
                AjaxSqlRequest.append("csrfmiddlewaretoken",CSRFToken)
                request.send(AjaxSqlRequest);
            }
        });
    });
})