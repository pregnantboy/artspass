var lunchRef = artsRef.collection("lunch");
var currentLunchRef = lunchRef.orderBy("lunchtime", "desc").limit(1);
var currentLunchDocRef = null;
var currentLunchItem = null;

function initLunchListeners() {
	currentLunchRef.onSnapshot((snapshot) => {
		snapshot.docChanges.forEach((change) => {
			if (change.type === "removed") {
				return;
			}
			console.log("lunch", change.type, change.doc.data());
			currentLunchDocRef = change.doc.ref;
			let data = change.doc.data();
			currentLunchItem = {
				id: change.id,
				lunchtime: data.lunchtime,
				participants: data.participants
			};
			chrome.runtime.sendMessage({
				event: "lunch-update",
			});
			// if (change.type === "added") {}
			// if (change.type === "modified") {}
		});
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

function addParticipant() {
	db.runTransaction(t => {
		return t.get(currentLunchDocRef)
			.then(doc => {
				// Add one person to the city population
				var currentParticipants = doc.data().participants;
				if (currentParticipants.indexOf(currentUser.displayName) !== -1) {
					currentParticipants.push(currentUser.displayName);
				}
				t.update(currentLunchDocRef, {
					participants: currentParticipants
				});
			});
	}).then(result => {
		console.log("Participant added");
	}).catch(err => {
		console.log("Participant could not added");
	});
}
