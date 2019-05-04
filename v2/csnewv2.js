var activeForm = null
var pageType = null
var userNameElement = null
var passwordElement = null
var storeVal = false
$(function() {
//  debugger;
  // swal("Are you sure you want to do this?", {
  //   buttons: ["Oh noez!", "Aww yiss!"],
  // });
domainName = document.domain
//var key128Bits = CryptoJS.PBKDF2("Secret", "123", { keySize: 128/32 });
//console.log(key128Bits)
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

});
$('a').click(function(e) {
  console.log("Url clicked")
  var link = $(this).attr("href")
  e.preventDefault();

  /* extract domain and do modifications according to DB */

  console.log(link)
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
        title:"Are you sure you want to do this?",
        text:"We recommend not to proceed.......",
        icon: "warning",
        buttons:{
          OK:true,
          always: {
            text:"Always for this site",
            value:"always",
          },
          cancel:"Cancel",
        },
      })
      .then((value) => {
        switch(value) {
          case "OK":
          //console.log("OK")
          window.location.href = link
          break;

          case "always":
          //console.log("always")
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
      console.log("in else")
      window.location.href = link
    }
    })

});



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
