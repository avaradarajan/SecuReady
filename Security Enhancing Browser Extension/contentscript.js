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

/* new */
var lstorage = window.localStorage
lstorage.setItem("https://www.securitee.org", "1")
lstorage.setItem("https://blackboard.stonybrook.edu", "2")

var test = lstorage.getItem("https://blackboard.stonybrook.edu")
console.log(test)

var test1 = lstorage.getItem("lllall")
console.log(test1)

console.log("hiii hello")
var x = document.links.length;
console.log(x)

var x = document.links[0].href;
console.log(x)

$('a').click( function(e) {/*e.preventDefault();*/
  console.log("Url clicked")
  var link = $(this).attr("href")
  console.log(link)
  
  if(lstorage.getItem(link) == null) {
    e.preventDefault();

    /* code for popup/alert */
  }

  return true; } );
/*new end*/

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
/*document.getElementById("Password").onkeyup = function() {
myFunction()};
*/
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
