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

firebase.initializeApp({
	apiKey: "AIzaSyA4p-JEtAvGo5BFKUilv0nDLKbX7qS4e0E",
	authDomain: "artspass-dev.firebaseapp.com",
	projectId: "artspass-dev",
});



// Get a reference to the database service
var db = firebase.firestore();
var ref = db.collection("teams").doc("arts").collection("accounts");
var artsRef = db.collection("teams").doc("arts");
var accountsObj = {};
var userEmails = [];

function initListeners() {
	destroyListeners();
	ref.onSnapshot(function (snapshot) {
		if (initDataLoaded) {
			snapshot.docChanges.forEach(function (change) {
				if (change.type === "added") {
					chrome.runtime.sendMessage({
						event: "ref-add",
						account: addChild(change.doc)
					});
				}
				if (change.type === "modified") {
					chrome.runtime.sendMessage({
						event: "ref-change",
						account: addChild(change.doc)
					});
				}
				if (change.type === "removed") {
					chrome.runtime.sendMessage({
						event: "ref-delete",
						account: {
							id: removeChild(change.doc)
						}
					});
				}
			});
		}
	});
}

function destroyListeners() {
	// todo: remove listeners
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
	artsRef.get()
		.then((artsDoc) => {
			if (artsDoc.data().users) {
				userEmails = artsDoc.data().users.sort();
				ref.get()
					.then((snapshot) => {
						accountsObj = {};
						snapshot.forEach((doc) => {
							addChild(doc);
						});
						initDataLoaded = true;
						console.log("accounts loaded");
						if (callback) {
							callback([getAccountsArray(), userEmails]);
						}
					})
					.catch((err) => {
						console.error(err);
						accountsObj = {};
						if (callback) {
							callback([getAccountsArray(), userEmails]);
						}
					});
			}
		})
		.catch(err => {
			console.error(err);
			if (callback) {
				callback([getAccountsArray(), userEmails]);
			}
		});
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	console.log("message received", message.event);

	// first load - retrieve from variable
	if (message.event === "onload") {
		isFirstLoad = false;
		if (initDataLoaded) {
			sendResponse([getAccountsArray(), userEmails]);
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
		let docObj = Object.assign({}, Account.encrypt(salt, message.account));
		if (message.account.id) {
			ref.doc(message.account.id).set(Object.assign({}, docObj)).then(() => {
				sendResponse(true);
			}).catch((err) => {
				console.error(err);
				sendResponse(false);
			});
		} else {
			ref.add(Object.assign({}, docObj)).then(() => {
				sendResponse(true);
			}).catch((err) => {
				console.error(err);
				sendResponse(false);
			});
		}
		return true;
	}

	if (message.event == "delete") {
		if (message.account.id) {
			ref.doc(message.account.id).delete().then(() => {
				sendResponse(true);
			}).catch((err) => {
				console.log(err);
				sendResponse(false);
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
	var childVal = child.data();
	var newChild = Account.decrypt(salt, childVal, child.id);
	accountsObj[child.id] = newChild;
	return newChild;
}

function removeChild(child) {
	delete accountsObj[child.id];
	return child.id;
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

			var isHidden = function (el) {
				return (el.offsetParent === null);
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
						if (isHidden(pwEl)) {
							points -= 9999;
						}
						if (pwEl.form) {
							// most likely registration form
							let passwordsInForm = pwEl.form.querySelectorAll("input[type='password");
							if (passwordsInForm && passwordsInForm.length > 1) {
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
								points += 200;
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
						if (isHidden(userEl)) {
							points -= 9999;
						}
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
