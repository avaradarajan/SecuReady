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
var passwordList = []
var parentPasswordKey = null
var saltValue = null

//Listen to incoming messages from content script
chrome.runtime.onMessage.addListener(function(request,sender,sendResponse){
usernameValue = request.un
passwordValue = request.pswd
pageType = request.pt
domainName = request.url
//lStorage.clear()

//Create a salt for the user for the first time only. This will be used for the hashing
var existingSalt = JSON.parse(lStorage.getItem('salt'))
if(existingSalt==null)
{
    console.log("Creating salt")
    var val = CryptoJS.lib.WordArray.random(128/8).toString()
    lStorage.setItem('salt',JSON.stringify(val))
}
saltValue = lStorage.getItem('salt')
console.log("global salt value - "+saltValue)


//Create Password List if it does not exist
//Sample structure
//"passwordList":[ {"domainName":{username:<name>,password:<pwd>}},{"domainName2":{username:<name2>,password:<pwd2>}},....]
parentPasswordKey = JSON.parse(lStorage.getItem('passwordList'))
if(parentPasswordKey==null)
{
  parentPasswordKey = []
  lStorage.setItem('passwordList',JSON.stringify(parentPasswordKey))
}

//If toStore is TRUE and pageType
if(request.store && pageType== "signup")
{
    console.log("Salt in store"+saltValue)
    hashedPassword = CryptoJS.PBKDF2(passwordValue, saltValue, { keySize: 512/32,iterations:10 }).toString();
    console.log("Hashed Password - "+hashedPassword)
    console.log("Inside BG storing function")
    var createNeeded = true;
    //if entry is already there, just update the credentials - Update Password case
    for (var key in parentPasswordKey) {
       if (parentPasswordKey.hasOwnProperty(key) && createNeeded)
       {
            if (parentPasswordKey[key].hasOwnProperty(domainName))
            {

                    console.log("Updating -> " + parentPasswordKey[key][domainName]);
                    parentPasswordKey[key][domainName].username = usernameValue
                    parentPasswordKey[key][domainName].password = hashedPassword
                    lStorage.setItem('passwordList',JSON.stringify(parentPasswordKey))
                    createNeeded = false;
                    break
            }
        }
    }
    //If new entry has to be created - New account credentials use case
    if(createNeeded)
            {
                console.log("Creating entry in pass List")
                var obj = {}
                obj[domainName] =  {
                    username:usernameValue,
                    password:hashedPassword
                }
                console.log("Res = "+parentPasswordKey)
                parentPasswordKey.push(obj)
                console.log(parentPasswordKey)
                lStorage.setItem('passwordList',JSON.stringify(parentPasswordKey))

            }

}
//If toStore is FALSE and page type is Signup then check the existing passwords and check if it already matching with any entry.
//If yes, return useCase=0 , meaning FAIL to raise alert
//Else return useCase=1, meaning SUCCESS
if (request.store==null && pageType == "signup")
{
        useCase = 0
        storeVal = true
        console.log("Salt value check - "+saltValue)
        hashedPassword = CryptoJS.PBKDF2(passwordValue, saltValue, { keySize: 512/32,iterations:10 }).toString();
        for (var key in parentPasswordKey) {
            if (parentPasswordKey.hasOwnProperty(key)) {
            for(var k in parentPasswordKey[key])
            {
                if (parentPasswordKey[key].hasOwnProperty(k)) {

                    if(hashedPassword == parentPasswordKey[key][k].password)//retrieve the stored passwords
                    {
                        storeVal = false
                    }
                 }
            }
            }
        }

        if(storeVal)
            useCase = 1
        sendResponse({result: useCase});
}
//As per project specification, assuming we have convinced users to use unique passwords, first check if the current domain's password matches the password entered.
//if YES, return SUCCESS and we can avoid iterating the list.
//Else, Iterate through the list and send SUCCESS or FAIL accordingly
//If yes, return useCase=0 , meaning FAIL to raise alert
//Else return useCase=1, meaning SUCCESS
else if(pageType == "login")
{
        useCase = 0 //0 represents fail, 1 represents success
        var checkVal = true //If it is needed to iterate
        var otherRecords = false //if password is present in the other set
        console.log("Salt value check login - "+saltValue)
        hashedPassword = CryptoJS.PBKDF2(passwordValue, saltValue, { keySize: 512/32,iterations:10 }).toString();
        for (var key in parentPasswordKey) {
            if (parentPasswordKey.hasOwnProperty(key) && checkVal)
            {
                if (parentPasswordKey[key].hasOwnProperty(domainName))
                {

                    console.log("Checking login -> " + parentPasswordKey[key][domainName]);
                    if(parentPasswordKey[key][domainName].password == hashedPassword)
                    {
                        checkVal = false
                        useCase = 1
                    }
                }
            }
        }
        if(checkVal)
        {

            for (var key in parentPasswordKey) {
                if (parentPasswordKey.hasOwnProperty(key)) {
                for(var k in parentPasswordKey[key])
                {
                 if (parentPasswordKey[key].hasOwnProperty(k)) {
                    if(hashedPassword == parentPasswordKey[key][k].password)//retrieve the stored passwords
                    {
                        otherRecords = true
                    }
                 }
                }
            }
            }
        }

        if(otherRecords)
            useCase = 0
        else
            useCase = 1
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
return true;
})

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