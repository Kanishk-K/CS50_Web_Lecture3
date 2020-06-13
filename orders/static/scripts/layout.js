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
    const PizzaObjects = ["Pizza_Type","Topping_Type","Size"];
    var CartItems = []
    buttons.forEach((btn) => {
        btn.addEventListener("click", (event) => {
            document.querySelectorAll(".Response .Card").forEach(div => div.remove());
            Added.hidden = true;
            Added.innerText = "";
            buttons.forEach((btn) => {
                if (btn.className.indexOf("btn-dark") != -1){
                    btn.className = btn.className.replace("btn-dark", "btn-outline-dark");
                }
            })
            let Selection = event.target.innerText;
            let EventObject = event.target;
            EventObject.className = EventObject.className.replace("btn-outline-dark", "btn-dark");
            if (Selection == ""){

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
                    var FilledText = document.createElement('p');
                    FilledText.className = "text-white";
                    FilledText.hidden = true;
                    newForm.appendChild(FilledText);
                    var newButton = document.createElement('button');
                    newButton.className = "ConfirmButton btn btn-success ml-5 mr-5 mt-2 mb-2";
                    newButton.innerText = "Add To Cart";
                    newButton.disabled = true;
                    newButton.type = "button";
                    newButton.onclick = () =>{
                        var Data = {"type":"Pizza","Pizza_Type":document.querySelector(`#${PizzaObjects[0]}`).value,"Topping_Type":document.querySelector(`#${PizzaObjects[1]}`).value,"Size":document.querySelector(`#${PizzaObjects[2]}`).value};
                        CartItems.push(Data);
                        Added.innerText = `Successfully added ${Data["Size"]} ${Data["Pizza_Type"]} ${Data["Topping_Type"]} Pizza to cart.`;
                        Added.hidden = false;
                        console.log(CartItems);
                    };
                    newForm.appendChild(newButton);
                    let Dropdowns = document.querySelectorAll(".Dropdown");
                    Dropdowns.forEach((Dropdown) => {
                        Dropdown.addEventListener("change", (event) => {
                            var allSelected = true;
                            for (var i = 0; i < PizzaObjects.length; i++){
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
                                    console.log(PricingResponse)
                                    if (PricingResponse.Error != undefined){
                                        console.log(PricingResponse.Error);
                                        FilledText.hidden=false;
                                        FilledText.innerHTML = PricingResponse.Error;
                                    }
                                    else{
                                        console.log(PricingResponse.Price);
                                        FilledText.innerHTML = `Your order will cost: $${PricingResponse.Price}`;
                                        FilledText.hidden=false;
                                        
                                        if (Username != null){
                                            newButton.disabled = false;
                                        }
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
                        var Data = {"type":Selection,"name":PriceButton.parentElement.querySelector("h6").innerText,"price":PriceButton.innerText,"Size":size};
                        CartItems.push(Data);
                        Added.innerText = `Successfully added ${Data["Size"]} ${Data["name"]} to cart.`;
                        Added.hidden = false;
                        console.log(CartItems);
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
                        var Data = {"type":Selection,"name":PriceButton.parentElement.querySelector("h6").innerText,"price":PriceButton.innerText};
                        CartItems.push(Data);
                        Added.innerText = `Successfully added ${Data["Size"]} ${Data["name"]} to cart.`;
                        Added.hidden = false;
                        console.log(CartItems);
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