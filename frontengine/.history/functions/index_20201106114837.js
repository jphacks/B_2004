const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.submitExam = functions.region('asia-northeast1').https.onRequest((request, response) => {
    response.set('Access-Control-Allow-Origin', 'http://localhost:8080');
    response.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS, POST');
    response.set('Access-Control-Allow-Headers', 'Content-Type, authorization');
    console.log('request', data, context);
    response.send("WA");
  });
