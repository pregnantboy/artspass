// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });

// Initialize Firebase

var initDataLoaded = false;

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
var ref = database.ref("/arts/accounts/");

var accountsObj = {};

ref.on("child_added", function (data) {
	if (initDataLoaded) {
		chrome.runtime.sendMessage({
			event: "ref-add",
			account: addChild(data)
		});
	}
});

ref.on("child_changed", function (data) {
	if (initDataLoaded) {
		chrome.runtime.sendMessage({
			event: "ref-change",
			account: addChild(data)
		});
	}
});

ref.on("child_removed", function (data) {
	if (initDataLoaded) {
		chrome.runtime.sendMessage({
			event: "ref-delete",
			account: {
				key: removeChild(data)
			}
		});
	}
});

function loadAllData(callback) {
	initDataLoaded = false;
	ref.once("value")
		.then((snapshot) => {
			initDataLoaded = true;
			accountsObj = {};
			snapshot.forEach((child) => {
				addChild(child);
			});
			console.log(snapshot.numChildren() + " accounts loaded");
			if (callback) {
				callback(getAccountsArray());
			}
		})
		.catch((err) => {
			console.log(err);
			accountsObj = {};
			if (callback) {
				callback(getAccountsArray());
			}
		});
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	console.log("message received", message.event);

	// first load - retrieve from variable
	if (message.event === "onload") {
		if (initDataLoaded) {
			sendResponse(getAccountsArray());
		} else {
			loadAllData(sendResponse);
			// for async response, return true
			return true;
		}
	}

	// reload - refresh data
	if (message.event === "reload") {
		console.log("reloading");
		loadAllData(sendResponse);
		// for async response, return true
		return true;
	}

	// Saving data
	if (message.event === "save" && message.account) {
		console.log("saving account");
		var newChildRef;
		if (message.account.key) {
			newChildRef = database.ref("arts/accounts/" + message.account.key);
		} else {
			newChildRef = database.ref("arts/accounts").push();
			message.account.key = newChildRef.key;
		}
		newChildRef.set(Account.encrypt(message.account), err => {
			if (err) {
				console.log(err);
				sendResponse(false);
			} else {
				sendResponse(true);
			}
		});
		return true;
	}

	if (message.event == "delete") {
		console.log("delete account");
		if (message.account.key) {
			var deleteChildRef = database.ref("arts/accounts/" + message.account.key);
			deleteChildRef.remove(err => {
				if (err) {
					console.log(err);
					sendResponse(false);
				} else {
					sendResponse(true);
				}
			});
			return true;
		} else {
			sendResponse(false);
		}
	}

});

function getAccountsArray() {
	return _.values(accountsObj);
}

function addChild(child) {
	var childVal = child.val();
	var newChild = Account.decrypt(childVal, child.key);
	accountsObj[child.key] = newChild;
	return newChild;
}

function removeChild(child) {
	delete accountsObj[child.key];
	return child.key;
}

function startAuth() {
	// Using chrome.tabs
	var manifest = chrome.runtime.getManifest();
	var provider = new firebase.auth.GoogleAuthProvider();

	manifest.oauth2.scopes.forEach(scope => {
		provider.addScope(scope);
	});

	firebase.auth().signInWithPopup(provider).then(function (result) {
		console.log(result);
	});
}
