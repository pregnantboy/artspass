// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });

// Initialize Firebase

var config = {
  apiKey: "AIzaSyA4p-JEtAvGo5BFKUilv0nDLKbX7qS4e0E",
  authDomain: "artspass-dev.firebaseapp.com",
  databaseURL: "https://artspass-dev.firebaseio.com",
  projectId: "artspass-dev",
  storageBucket: "",
  messagingSenderId: "542991076028"
};
firebase.initializeApp(config);

// Get a reference to the database service
var database = firebase.database();
var ref = database.ref('/arts/accounts/');

var accountsObj = {};

ref.on('child_added', function (data) {
  // send data to browser_action
  addChild(data);
});

ref.on('child_changed', function (data) {
  // send data to browser_action
  addChild(data);
});

ref.on('child_removed', function (data) {
  // send data to browser_action
  removeChild(data);
});

function addChild(child) {
  let childVal = child.val();
  accountsObj[child.key] = {
    username: decrypt(childVal.username),
    password: decrypt(childVal.password),
    site: childVal.site,
    url: childVal.url
  };
}

function removeChild(child) {
  delete accountsObj[child.key];
}

function encypt(text) { return text };
function decrypt(text) { return text };

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log('message received', message.event);
  if (message.event == "onload") {
    sendResponse(accountsObj);
  }
  console.log('reached here');
  if (message.event == "reload") {
    console.log('reloading');
    ref.once('value', function (snapshot) {
      accountsObj = {};
      console.log(snapshot);
      snapshot.forEach( function (child) {
        addChild(child);
      });
      console.log(accountsObj);
      sendResponse(accountsObj);
    });
    return true;    
  }
});