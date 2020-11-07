const functions = require('firebase-functions');
const mainProcess = require('./process/MainProcess.js');
const items = 'tesutetuett';
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.submitExam = functions.https.onCall((data, context) => {
  console.log(mainProcess);
    const returnStatus = mainProcess(data.examText, data.testCase, data.outputSumple, data.optionSumple)
    console.log('request', returnStatus);
    return returnStatus;
  });