const { parentPort, workerData } = require('worker_threads');
const mqtt_client = require('../Config/mqtt_config');
const {
    subscribeToTopic,
    onMessage
} = require('../Controllers/mqtt_controller');

var msg;
var response = {}

//console.log(`Inside worker node: topic: ${workerData}`);
/*
parentPort.on("message", message => {
    if(message === 'exit') {
        parentPort.postMessage("parentport closing");
        parentPort.close();
    } else {
        parentPort.postMessage({ going: message });
    }
});*/



mqtt_client.subscribe(workerData, () => {
    console.log('subscribed to topic: ', workerData);
    mqtt_client.on('message', (topic, message) => {
        msg = message.toString();
        response = { topic: workerData, message: msg }
        parentPort.postMessage(response);
        //console.log(msg)
    })
})


