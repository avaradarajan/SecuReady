var activeForm = null
var pageType = null
var userNameElement = null
var passwordElement = null
var storeVal = false
var hashedPassword = null
var lStorage = window.localStorage
var salt = null
$(function() {
domainName = document.domain //get current domain name

//Get all forms in the page
var allForms = document.querySelectorAll("form")
var formsWithPasswordField = null

//Iterate through all forms in the page and filter all forms with password field
for(i=0;i<allForms.length;i++)
{
    formsWithPasswordField = allForms[i].querySelectorAll("input[type='password']")
    if(formsWithPasswordField[0]!=null)
    {
        console.log(formsWithPasswordField[0])
        //For each of the first password field in the form identified, add a blur event so as to check the password stored for use cases 1 and 2.
        formsWithPasswordField[0].addEventListener('blur', getFormDetails.bind(this,userNameElement,passwordElement))
    }
}
})

//Function called when form is submitted
function storeCredentials(userName,password,page,event)
{
  if(storeVal)
  {
    console.log("Storing the password..")
    chrome.runtime.sendMessage({todo : "storeCreds", un:userName.value, pswd:passwordElement.value, url:document.domain, pt:page, store:storeVal},
    function(response) {})
  }

}
//Function that gets invoked after user enters the password and field goes out of focus
function getFormDetails(userName,password,event) {
  textContent = `Form Submitted! Time stamp: ${event.timeStamp}`;
  //Getting form dynamically based on the form he is currently working/typing with
  activeForm = event.srcElement.closest('form')

  //Determine the page type i.e. SignUp/Login using number of password fields and number of input fields overall
  if(activeForm)
  {
            var passwordField = activeForm.querySelectorAll("input[type='password']")
            //var submitButton = activeForm.querySelector("*[type='submit']")
            var allInputFieldsInActiveForm = activeForm.querySelectorAll("input:not([type='hidden']):not([aria-hidden='true'])")
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

  //Adding a submit event to the submit button of the form to store credentials in our password manager
  activeForm.addEventListener('submit', storeCredentials.bind(this,userNameElement,passwordElement,pageType));
  console.log(userNameElement)
  console.log(passwordElement)
  console.log(pageType)

  var resp = null
  //Use case 1 logic check
  //Send the password entered to background script to evaluate use case 1. Alert based on response
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
        console.log("Store")
         storeVal = true
     }
    }
    )
  }
  //Use case 2 check
  else if(pageType=="login")
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
             title: "Ooops!!",
             text: "You have entered the password of another website. Please provide the correct password!!",
             icon: "warning",
         });
     }
    }
   )
  }
}