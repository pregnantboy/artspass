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
var databaseRef = database.ref('/arts/accounts/');

databaseRef.on('child_added', function(data) {
  // send data to browser_action
});

databaseRef.on('child_changed', function(data) {
  // send data to browser_action
});

databaseRef.on('child_removed', function(data) {
  // send data to browser_action
});
