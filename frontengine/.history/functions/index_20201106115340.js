const functions = require('firebase-functions');
const items = 'tesutetuett';
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.submitExam = functions.region('asia-northeast1').https.onCall((data, context) => {
    console.log('request', data, context);
    return items;
  });