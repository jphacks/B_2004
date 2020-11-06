const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.submitExam = functions.https.onCall((data, context) => {
    console.log('request', data, context);
    response.send("WA");
  });
