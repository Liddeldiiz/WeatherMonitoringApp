/////////////////////////////////// IMPORTS ///////////////////////////////////
const { runMQTTConfig, connectToMqttBroker } = require('../Config/mqtt_config');
const { 
    getFunction,
    getDeviceByIP,
    insertIntoDevices_Test,
    handleMessage

} = require('../Controllers/mysql_controller');
const { proxy1 } = require('../Data/dashboard');

const {
    getSubscribeTopicsSQL,
    getPublishTopicsSQL
} = require('../Queries');

/////////////////////////////////// VARIABLES ///////////////////////////////////
const deviceIP = [];


/////////////////////////////////// MQTT CLIENT ///////////////////////////////////

const mqttClient = connectToMqttBroker();


/////////////////////////////////// EVENTS ///////////////////////////////////

mqttClient.on('connect', (ack) => {
    //console.log('initiating mqtt_client.on("connect") function...')
    if (!ack) {
        console.log(`MQTT Client not connected!`)
        proxy1.service_status_mqtt = false;
        //console.log(`proxy1:${proxy1.service_status_mqtt}`);
        delay(5000, () => {
            console.log('Trying to connect to mqtt broker...')
            runMQTTConfig();
        })
    } else {
        console.log(`MQTT Client connected!`)
        proxy1.service_status_mqtt = true;
        getTopicsAndSubscribe();
        //console.log(`proxy1:${proxy1.service_status_mqtt}`);
        return mqttClient;
        //console.log(ack)
    }
})

mqttClient.on('disconnect', () => {
    console.log('mqtt client disconnected');
})

mqttClient.on('error', (err) => {
    //console.log('Error: mqttClient: ', err);
    if (err === 'ECONNREFUSED') {
        delay(5000, () => {
            console.log('Trying to reconnect...');
            runMQTTConfig();
        })
    }
})

mqttClient.on('message', (topic, message) => {
    const message_ = message.toString();
    if (topic == 'device/client_ip') {
        console.log(message_);
        deviceIP.push(message_);
        console.log('checking device ip...');
        checkDeviceIP(deviceIP);
    }
    deviceIP.pop();
    if (topic === 'weather/data') {
        var json = JSON.parse(msg);
        handleMessage(topic, json);
    }
    return console.log(`topic: ${topic}, msg: ${msg}`);
})

mqttClient.on('close', () => {
    console.log('mqtt connection closed');

})

/////////////////////////////////// FUNCTIONS ///////////////////////////////////

// Get the topics to subscribe/publish
const getTopicsAndSubscribe = async() => {
    const queryTopicsSubscribePromise = getFunction(getSubscribeTopicsSQL);
    const queryTopicSubscribe = await queryTopicsSubscribePromise;

    try {
        for(let i = 0; i < queryTopicSubscribe.length; i++) {
            mqttClient.subscribe(queryTopicSubscribe[i].topics, () => {
                console.log(`Subscribed to topicd: ${queryTopicSubscribe[i].topics}`);
            })
        }
    } catch (err) {
        console.log(`Subscribing failed due to ${err}`);
    }
}


const checkDeviceIP = async (deviceIP) => {

    const topicPublishPromise = getFunction(getPublishTopicsSQL);
    const topicPublish = await topicPublishPromise;
    
    const deviceIDPromise = getDeviceByIP(deviceIP[0]);
    const deviceIDResult = await deviceIDPromise;
    console.log(`publishing on topic: ${topicPublish[1].topics}`);
    if (deviceIDResult[0] === false) {
        const deviceID = await generateClientID(); // calling func to generate client id on server side if device has no entry in DB
        console.log(`Generated client ID: ${deviceID}`);
        insertIntoDevices_Test([[deviceID, deviceIP[0]]]); // adding the device to the DB
        const msgReject = `{ device_ip: ${deviceIP[0]}, device_id: ${deviceID} }`;
        const publishPromise = publishToTopic(mqttClient, topicPublish[1].topics, msgReject);
        const response = await publishPromise;
        console.log(`Response: ${response}`);        
    } else {
        console.log('deviceIP: ', deviceIP[0]);
        console.log('device_id: ', deviceIDResult[0].clientID);
        const msgResolve = `{ "device_ip": "${deviceIP[0]}", "device_id": "${deviceIDResult[0].clientID}" }`;
        const publishPromise = publishToTopic(mqttClient, topicPublish[1].topics, msgResolve);
        const response = await publishPromise;
        console.log(`Response: ${response}`);
    }    
}

function generateClientID() {
    return new Promise((resolve) => {
        const clientID = 'ESP8266Client-' + Math.floor(Math.random() * 0xffff).toString(16);

        setTimeout(() => {
            resolve(clientID);
        }, 2000);
    });
}

const publishToTopic = (topic, message) => {

    return new Promise((resolve, reject) => {
        mqttClient.publish(topic, message, { retain: true }, (err) => {
            if (err) {
                console.log(`Failed to publish msg: ${message}\nTo topic: ${topic}`);
                reject({ success: false, msg: 'something went wrong' });
            } else {
                console.log('message published with retain flag set to true');
                const response = 'success';
                resolve(response);
            }
        })
    })
    
}


/////////////////////////////////// EXPORTS ///////////////////////////////////

module.exports = {

}
