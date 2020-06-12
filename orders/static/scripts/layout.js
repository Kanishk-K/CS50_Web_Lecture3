document.addEventListener('DOMContentLoaded', function(){
    const PizzaButton = document.querySelector(".Pizza");
    const SubButton = document.querySelector(".Sub");
    const PastaButton = document.querySelector(".Pasta");
    const SaladButton = document.querySelector(".Salad");
    const PlatterButton = document.querySelector(".Platter");
    const CSRFToken = document.querySelector("input[name='csrfmiddlewaretoken']").value;
    const ResponseField = document.querySelector(".Response");

    let buttons = document.querySelectorAll('.Selector');
    const PizzaObjects = ["Pizza_Type","Topping_Type","Size"];
    buttons.forEach((btn) => {
        btn.addEventListener("click", (event) => {
            document.querySelectorAll(".Response .Card").forEach(div => div.remove());
            buttons.forEach((btn) => {
                if (btn.className.indexOf("btn-dark") != -1){
                    btn.className = btn.className.replace("btn-dark", "btn-outline-dark");
                }
            })
            let Selection = event.target.innerHTML;
            let EventObject = event.target;
            EventObject.className = EventObject.className.replace("btn-outline-dark", "btn-dark");
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
                        DropdownDiv.appendChild(Dropdown);
                        newForm.appendChild(DropdownDiv);
                        ResponseField.appendChild(newForm);
                    }
                    var FilledText = document.createElement('p');
                    FilledText.className = "text-white";
                    FilledText.hidden = true;
                    newForm.appendChild(FilledText);
                    var newButton = document.createElement('button');
                    newButton.className = "btn btn-success ml-5 mr-5 mt-2 mb-2";
                    newButton.innerText = "Confirm Order"
                    newButton.disabled = true;
                    newForm.appendChild(newButton);
                    let Dropdowns = document.querySelectorAll(".Dropdown");
                    Dropdowns.forEach((Dropdown) => {
                        Dropdown.addEventListener("change", (event) => {
                            var allSelected = true;
                            for (var i = 0; i < PizzaObjects.length; i++){
                                if (allSelected == true){
                                    if (document.querySelector(`.${PizzaObjects[i]}`).value == 'default'){
                                        console.log("Not all selected.")
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
                            newSmallButton.className = "btn btn-outline-success bg-white m-2";
                            newSmallButton.innerHTML = `$${response[item].SmallPrice}`;
                            var newLargeButton = document.createElement("a");
                            newLargeButton.className = "btn btn-outline-danger bg-white m-2";
                            newLargeButton.innerHTML = `$${response[item].LargePrice}`;
                            var newCardBody = document.createElement("div");
                            newCardBody.className = "card-body";
                            newCardBody.appendChild(newTitle);
                            newCardBody.appendChild(newSmallButton);
                            newCardBody.appendChild(newLargeButton);
                            var newCard = document.createElement("div");
                            newCard.className = "ItemCard card bg-dark";
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
                                newButton.className = "btn btn-outline-success bg-white m-2";
                            }
                            else {
                                newButton.className = "btn btn-outline-danger bg-white m-2";
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
                }
                if (Selection == "Pastas" || Selection == "Salads"){
                    for (item in response){
                        var newTitle = document.createElement("h6");
                        newTitle.className = "card-title text-white bg-dark";
                        newTitle.innerHTML = `${response[item].name}`;
                        var newButton = document.createElement("a");
                        newButton.className = "btn btn-outline-success bg-white m-2";
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
            }
            const AjaxSqlRequest = new FormData();
            AjaxSqlRequest.append("Selection",Selection);
            AjaxSqlRequest.append("csrfmiddlewaretoken",CSRFToken)
            request.send(AjaxSqlRequest);
        });
    });
})