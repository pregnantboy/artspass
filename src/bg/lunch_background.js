var lunchRef = artsRef.collection("lunch");
var currentLunchRef = lunchRef.orderBy("lunchtime", "desc").limit(1);
var currentLunchItem = null;

function initLunchListeners() {
	currentLunchRef.onSnapshot((snapshot) => {
		snapshot.docChanges.forEach((change) => {
			if (change.typee === "removed") {
				return;
			}
			console.log("lunch", change.type, change.doc.data());
			let data = change.doc.data();
			let currentLunchItem = {
				id: change.id,
				lunchtime: new Date(data.lunchtime),
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
	lunchRef.add({
		lunchtime: time,
		partcipants: [currentUser.displayName]
	}).then((docRef) => {
		console.log(docRef);
	}).catch((error) => {
		console.log(error);
	});
}
