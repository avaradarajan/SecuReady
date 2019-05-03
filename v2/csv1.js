var activeForm = null
var pageType = null
var userNameElement = null
var passwordElement = null
$(function() {
domainName = document.domain
var body = document.querySelector("body")
body.addEventListener('click', function(){
    if(document.activeElement.tagName == 'INPUT')
    {
        activeForm = document.activeElement.closest('form')
        //console.log(activeForm)
        if(activeForm)
        {
            var passwordField = activeForm.querySelectorAll("input[type='password']")
            var submitButton = activeForm.querySelector("input[type='submit']")
            var allInputFieldsInActiveForm = activeForm.querySelectorAll("input:not([type='hidden'])")
            //console.log(allInputFieldsInActiveForm.length)
            if(passwordField.length>0)
            {
                if(passwordField.length==1 && allInputFieldsInActiveForm.length<=3)
                {
                    pageType = "login"
                }
                else if(passwordField.length>=1 || allInputFieldsInActiveForm.length>3)
                {
                    pageType = "signup"
                }
                //console.log(pageType)
                for(i=0;i<allInputFieldsInActiveForm.length;i++)
                {
                    if(allInputFieldsInActiveForm[i].getAttribute("type") == "password")
                    {
                        userNameElement = allInputFieldsInActiveForm[i-1]
                        passwordElement = allInputFieldsInActiveForm[i]
                        break;
                    }
                }
                submitButton.addEventListener('focus', logClick.bind(this,userNameElement,passwordElement,pageType));
            }
        }
    }
});
})

function logClick(userName,password,page,event) {
  console.log("---------------Content script onsubmit")
  event.preventDefault();
  textContent = `Form Submitted! Time stamp: ${event.timeStamp}`;
  console.log(userName.value)
  console.log(password.value)
  console.log(document.domain)
  console.log(activeForm)
  console.log("-------------------------------------")
  chrome.runtime.sendMessage({todo : "checkLogic", un:userName.value, pswd:password.value, url:document.domain, pt:page},
  function(response) {
    console.log(response.result);
    if(!response.result)
    {
            swal({
        title: "Uh oh!!",
        text: " Looks like you are already using the password for some other site. Please use a different password everytime!",
        icon: "warning",
  });
    }
   }
   )
  /*if(password.value == "h"){

    $(activeForm).submit()}
  else
    return false;*/
}

chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
  if (msg.action == 'warn') {
  swal({
    title: "Uh oh!!",
    text: " Looks like you are already using the password for some other site. Please use a different password everytime!",
    icon: "warning",
  });
  }//if
});