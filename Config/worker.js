const { parentPort } = require('worker_threads');
const client = require('../Config/mqtt_config');
const {
    subscribeToTopic,
    onMessage
} = require('../Controllers/mqtt_controller');

const topic = 'device/temp';
var msg;
var response = {}

client.subscribe(topic, () => {
    console.log('subscribed to topic: ', topic);
    client.on('message', (topic, message) => {
        msg = message.toString();
        response = { topic: topic, message: msg }
        parentPort.postMessage(response);
        //console.log(msg)
    })
})


