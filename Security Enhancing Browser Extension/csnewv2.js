$(function() {
domainName = document.domain
var formElement = document.querySelectorAll("form")
var accountForm = null
for (i = 0; i < formElement.length; i++) {
  var passwordElement = formElement[i].querySelector("input[type=\"password\"]")
  accountForm = formElement[i]
    if(passwordElement != null)
    {
        break;
    }
}
console.log(accountForm)
var userNameElement = null
var allInputElementsInForm = null
allInputElementsInForm = accountForm.querySelectorAll("input")
for (i = 0; i < allInputElementsInForm.length; i++) {
    if(allInputElementsInForm[i].getAttribute("type") == "password")
    {
     userNameElement = allInputElementsInForm[i-1]
     break;
    }
}
console.log(userNameElement)
console.log(passwordElement)
//userNameElement.addEventListener('input', captureValue)
//passwordElement.addEventListener('input', captureValue)
v1 = passwordElement.getAttribute("name")
v2 = userNameElement.getAttribute("name")
chrome.runtime.sendMessage({todo : "checkPwd", un: v2, pswd:v1, url:domainName})
accountForm.addEventListener('submit', logSubmit.bind(this,userNameElement,passwordElement));
//implement storage json for sample site first
})

function captureValue(e) {
  textContent = e.srcElement.value;
  console.log(textContent)
}
function logSubmit(uname,pwd,event) {
  //event.preventDefault();
  textContent = `Form Submitted! Time stamp: ${event.timeStamp}`;
  console.log(uname.value)
  console.log(pwd.value)
  console.log(textContent)
  console.log(document.domain)
}

chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {

  if (msg.action == 'warn') {
  swal({
  title: "Uh oh!!",
  text: " Looks like you are already using the password for some other site. Please use a different password everytime!",
  icon: "warning",
});
    //alert("Uh oh!! Looks like you are already using the password for some other site. Please use a different password everytime")
  }//if
});