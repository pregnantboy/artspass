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

function autoFill(username, password) {
	username = username.replace(/(\"|\\)/g, function (found) {
		return +"\\" + found;
	});
	password = password.replace(/(\"|\\)/g, function (found) {
		return +"\\" + found;
	});
	chrome.tabs.executeScript({
		allFrames: true,
		code: "(" + function (username, password) {
			if (window.location.protocol !== "https:") {
				if (!window.confirm("Warning: Insecure site detected. Use https instead.\n\nClick OK to autofill anyway.")) {
					return;
				}
			}
			var fillUsername = function (el) {
				el.value = username;
			};
			var fillPassword = function (el) {
				el.value = password;
			};

			var attemptAutoFill = function (doc) {
				let filledUsername = false;
				let filledPassword = false;
				let maxPwEl;
				var passwordElements = doc.querySelectorAll("input[type='password']");
				if (passwordElements.length === 0) {
					console.log("No password field found");
				}
				if (passwordElements.length === 1) {
					fillPassword(passwordElements[0]);
					filledPassword = true;
				} else {
					let maxPoints = 0;
					maxPwEl = passwordElements[0];
					passwordElements.forEach(pwEl => {
						let points = 0;
						[pwEl.name, pwEl.placeholder, pwEl.className].forEach(attr => {
							if (attr) {
								let matches = attr.toLowerCase().match(/(password|pw|pass)/g);
								if (matches) {
									points += matches.length;
								}
							}
						});
						if (pwEl.placeholder) {
							if (pwEl.placeholder.toLowerCase().match(/(new|retype|confirm)/)) {
								points -= 9999;
							}
						}
						if (maxPoints < points) {
							maxPoints = points;
							maxPwEl = pwEl;
						}
					});
					fillPassword(maxPwEl);
					filledPassword = true;
				}

				let usernameElements = doc.querySelectorAll("input");
				
				if (!usernameElements || usernameElements.length === 0) {
					console.log("No username field found");
				} else {
					let maxPoints = 0;
					let maxUserEl = null;
					usernameElements.forEach(userEl => {
						let points = 0;
						if (userEl.input && userEl.input === "email") {
							points++;
						}
						if (maxPwEl && filledPassword && maxPwEl.form) {
							if (userEl.form === maxPwEl.form) {
								points += 9999;
							}
						}
						[userEl.name, userEl.placeholder, userEl.className, userEl["aria-label"], userEl.id].forEach(attr => {
							if (attr) {
								if (attr.toLowerCase().match(/^(user|username|email|e-mail|login)$/)) {
									points += 100;
								}
								let matches = attr.toLowerCase().match(/(user|username|email|e-mail|login|id)/g);
								if (matches) {
									points += matches.length;
								}
								let negativeMatches = attr.toLowerCase().match(/(search|register)/g);
								if (negativeMatches) {
									points -= 100;
								}
							}
						});
						if (userEl.autocomplete && userEl.autocomplete !== "false") {
							points++;
						}
						if (userEl.previousElementSibling) {
							if (userEl.previousElementSibling.tagName && userEl.previousElementSibling.tagName.toLowerCase() === "label") {
								if (userEl.previousElementSibling.innerText && userEl.previousElementSibling.innerText.toLowerCase().match(/(user|email|e-mail|login)/g)) {
									points++;
								}
							}
						}
						if (userEl.nextElementSibling) {
							if (userEl.nextElementSibling.tagName && userEl.nextElementSibling.tagName.toLowerCase() === "label") {
								if (userEl.nextElementSibling.innerText && userEl.nextElementSibling.innerText.toLowerCase().match(/(user|email|e-mail|login)/g)) {
									points++;
								}
							}
						}
						if (maxPoints < points) {
							maxPoints = points;
							maxUserEl = userEl;
						}
					});
					if (maxPoints > 0) {
						console.log(maxPoints, maxUserEl);
						fillUsername(maxUserEl);
						filledUsername = true;
					} else {
						console.log("no username field found");
					}
				}

				return filledUsername && filledPassword;
			};
			var attemptResults = attemptAutoFill(document);
			var iframes = document.querySelectorAll("iframe");
			if (!iframes || iframes.length === 0) {
				return;
			} else {
				let i = 0;
				while (!attemptResults && i < iframes.length) {
					try {
						attemptResults = attemptAutoFill(iframes[i].contentWindow.document);
					} catch (e) {
						console.log(e);
					}
					i++;
				}
			}
		} + ")(\"" + username + "\",\"" + password + "\");"
	}, function () {
		if (chrome.runtime.lastError) {
			console.error(chrome.runtime.lastError);
		}
	});
}
