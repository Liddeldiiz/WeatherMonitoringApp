const { parentPort, workerData } = require('worker_threads');
const client = require('../Config/mqtt_config');
const {
    subscribeToTopic,
    onMessage
} = require('../Controllers/mqtt_controller');

//const topic = 'device/temp';
var msg;
var response = {}

//console.log(`Inside worker node: topic: ${workerData}`);

client.subscribe(workerData, () => {
    console.log('subscribed to topic: ', workerData);
    client.on('message', (topic, message) => {
        msg = message.toString();
        response = { topic: workerData, message: msg }
        parentPort.postMessage(response);
        //console.log(msg)
    })
})

