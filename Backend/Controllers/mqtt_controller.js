/////////////////////////////////// IMPORTS ///////////////////////////////////
const { runMQTTConfig, connectToMqttBroker } = require('../Config/mqtt_config');
const { 
    getFunction,
    getDeviceByIP,
    insertIntoDevices_Test,
    handleMessage

} = require('../Controllers/mysql_controller');
const { proxy1 } = require('../Data/dashboard');
const { proxy_test } = require('../Data/test');

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
        proxy_test.service_status_mqtt = false;
        //console.log(`proxy1:${proxy1.service_status_mqtt}`);
        delay(5000, () => {
            console.log('Trying to connect to mqtt broker...')
            runMQTTConfig();
        })
    } else {
        console.log(`MQTT Client connected!`)
        proxy1.service_status_mqtt = true;
        proxy_test.service_status_mqtt = true;
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
    //console.log(`topic: ${topic}, message: ${message}`);
    var date = new Date();
    //console.log(date);
    message.time = date;
    console.log(message.toString());
    const message_ = message.toString();
    if (topic == 'device/client_ip') { // the ip is sent as a text value. It needs to be a json value
        console.log(message_);
        var json = {'topic': topic, 'message': message.toString()};
        
        console.log(json.message);
        proxy_test.incomingMsg = json;
        deviceIP.push(message_);
        console.log('deviceIP[0]: ', deviceIP[0]);
        console.log('checking device ip...');
        checkDeviceIP();
    }
    
    if (topic === 'weather/data') {
        var msg_json = JSON.parse(message);
        var json = {'topic': topic, 'message': msg_json}
        // {topic: weather/data, message: {"device_id":"ESP8266Client-ca0f","temperature":28.60000038,"humidity":58.70000076}}
        proxy_test.incomingMsg = json;
        console.log(json);
        handleMessage(topic, msg_json);
    }
    return;
})

mqttClient.on('close', () => {
    console.log('mqtt connection closed');
    proxy_test.service_status_mqtt = false;
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


const checkDeviceIP = async () => {


    //console.log(deviceIP[0]);
    const topicPublishPromise = getFunction(getPublishTopicsSQL);
    const topicPublish = await topicPublishPromise;
    
    const deviceIDPromise = getDeviceByIP(deviceIP[0]);
    //console.log('awaiting device id');
    const deviceIDResult = await deviceIDPromise;
    //console.log(`publishing on topic: ${topicPublish[1].topics}`);
    if (deviceIDResult[0] === false) {
        const deviceID = await generateClientID(); // calling func to generate client id on server side if device has no entry in DB
        //console.log(`Generated client ID: ${deviceID}`);
        insertIntoDevices_Test([[deviceID, deviceIP[0]]]); // adding the device to the DB
        const msgReject = `{ device_ip: ${deviceIP[0]}, device_id: ${deviceID} }`;
        const publishPromise = publishToTopic(mqttClient, topicPublish[1].topics, msgReject);
        const response = await publishPromise;
        //console.log(`Response: ${response}`);        
    } else {
        //console.log('preparing msgResolve...')
        const msgResolve = `{ "device_ip": "${deviceIP[0]}", "device_id": "${deviceIDResult[0].clientID}" }`;
        //console.log('msgResolve:')
        //console.log(msgResolve);
        
        //console.log('publishingToTopic...')
        const publishPromise = publishToTopic(topicPublish[1].topics, msgResolve);
        //console.log('awaiting response')
        const response = await publishPromise;
        //console.log('poping from deviceIP');
        deviceIP.pop();
        //console.log(`Response: ${JSON.stringify(response)}`);
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
        console.log('inside promise | before mqttClient.publish');
        mqttClient.publish(topic, message, { retain: true }, (err) => {
            console.log('inside mqttClient.publish');
            if (err) {
                //console.log(`Failed to publish msg: ${message}\nTo topic: ${topic}`);
                const response = { success: false, msg: `something went wrong with publishing on topic: ${topic}`, error: `error message: ${err.code}` };
                proxy_test.outgoingMsg = response;
                reject(response);
            } else {
                //console.log('message published with retain flag set to true');
                const response = { 'success': true, 'msg': `message published successfully on topic: ${topic}` };
                const msg_json = JSON.parse(message);
                const messagePublished = { 'topic': topic, 'message': msg_json };
                proxy_test.popupNotification = response;
                proxy_test.outgoingMsg = messagePublished;
                resolve(response);
            }
        })
    })
    
}


/////////////////////////////////// EXPORTS ///////////////////////////////////

module.exports = {

}
