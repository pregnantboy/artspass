var firebaseAuth = chrome.extension.getBackgroundPage().firebase.auth();

var inputElement = document.getElementById("file-upload");
var uploadedFile = document.getElementById("uploaded-file");
var invalidFile = document.getElementById("invalid-file");
var loginText = document.getElementById("login-text");
var loginHeader = document.getElementById("login-header");
var colorPicker = document.getElementsByName("radios");
var closeButton = document.getElementById("options-close");
inputElement.addEventListener("change", handleFiles, false);
closeButton.addEventListener("click", function () {
  window.close();
});
document.getElementById("login").addEventListener("click", login);
colorPicker.forEach(function (color) {
  color.addEventListener("click", storeNewColor);
});
restore_options();

function login() {
  if (firebaseAuth.currentUser) {
    console.log("signing out");
    logout();
  } else {
    console.log("signing in");
    chrome.extension.getBackgroundPage().startAuth();
  }
}

function logout() {
  firebaseAuth.signOut();
  chrome.identity.getAuthToken({
    interactive: true
  }, function (token) {
    chrome.identity.removeCachedAuthToken({
      token: token
    }, function () {
      loginHeader.innerText = "Login with ARTS account:";
      loginText.innerText = "Login with Google";
    });
  });
}

function handleFiles() {
  var fileList = this.files; /* now you can work with the file list */
  if (fileList.length === 1) {
    var file = fileList[0];
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
    theme: "239, 91, 91"
  }, function (settings) {
    uploadedFile.innerText = settings.encryptFileName;
    colorPicker.forEach(function (color) {
      if (color.value === settings.theme) {
        color.checked = true;
        document.documentElement.style.setProperty("--theme-color", settings.theme);
      }
    });
  });
  firebaseAuth.onAuthStateChanged(function (user) {
    if (user) {
      loginHeader.innerText = "Logged in as " + user.displayName + ":";
      loginText.innerText = "Logout";
    } else {
      loginHeader.innerText = "Login with ARTS account:";
      loginText.innerText = "Login with Google";
    }
  });
}

function storeNewColor(event) {
  var newColor = event.target.value;
  console.log("new color", newColor);
  chrome.storage.sync.set({
    theme: newColor
  }, function () {
    document.documentElement.style.setProperty("--theme-color", newColor);
  });
}
