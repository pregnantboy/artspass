var lunchRef = artsRef.collection("lunch");
var currentLunchRef = lunchRef.orderBy("lunchtime", "desc").limit(1);
var currentLunchDocRef = null;
var currentLunchItem = null;
var onFirstLoad = true;
var lunchTimer = null;
var LUNCH_EXPIRY_DURATION = 5 * 60 * 1000;
var popupWindow = null;

chrome.notifications.onClicked.addListener((notificationId, buttonIndex) => {
	let isPopupOpen = chrome.extension.getViews({
		type: "popup"
	}).length > 0;
	if (isPopupOpen) {
		return;
	}
	removePopupWindow().then(() => {
		chrome.windows.create({
			url: "src/browser_action/browser_action.html",
			type: "popup",
			top: 108,
			left: screen.width - 400,
			width: 416,
			height: 460
		}, (windowCreated) => {
			popupWindow = windowCreated;
		});
	});
});

function removePopupWindow() {
	if (popupWindow && popupWindow.id) {
		return new Promise((resolve) => {
			chrome.windows.remove(popupWindow.id, () => {
				resolve();
			});
		});
	} else {
		return Promise.resolve();
	}
}

function initLunchListeners() {
	currentLunchRef.onSnapshot((snapshot) => {
		snapshot.docChanges.forEach((change) => {
			if (!change) {
				onFirstLoad = false;
				return;
			}
			console.log("lunch", change.type, change.doc.data());
			currentLunchDocRef = change.doc.ref;
			let data = change.doc.data();
			if (Date.now() - data.lunchtime <= LUNCH_EXPIRY_DURATION) {
				if (change.type === "added") {
					// new lunch added
					if (!onFirstLoad) {
						sendNotification("New lunch started at " + formatTime(data.lunchtime), "by " + data.participants[0]);
					} else {
						sendNotification("Ongoing lunch at " + formatTime(data.lunchtime), "");
					}
				}
				if (change.type === "modified") {
					if (data.participants.length > currentLunchItem.length) {
						sendNotification("Someone just boarded:", data.participants[data.participants.length - 1]);
					} else if (data.lunchtime !== currentLunchItem.lunchtime) {
						sendNotification("Lunch has been pushed back to " + formatTime(data.lunchtime), "");
					}
				}

				if (change.type === "removed") {
					sendNotification("Lunch deleted", "");
				}
			}
			if (data) {
				currentLunchItem = {
					id: change.doc.id,
					lunchtime: data.lunchtime,
					participants: data.participants
				};
			} else {
				currentLunchItem = null;
			}
			chrome.runtime.sendMessage({
				event: "lunch-update"
			});
			setLunchTimer();
			onFirstLoad = false;
		});
	});
}

function setLunchTimer() {
	clearTimeout(lunchTimer);
	if (!currentLunchItem.lunchtime) {
		return;
	}
	if (currentLunchItem.lunchtime - Date.now() > 0) {
		lunchTimer = setTimeout(() => {
			console.log("Timeout");
			sendNotification("IT'S LUNCH TIME!", "Please make your way to the door now.");
			chrome.runtime.sendMessage({
				event: "lunch-update"
			});
		}, currentLunchItem.lunchtime - Date.now());
	}
}

function sendNotification(title, msg) {
	console.log(new Date(currentLunchItem.lunchtime));
	let icon = getIcon(currentLunchItem.participants.length, new Date(currentLunchItem.lunchtime));
	chrome.notifications.create(null, {
		type: "basic",
		title: title,
		message: msg,
		iconUrl: "../../icons/uncropped-svg/" + icon + ".svg",
		isClickable: true
	});
}

function startLunch(time) {
	console.log("attempting to start lunch");
	lunchRef.add({
		lunchtime: Date.parse(time),
		participants: [currentUser.displayName]
	}).then((docRef) => {
		currentLunchDocRef = docRef;
		console.log("Lunch item added successfully");
	}).catch((error) => {
		console.log("Lunch item failed to add", error);
	});
}

function deleteLunch() {
	console.log("attempting to delete lunch");
	currentLunchDocRef.delete().then(() => {
		console.log("lunch deleted");
		currentLunchDocRef = null;
		currentLunchItem = null;
	}).catch(console.log);
}

function addParticipant() {
	db.runTransaction(t => {
		return t.get(currentLunchDocRef)
			.then(doc => {
				// Add one person to the city population
				var currentParticipants = doc.data().participants;
				if (currentParticipants.indexOf(currentUser.displayName) === -1) {
					currentParticipants.push(currentUser.displayName);
				}
				t.update(currentLunchDocRef, {
					participants: currentParticipants
				});
			});
	}).then(result => {
		console.log("Participant added");
		removePopupWindow();
	}).catch(err => {
		console.log("Participant could not added");
	});
}

function delayLunch() {
	db.runTransaction(t => {
		return t.get(currentLunchDocRef)
			.then(doc => {
				// Add one person to the city population
				var currentParticipants = doc.data().participants;
				if (currentParticipants.indexOf(currentUser.displayName) === -1) {
					currentParticipants.push(currentUser.displayName);
				}
				t.update(currentLunchDocRef, {
					participants: currentParticipants
				});
			});
	}).then(result => {
		console.log("Lunch delayed");
	}).catch(err => {
		console.log("Lunch could not be delayed");
	});
}

function getIcon(size, lunchtime) {
	let iconArray;
	switch (size) {
		case 0:
		case 1:
			iconArray = ["cycle", "recreational"];
			break;
		case 2:
			iconArray = ["motorbiking", "motor-sports"];
			break;
		case 3:
			iconArray = ["automobile-1"];
			break;
		case 4:
			iconArray = ["automobile", "suv"];
			break;
		case 5:
			iconArray = ["tourist"];
			break;
		case 6:
			iconArray = ["tramway", "buses"];
			break;
		case 7:
		default:
			iconArray = ["public-transport", "airplanes", "zeppelins"];
			break;
	}
	if (iconArray.length === 1) {
		return iconArray[0];
	}
	if (size > 0 && lunchtime) {
		let pseudoRandomNumber =
			lunchtime.getMinutes() + lunchtime.getHours() + lunchtime.getDate() + lunchtime.getMonth() + 1;
		return iconArray[pseudoRandomNumber % iconArray.length];
	}
	return iconArray[Math.floor(Math.random() * iconArray.length)];
}

function formatTime(value) {
	if (!(value instanceof Date)) {
		value = new Date(value);
	}
	return value.toLocaleTimeString("en-US", {
		hour: "numeric",
		hour12: true,
		minute: "numeric"
	});
}
