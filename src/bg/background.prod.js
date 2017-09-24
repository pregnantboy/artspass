(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var salt;
var themeColor;
chrome.storage.sync.get({
	encryptKey: "",
	theme: "214, 69, 65"
}, function (settings) {
	salt = settings.encryptKey;
	themeColor = settings.theme;
});

chrome.storage.onChanged.addListener(function (changes) {
	if (changes.hasOwnProperty("encryptKey")) {
		salt = changes["encryptKey"].newValue;
		loadAllData();
	}

	if (changes.hasOwnProperty("theme")) {
		themeColor = changes["theme"].newValue;
	}
});

chrome.runtime.onInstalled.addListener(function () {
	chrome.runtime.openOptionsPage();
});

// Initialize Firebase
var isFirstLoad = true;
var initDataLoaded = false;
var isAuthenticated = false;

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

function initListeners() {
	destroyListeners();
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
}

function destroyListeners() {
	ref.off();
}

firebase.auth().onAuthStateChanged(function (user) {
	if (user) {
		initListeners();
		isFirstLoad = true;
		isAuthenticated = true;
	} else {
		destroyListeners();
		isFirstLoad = true;
		isAuthenticated = false;
	}
});

function loadAllData(callback) {
	initDataLoaded = false;
	ref.once("value")
		.then((snapshot) => {
			accountsObj = {};
			snapshot.forEach((child) => {
				addChild(child);
			});
			initDataLoaded = true;
			console.log(snapshot.numChildren() + " accounts loaded");
			if (callback) {
				callback(getAccountsArray());
			}
		})
		.catch((err) => {
			console.error(err);
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
		isFirstLoad = false;
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
			newChildRef = ref.child(message.account.key);
		} else {
			newChildRef = ref.push();
			message.account.key = newChildRef.key;
		}
		newChildRef.set(Account.encrypt(salt, message.account), err => {
			if (err) {
				console.error(err);
				sendResponse(false);
			} else {
				sendResponse(true);
			}
		});
		return true;
	}

	if (message.event == "delete") {
		if (message.account.key) {
			var deleteChildRef = ref.child(message.account.key);
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
	var newChild = Account.decrypt(salt, childVal, child.key);
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
		console.log("logged in", result);
	});
}

// function autoFill(username, password) {
// 	var autoLogin = require("./auto-login");
// 	chrome.tabs.executeScript({
// 		code: "(" + autoLogin + ")(" + username + password + ");"
// 	});
// }

},{}]},{},[1]);
