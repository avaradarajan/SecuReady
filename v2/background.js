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
/* store top 10k sites in db, should be one time operation only */
chrome.runtime.onInstalled.addListener(function(details){

    console.log("first install")

    Papa.parse("top-10k.csv", {
      download:true,
      complete: function(results) {
        for(k = 1; k < results.data.length; k++) {
          console.log(results.data.length)
            lStorage.setItem(results.data[k][1], "1")
        }
      console.log("finished loading")
      console.log(lStorage.getItem("youtube.com"))
      }
    })
});





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
        console.log(key)
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
else if(pageType == "login")
{
        useCase = 0 //0 represents fail, 1 represents success
        var checkVal = true //If it is needed to iterate
        var otherRecords = false //if password is present in the other set
        record = JSON.parse(lStorage.getItem(domainName))
        console.log("Actual site")
            console.log(domainName)
            console.log(record)

        if(record.password == passwordValue)
        {
            console.log("Actual site")
            console.log(domainName)
            console.log(record)
            checkVal = false
            useCase = 1
        }
        if(checkVal)
        {
            console.log("Here->s")
            Object.keys(lStorage).forEach(function(key){
            console.log(key)
            if(key!=domainName)
            {
                record = JSON.parse(lStorage.getItem(key))

                if(passwordValue == record.password)//retrieve the stored passwords
                {
                    console.log(record)
                    otherRecords = true
                }
            }
            });
        }
        if(otherRecords)
            useCase = 0
        else
            useCase = 1
        console.log(useCase)
        sendResponse({result: useCase});
}
if(request.todo=="searchDB"){
    console.log("in if bk")
    console.log(request.val)
    if(lStorage.getItem(request.val) == null) {
      sendResponse({return:"null"})
    }

    else{
      sendResponse({return:"proceed"})
    }
  }

  if(request.todo=="remember"){
    lStorage.setItem(request.val, "1")
    sendResponse({return:"nothing"})
  }

console.log(useCase)
return true;
})
