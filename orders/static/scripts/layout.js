document.addEventListener('DOMContentLoaded', function(){
    const PizzaButton = document.querySelector(".Pizza");
    const SubButton = document.querySelector(".Sub");
    const PastaButton = document.querySelector(".Pasta");
    const SaladButton = document.querySelector(".Salad");
    const PlatterButton = document.querySelector(".Platter");
    const CSRFToken = document.querySelector("input[name='csrfmiddlewaretoken']").value;
    const ResponseField = document.querySelector(".Response");

    let buttons = document.querySelectorAll('.Selector');
    buttons.forEach((btn) => {
        btn.addEventListener("click", (event) => {
            document.querySelectorAll(".Response .Card").forEach(div => div.remove());
            buttons.forEach((btn) => {
                if (btn.className.indexOf("btn-dark") != -1){
                    btn.className = btn.className.replace("btn-dark", "btn-outline-dark");
                }
            })
            let Selection = event.target.innerHTML;
            event.target.className = event.target.className.replace("btn-outline-dark", "btn-dark");
            const request = new XMLHttpRequest();
            request.open('POST', '/Menu');
            request.onload = () => {
                const response = JSON.parse(request.responseText);
                for (var i = 0; i < response.length; i++){
                    if (response[i].size !== undefined){
                        var newTitle = document.createElement("h6");
                        newTitle.className = "card-title text-white bg-dark";
                        newTitle.innerHTML = `${response[i].size} ${response[i].name}`;
                        var newButton = document.createElement("a");
                        newButton.className = "btn btn-outline-success bg-white";
                        newButton.innerHTML = `$${response[i].price}`
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
                    else{
                        var newTitle = document.createElement("h5");
                        newTitle.className = "card-title text-white bg-dark";
                        newTitle.innerHTML = response[i].name;
                        var newButton = document.createElement("a");
                        newButton.className = "btn btn-outline-success bg-success";
                        newButton.innerHTML = `$${response[i].price}`
                        var newCardBody = document.createElement("div");
                        newCardBody.className = "card-body";
                        newCardBody.appendChild(newTitle);
                        newCardBody.appendChild(newButton);
                        var newCard = document.createElement("div");
                        newCard.className = "ItemCard card bg-dark";
                        newCard.appendChild(newCardBody);
                        var newColumn = document.createElement("div");
                        newColumn.className = "col-sm-3 m-2";
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