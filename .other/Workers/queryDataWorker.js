const { parentPort, workerData } = require('worker_threads');

const { getFunction } = require('../Controllers/mysql_controller');
const { mySQLClient } = require('../../app.js');



parentPort.postMessage(workerData);

/*
const queryPromise = await getFunction(mySQLClient);
const queryFullfilled = queryPromise;
console.log('query result: ');
console.log(queryFullfilled);

*/
//parentPort.postMessage(queryFullfilled);
