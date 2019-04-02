/*$(function() {
document.getElementById("btnSubmitLogin").addEventListener("click",
    function() {
  window.postMessage({ type: "FROM_PAGE", text: "Hello from the webpage!" }, "*");
}, false);

var port = chrome.runtime.connect();

window.addEventListener("message", function(event) {
  // We only accept messages from ourselves
  if (event.source != window)
    return;

  if (event.data.type && (event.data.type == "FROM_PAGE")) {
    console.log("Content script received: " + event.data.text);
    port.postMessage(event.data.text);
  }
}, false);
})*/
$(function() {
var loginPage = false;
var ip = document.getElementsByTagName("input");
for (i = 0; i < ip.length; i++) {
  if(ip[i].getAttribute("type")=="password")
  {
    loginPage = "true";
    break;
  }
}
/*document.getElementById("btnSubmitLogin").onclick = function() {
myFunction()};

function myFunction(str1) {
  //alert(document.getElementById("Password").value);
  //var res = str1.concat(document.getElementById("Password").value);
  alert(document.getElementById("Password").value)
  chrome.runtime.sendMessage({todo : "checkPwd", val: document.getElementById("Password").value},function(response){alert(response.checked)})
  chrome.runtime.onMessage.addListener(function(request,sender,sendResponse){
if(request.todo="checked")
{
    alert("checked")
}
})
}*/
document.getElementById("Password").onkeyup = function() {
myFunction()};

function myFunction(str1) {
  //alert(document.getElementById("Password").value);
  //var res = str1.concat(document.getElementById("Password").value);
  console.log(document.getElementById("Password").value)
  chrome.runtime.sendMessage({todo : "checkPwd", val: document.getElementById("Password").value})//,function(response){alert(response.checked)})

}
chrome.runtime.onMessage.addListener(function(request,sender,sendResponse){
if(request.todo="checked")
{
    console.log("checked")
}
})
})
