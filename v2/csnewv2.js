var activeForm = null
var pageType = null
var userNameElement = null
var passwordElement = null
var storeVal = false
$(function() {
domainName = document.domain
//var key128Bits = CryptoJS.PBKDF2("Secret", "123", { keySize: 128/32 });
console.log(key128Bits)
var allForms = document.querySelectorAll("form")
var formsWithPasswordField = null
for(i=0;i<allForms.length;i++)
{
    formsWithPasswordField = allForms[i].querySelectorAll("input[type='password']")
    if(formsWithPasswordField[0]!=null)
    {
        console.log(formsWithPasswordField[0])
        formsWithPasswordField[0].addEventListener('blur', getFormDetails.bind(this,userNameElement,passwordElement))
    }

}
})

function storeCredentials(userName,password,page,event)
{
  if(storeVal)
  {
    chrome.runtime.sendMessage({todo : "storeCreds", un:userName.value, pswd:password.value, url:document.domain, pt:page, store:storeVal},
    function(response) {})
  }

}
function getFormDetails(userName,password,event) {
  console.log("---------------Content script onsubmit")
  textContent = `Form Submitted! Time stamp: ${event.timeStamp}`;
  activeForm = event.srcElement.closest('form')
  console.log("-------------------------------------")
  if(activeForm)
  {
            var passwordField = activeForm.querySelectorAll("input[type='password']")
            //var submitButton = activeForm.querySelector("*[type='submit']")
            var allInputFieldsInActiveForm = activeForm.querySelectorAll("input:not([type='hidden'])")
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
            }
  }
  activeForm.addEventListener('submit', storeCredentials.bind(this,userNameElement,passwordElement,pageType));
  console.log(userNameElement)
  console.log(passwordElement)
  console.log(pageType)
  var resp = null
  if(pageType == "signup")
  {
    chrome.runtime.sendMessage({todo : "checkLogic", un:userNameElement.value, pswd:passwordElement.value, url:document.domain, pt:pageType},
    function(response) {
     resp = response.result
     console.log(response.result);
     if(response.result==0)
     {
         passwordElement.value = ""
         storeVal = false
         swal({
             title: "Uh Oh!!",
             text: "You are already using this password for another website. Please use a unique password!!",
             icon: "warning",
         });
     }
     else
     {
         storeVal = true
     }
    }
    )
  }
  else if(pageType=="login")
  {
    chrome.runtime.sendMessage({todo : "checkLogictwo", un:userNameElement.value, pswd:passwordElement.value, url:document.domain, pt:pageType},
    function(response) {
     resp = response.result
     console.log(response.result);
     if(response.result==0)
     {
         passwordElement.value = ""
         storeVal = false
         swal({
             title: "Ooops!!",
             text: "You have entered the password of another website. Please provide the correct password!!",
             icon: "warning",
         });
     }
    }
   )
  }
}
