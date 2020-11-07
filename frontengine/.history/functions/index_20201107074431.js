import mainProcess from './process/MainProcess'
const functions = require('firebase-functions');
const items = 'tesutetuett';
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.submitExam = functions.https.onCall((data, context) => {
    const returnStatus = mainProcess(data.examText)
    console.log('request', returnStatus);
    return returnStatus;
  });
