const functions = require('firebase-functions');
const MainProcess = require('./process/MainProcess.js');
const items = 'tesutetuett';
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.submitExam = functions.https.onCall((data, context) => {
  console.log(MainProcess);
    const returnStatus = MainProcess(data.examText, data.testCase, data.outputSumple, data.optionSumple)
    console.log('request', returnStatus);
    return returnStatus;
  });
