var usernameNameAttribute = null
var passwordNameAttribute = null
var usernameValue = null
var passwordValue = null
var redirectURL = null
var domainName = null
var msg = null
var lStorage = window.localStorage
var storeVal = false
var pageType = null
var useCase = null
chrome.runtime.onMessage.addListener(function(request,sender,sendResponse){
usernameValue = request.un
passwordValue = request.pswd
pageType = request.pt
domainName = request.url
console.log(usernameValue)
console.log(passwordValue)
console.log(pageType)
console.log(domainName)
console.log(request.store)
if(request.store && pageType== "signup")
{
    console.log("Storing block-----")
    var store = {
         username:usernameValue,
         password:passwordValue
    }
    lStorage.setItem(domainName,JSON.stringify(store))
}
if (request.store==null && pageType == "signup")
{
        useCase = 0
        storeVal = true
        Object.keys(lStorage).forEach(function(key){
        record = JSON.parse(lStorage.getItem(key))
        console.log(record)
        if(passwordValue == record.password)//retrieve the stored passwords
          {
            storeVal = false
          }
      });
      if(storeVal)
        useCase = 1
      console.log(useCase)
      sendResponse({result: useCase});
}
console.log(useCase)
return true;
})