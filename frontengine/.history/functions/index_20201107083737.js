const functions = require('firebase-functions');
const mainProcess = require('./process/MainProcess');
const items = 'tesutetuett';
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.submitExam = functions.https.onCall((data, context) => {
    const returnStatus = mainProcess(data.examText, data.testCase, data.outputSumple, data.optionSumple)
    console.log('request', returnStatus);
    return returnStatus;
  });