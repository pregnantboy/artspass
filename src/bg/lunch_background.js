function createNotification() {
	chrome.notifications.create("randomid", {
		type: "list",
		iconUrl: "../../../icons/icon48.png",
		title: "hello23",
		message: "goodbye",
		items: [{
			title: "fwefwf",
			message: "ewfwefewf"
		}],
		buttons: [{
			title: "YES",
			iconUrl: "../../../icons/icon48.png"
		}, {
			title: "NO",
			iconUrl: "../../../icons/icon48.png"
		}],
		isClickable: true
	});
}
