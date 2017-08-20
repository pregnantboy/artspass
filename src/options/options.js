// Firebase Login
var config = {
  apiKey: "AIzaSyA4p-JEtAvGo5BFKUilv0nDLKbX7qS4e0E",
  authDomain: "artspass-dev.firebaseapp.com",
  databaseURL: "https://artspass-dev.firebaseio.com",
  projectId: "artspass-dev",
  storageBucket: "artspass-dev.appspot.com",
  messagingSenderId: "542991076028"
};
firebase.initializeApp(config);

function startAuth() {
  chrome.identity.getAuthToken({
    interactive: true // must be true
  }, function (token) {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
    } else if (token) {
      // Authrorize Firebase with the OAuth Access Token.
      var credential = firebase.auth.GoogleAuthProvider.credential(null, token);
      firebase.auth().signInWithCredential(credential).catch(function (error) {
        // The OAuth token might have been invalidated. Lets' remove it from cache.
        if (error.code === 'auth/invalid-credential') {
          chrome.identity.removeCachedAuthToken({
            token: token
          }, function () {
            startAuth();
          });
        }
      });
    } else {
      console.error('The OAuth Token was null');
    }
  });
}

function login() {
  if (firebase.auth().currentUser) {
    console.log('signing out');
    logout();
  } else {
    console.log('signing in');
    startAuth();
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
      console.log("Logged out");
    });
  });
}

var inputElement;
var uploadedFile;
var invalidFile;

document.addEventListener('DOMContentLoaded', function () {
  inputElement = document.getElementById("file-upload");
  uploadedFile = document.getElementById("uploaded-file");
  invalidFile = document.getElementById("invalid-file");
  inputElement.addEventListener("change", handleFiles, false);
  document.getElementById("login").addEventListener('click', login);
  restore_options();
});

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
          uploadedFile.innerText = file.name
        });
      } else {
        showInvalidFileText();
      }
    };
    fileReader.readAsText(file, "UTF-8")
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
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    encryptFileName: 'no file uploaded',
  }, function (settings) {
    uploadedFile.innerText = settings.encryptFileName;
  });
}

// document.addEventListener('DOMContentLoaded', restore_options);
// document.getElementById('save').addEventListener('click',
//   save_options);