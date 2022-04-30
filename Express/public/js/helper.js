


greeting = function(){
    alert("Hi Dad!")
}

answer = function(){
    alert("no, it's not")    
}

invisible = function(){
    var element = document.getElementById("invisible")
    element.style.visibility = "hidden"
}


setValues = function(){
    const url = document.URL
    const urlSearchParams = new URLSearchParams(url)

    
    const sender = urlSearchParams.get('sender');
    const reciever = urlSearchParams.get('reciever');
    const message = urlSearchParams.get('message');


    document.getElementById("sender_display").innerHTML = sender
    document.getElementById("reciever_display").innerHTML = reciever
    document.getElementById("message_display").innerHTML = message
}
