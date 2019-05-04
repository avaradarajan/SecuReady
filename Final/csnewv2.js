var activeForm = null
var pageType = null
var userNameElement = null
var passwordElement = null
var storeVal = false
var hashedPassword = null
var lStorage = window.localStorage
var salt = null

//Use case 3 check for different type of click events
$('a').contextmenu(function(e) {
  var link = $(this).attr("href")
  //e.preventDefault();
  /* extract domain and do modifications according to DB */

  console.log(link)
  if(link.includes("www."))
  {
      var hostname = (new URL(link)).hostname;
      console.log(hostname)

      /* if hostname contains www, remove it */

      var searchItem = hostname.replace("www.", "")
      console.log("Search item is")
      console.log(searchItem)
      chrome.runtime.sendMessage({todo : "searchDB", val : searchItem},
        function (response) {
          console.log(response.return)
          if(response.return=="null"){
          window.contextmenu=null;
          console.log("in if cs")

          console.log("not allowed")
          swal({
            title:"Are you sure you want to do proceed?",
            text:"We recommend not to proceed for security reasons",
            icon: "warning",
            buttons:{
              Proceed:true,
              always: {
                text:"Always for this site",
                value:"always",
              },
              cancel:"Cancel",
            },
          })
          .then((value) => {
            switch(value) {
              case "Proceed":
              //console.log("OK")
              window.open(link);
              break;

              case "always":
              //console.log("always")
              chrome.runtime.sendMessage({todo : "remember", val : searchItem})
              window.open(link);
              break;

              default:
              //console.log("cancel")
            }
          });
        }
        else if(response.return=="proceed")
        {
        }
        })
  }
  else
  {
    window.location.href = link
  }
});

$('a').click(function(e) {
  console.log("Url clicked")
  var link = $(this).attr("href")
  if(link=="" || link=='#'){
  }
  else{
  e.preventDefault();

  /* extract domain and do modifications according to DB */

  console.log(link)
  if(link.includes("www."))
  {
      var hostname = (new URL(link)).hostname;
      console.log(hostname)

      /* if hostname contains www, remove it */

      var searchItem = hostname.replace("www.", "")
      console.log("Search item is")
      console.log(searchItem)
      chrome.runtime.sendMessage({todo : "searchDB", val : searchItem},
        function (response) {
          console.log(response.return)
          if(response.return=="null"){
          console.log("in if cs")

          console.log("not allowed")
          swal({
            title:"Are you sure you want to do proceed?",
            text:"We recommend not to proceed for security reasons",
            icon: "warning",
            buttons:{
              Proceed:true,
              always: {
                text:"Always for this site",
                value:"always",
              },
              cancel:"Cancel",
            },
          })
          .then((value) => {
            switch(value) {
              case "Proceed":
              //console.log("OK")
              if(e.ctrlKey){
                window.open(link);
                break;
              }
              window.location.href = link
              break;

              case "always":
              //console.log("always")
              if(e.ctrlKey){
                chrome.runtime.sendMessage({todo : "remember", val : searchItem})
                window.open(link);
                break;
              }
              chrome.runtime.sendMessage({todo : "remember", val : searchItem})
              window.location.href = link
              break;

              default:
              //console.log("cancel")
            }
          });
        }
        else if(response.return=="proceed")
        {
          window.location.href = link
        }
      })
  }
  else
  {
    window.location.href = link
  }
}
});

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
  var buttonToAddListenerTo = null
  textContent = `Form Submitted! Time stamp: ${event.timeStamp}`;
  //Getting form dynamically based on the form he is currently working/typing with
  activeForm = event.srcElement.closest('form')

  //Determine the page type i.e. SignUp/Login using number of password fields and number of input fields overall
  if(activeForm)
  {
            var passwordField = activeForm.querySelectorAll("input[type='password']")
            var submitButton = activeForm.querySelector("input[type='submit']")
            var buttonType = activeForm.querySelector("button")
            var pageTypeIdentified = false
            if(submitButton!=null)
            {
                var checkText = submitButton.innerHTML.toLowerCase()
                console.log(checkText)
                if(checkText.includes("sign up") || checkText.includes("register") || checkText.includes("signup") || checkText.includes("create account"))
                {
                    pageType = "signup"
                    pageTypeIdentified = true
                }
                else if(checkText.includes("sign in") || checkText.includes("signin") || checkText.includes("log in") || checkText.includes("login"))
                {
                    pageType = "login"
                    pageTypeIdentified = true
                }
                console.log("Submit present"+pageType)

            }
            else if(buttonType!=null)
            {
                buttonToAddListenerTo = buttonType
                var checkText = buttonType.innerHTML.toLowerCase()
                if(checkText.includes("sign up") || checkText.includes("register") || checkText.includes("signup") || checkText.includes("create account"))
                {
                    pageType = "signup"
                    pageTypeIdentified = true
                }
                else if(checkText.includes("sign in") || checkText.includes("signin") || checkText.includes("log in") || checkText.includes("login"))
                {
                    pageType = "login"
                    pageTypeIdentified = true
                }
                console.log(buttonType.innerHTML)
                console.log("Submit button"+pageType)
            }
            var allInputFieldsInActiveForm = activeForm.querySelectorAll("input:not([type='hidden']):not([aria-hidden='true'])")
            if(passwordField.length>0)
            {
                console.log("PT"+pageTypeIdentified)
                if(passwordField.length==1 && allInputFieldsInActiveForm.length<=3 && !pageTypeIdentified)
                {
                    pageType = "login"
                }
                else if((passwordField.length>=1 || allInputFieldsInActiveForm.length>3) && !pageTypeIdentified)
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
  if(buttonToAddListenerTo!=null)
  {
    buttonToAddListenerTo.addEventListener('click', storeCredentials.bind(this,userNameElement,passwordElement,pageType));
  }
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
             text: "The entered password is already in use!!! For security reasons please enter a new password!!",
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
