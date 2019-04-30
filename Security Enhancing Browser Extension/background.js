var usernameNameAttribute = null
var passwordNameAttribute = null
var usernameValue = null
var passwordValue = null
var redirectURL = null
var domainName = null
var msg = null
var storage = chrome.storage.local
var lStorage = window.localStorage
var cancelVal = false
chrome.runtime.onMessage.addListener(function(request,sender,sendResponse){
console.log(request.un)
console.log(request.pswd)
usernameNameAttribute = request.un
passwordNameAttribute = request.pswd
domainName = request.url
return Promise.resolve("Dummy response to keep the console quiet");
})
chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
  cancelVal = false
    if(details.method == "POST") {
      formData = details.requestBody.formData
      usernameValue = formData[usernameNameAttribute][0]
      passwordValue = formData[passwordNameAttribute][0]
      console.log(formData)
      //Loop through all passwords
      Object.keys(lStorage).forEach(function(key){
        vals = JSON.parse(lStorage.getItem(key))
        console.log(vals)
        if(passwordValue == vals.password)//retrieve the stored passwords
          {
            cancelVal = true
            alert("Uh oh!! Looks like you are already using the password for some other site. Please use a different password everytime")
          }
      });
      if(!cancelVal)
      {
        var store = {
         username:usernameValue,
         password:passwordValue
        }
        lStorage.setItem(domainName,JSON.stringify(store))
      }
      }
      return {cancel : cancelVal}
  },
  {urls: ["<all_urls>"]},
  ["blocking","requestBody"]
);
/*chrome.webRequest.onCompleted.addListener(
  function(details) {
    console.log("Completed")
    },
  {urls: ["<all_urls>"]}
);
chrome.webRequest.onErrorOccurred.addListener(
  function(details) {
    console.log("Error occured  ")
  },
  {urls: ["<all_urls>"]}
);*/