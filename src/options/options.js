// Firebase Login

var inputElement;
var uploadedFile;
var invalidFile;
var loginText;
var loginHeader;

document.addEventListener("DOMContentLoaded", function () {
  inputElement = document.getElementById("file-upload");
  uploadedFile = document.getElementById("uploaded-file");
  invalidFile = document.getElementById("invalid-file");
  loginText = document.getElementById("login-text");
  loginHeader = document.getElementById("login-header");
  inputElement.addEventListener("change", handleFiles, false);
  document.getElementById("login").addEventListener("click", login);
  restore_options();
});

var config = {
  apiKey: "AIzaSyA4p-JEtAvGo5BFKUilv0nDLKbX7qS4e0E",
  authDomain: "artspass-dev.firebaseapp.com",
  databaseURL: "https://artspass-dev.firebaseio.com",
  projectId: "artspass-dev",
  storageBucket: "artspass-dev.appspot.com",
  messagingSenderId: "542991076028"
};

firebase.initializeApp(config);

function login() {
  if (firebase.auth().currentUser) {
    console.log("signing out");
    logout();
  } else {
    console.log("signing in");
    chrome.extension.getBackgroundPage().startAuth();
  }
}

function logout() {
  firebase.auth().signOut();
  chrome.identity.getAuthToken({
    interactive: true
  }, function (token) {
    chrome.identity.removeCachedAuthToken({
      token: token
    }, function () {
      console.log("removed token", token);
      loginHeader.innerText = "Login with ARTS account:";
      loginText.innerText = "Login with Google";
    });
  });
}

function handleFiles() {
  var fileList = this.files; /* now you can work with the file list */
  if (fileList.length === 1) {
    var file = fileList[0];
    console.log(file);
    if (file.size > 1000) {
      showInvalidFileText();
      return;
    }
    var fileReader = new FileReader();
    fileReader.onload = function (fileLoadedEvent) {
      var textFromFileLoaded = fileLoadedEvent.target.result;
      if (textFromFileLoaded.length > 0) {
        chrome.storage.sync.set({
          encryptKey: textFromFileLoaded,
          encryptFileName: file.name
        }, function () {
          uploadedFile.innerText = file.name;
        });
      } else {
        showInvalidFileText();
      }
    };
    fileReader.readAsText(file, "UTF-8");
  }
}

function showInvalidFileText() {
  invalidFile.style.display = "inline";
  setTimeout(function () {
    invalidFile.style.display = "none";
  }, 3000);
}

// // Restores select box and checkbox state using the preferences
// // stored in chrome.storage.
function restore_options() {
  // Use default value color = "red" and likesColor = true.
  chrome.storage.sync.get({
    encryptFileName: "no file uploaded",
  }, function (settings) {
    uploadedFile.innerText = settings.encryptFileName;
  });
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      chrome.extension.getBackgroundPage().initListeners();
      loginHeader.innerText = "Logged in as " + user.displayName + ":";
      loginText.innerText = "Logout";
    } else {
      chrome.extension.getBackgroundPage().destroyListeners();      
      loginHeader.innerText = "Login with ARTS account:";
      loginText.innerText = "Login with Google";
    }
  });
}
