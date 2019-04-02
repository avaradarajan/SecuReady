$(function() {
chrome.storage.sync.set({'anandh':'anandhpwd'},function() {
          console.log('Value is set to ');
        });
chrome.storage.sync.set({'viru':'virupwd'});
chrome.storage.sync.get('anandh', function(result) {
          console.log('Value currently is ' + result.anandh);
        });
        });

$(function() {
    $('#sub').click(function(){
        chrome.storage.sync.get('anandh', function(result) {
            console.log('Value currently is ' + result.anandh);
            var notif = {
                type: 'basic',
                iconUrl: 'icon166.png',
                title: 'change password',
                message: "Uh Oh!!Looks like you are already using this password"
            };
            chrome.notifications.create('pdw',notif);
        });
    })
});

