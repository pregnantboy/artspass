const functions = require("firebase-functions");
const admin = require("firebase-admin");
const _ = require("lodash");
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
admin.initializeApp(functions.config().firebase);
exports.migrateData = functions.https.onRequest((request, response) => {
    console.log("Migration started");
    var ref = admin.database().ref("/arts/accounts/");
    ref.once("value").then(snapshot => {
        let accounts = snapshot.val();
        console.log(accounts);
        _.forEach(accounts, (value, key) => {
            admin.firestore().collection("teams").doc("arts").collection("accounts").doc(key).set(value);
        });
    });
    response.send("Hello from Firebase!");
});
