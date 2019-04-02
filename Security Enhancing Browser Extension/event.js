chrome.runtime.onMessage.addListener(function(request,sender,sendResponse){
if(request.val=="checkPwd")
{
    alert("Uh Oh!! Looks like you are using the same password")
    //sendResponse({checked:"true"})
}
chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
    chrome.tabs.sendMessage(tabs[0].id, {todo:"checked"});
});
})