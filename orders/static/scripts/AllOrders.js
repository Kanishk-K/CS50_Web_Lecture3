document.addEventListener("DOMContentLoaded",function(){
    const CSRFToken = document.getElementsByName("csrfmiddlewaretoken")[0].value;
    //For all Complete buttons present on the screen, when they are clicked update the status of the order on the server and delete the
    //Card from the screen.
    document.querySelectorAll(".Completed").forEach((CompleteButton) => {
        CompleteButton.addEventListener("click",()=>{
            var StatusTag = CompleteButton.parentElement.querySelector(".Status");
            StatusTag.className = "Status text-success";
            StatusTag.innerText = "Completed";
            var Id = CompleteButton.parentElement.querySelector(".Id").innerText;
            const request = new XMLHttpRequest();
            request.open("POST", "/AllOrders");
            request.onload = () => {
                CompleteButton.parentElement.remove()
            }
            const OrderPackage = new FormData();
            OrderPackage.append("id",parseInt(Id.replace("Order#","")));
            OrderPackage.append("action","Completed");
            OrderPackage.append("csrfmiddlewaretoken",CSRFToken);
            request.send(OrderPackage);
        })
    })
    //If any Ready button is clicked update the status on the server and set the Order's status as Ready on the screen.
    document.querySelectorAll(".Ready").forEach((ReadyButton) => {
        ReadyButton.addEventListener("click",()=>{
            var StatusTag = ReadyButton.parentElement.querySelector(".Status");
            StatusTag.className = "Status text-warning";
            StatusTag.innerText = "Ready";
            var Id = ReadyButton.parentElement.querySelector(".Id").innerText;
            const request = new XMLHttpRequest();
            request.open("POST", "/AllOrders");
            request.onload = () => {
                ReadyButton.remove();
            }
            const OrderPackage = new FormData();
            OrderPackage.append("id",parseInt(Id.replace("Order#","")));
            OrderPackage.append("action","Ready");
            OrderPackage.append("csrfmiddlewaretoken",CSRFToken);
            request.send(OrderPackage);
        })
    })
})