I. Overview
Passwords are means by which a genuine user proves that he/she is authorized to access a device/system/object in general. Using the same passwords across accounts is one of the ways to become vulnerable to an attack. If an attacker cracks the password of a single account, he could potentially gain to access to all other accounts using the same password. Consequence of such attacks leads to access to your personal information, and thus you could become the victim of identity theft. Therefore, passwords are critical to ensure privacy and security of your systems/accounts.
Also, security researchers have argued that most users would be protected if software would stop them from visiting unpopular websites. We have addressed these concerns in our project.
In this project, we have developed a Chrome browser-based browser extension that will encourage users avoid password reuse, prevent them from phishing attacks and generally help them browse through the web content more securely.

Our extension covers the following use cases:
1) Detecting Password Reuse
Given, the user has installed Chrome and the plugin for the first time and has no previous account setup yet,
When, the user is trying to create an account / sign up in a site
Then, as soon as the user repeats a password he has already used, we warn him and ensure that he enters a unique password. If it was unique in the first place, user proceeds to setting up the account, without any warnings.
2) Detect the entering of Passwords on the wrong website
Given, the extension has convinced users to chose unique passwords across their accounts,
When, the user tries to login to a web site/account
Then, if the user enters the password of an account that is different from the account he is currently in, then we immediately alert the user and protect him from falling victim to phishing attacks.

3) Secure link clicking behavior
Given, the user is currently in a web page with many links to other pages/sites
When, the user clicks on a link
Then, If the domain of the web page/site is different from the recommended list of websites, we warn the user against visiting the site and leave the choice of proceeding to the site, to the user. We have also provided the option to dismiss the warning once or forever.


II. Setting up the Project

1. Pull the entire source code from – 
https://github.com/avaradarajan/SecurityEnhancingBrowserExtension
2. Unzip the folder and place it anywhere in your system.
3. Open your chrome browser profile and enter chrome://extensions in the address bar.

4. Enable the Developer mode option on the top right corner.
5. Once you enable the developer mode, there will be options to load the extension. Choose “Load Unpacked” button as below.
 
6. In the file explorer, choose the parent folder of the repository you just downloaded. i.e. the immediate parent folder where your manifest.json and other extension files are packed. 
7. In our project, it is the Final folder that you have to choose and proceed.
8. Once you load the folder, you should get the following plugin block in the page.

9. Click on Details (shown above), and enable “Allow in Incognito” if you want the plugin to even work In the Incognito mode.
10. Setup is complete. Have a secure browsing experience.
You should be getting an icon similar to the below added to the plugins section.

11. You can also choose to disable the plugin by clicking on the toggle highlighted below.


Technologies/Libraries Used

• JavaScript / JQuery – For use cases
• Papa Parser library – For parsing Alexa file
• SweetAlerts.js package for alert popups
• Libraries in CryptoJS for Hashing passwords
• Chrome APIs 
• Chrome localStorage




