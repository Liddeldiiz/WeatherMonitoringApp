/////////////////////////////////// IMPORTS ///////////////////////////////////
const { runMQTTConfig, connectToMqttBroker } = require('../Config/mqtt_config');
const mySqlController = require('../Controllers/mysql_controller');
const serverStatus = require('../Models/server_status');
const dataTest = require('../Models/test');

const queryController = require('./query_controller');

/////////////////////////////////// VARIABLES ///////////////////////////////////
const deviceIP = [];

/////////////////////////////////// MQTT CLIENT ///////////////////////////////////
const mqttClient = connectToMqttBroker();


/////////////////////////////////// EVENTS ///////////////////////////////////

mqttClient.on('connect', (ack) => {
    if (!ack) {
        console.log(`MQTT Client not connected!`)
        serverStatus.setStatusMQTT(false);
        delay(5000, () => {
            console.log('Trying to connect to mqtt broker...')
            runMQTTConfig();
        })
    } else {
        console.log(`MQTT Client connected!`)
        serverStatus.setStatusMQTT(true);
        getTopicsAndSubscribe();
        return mqttClient;
    }
})

mqttClient.on('disconnect', () => {
    console.log('mqtt client disconnected');
})

mqttClient.on('error', (err) => {
    if (err === 'ECONNREFUSED') {
        serverStatus.setStatusMQTT(false);
        delay(5000, () => {
            console.log('Trying to reconnect...');
            runMQTTConfig();
        })
    }
})

mqttClient.on('message', (topic, message) => {
    var date = new Date();
    message.time = date;
    console.log(message.toString());
    const message_ = message.toString();
    if (topic == 'device/client_ip') { // the ip is sent as a text value. It needs to be a json value
        console.log(message_);
        var json = {'topic': topic, 'message': message.toString()};
        
        console.log(json.message);
        proxy_test.incomingMsg = json;
        dataTest.setIncomingMsg(json);
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
        dataTest.setIncomingMsg(json);
        console.log(json);
        handleMessage(topic, msg_json);
        
    }
    return;
})

mqttClient.on('close', () => {
    console.log('mqtt connection closed');
    serverStatus.setStatusMQTT(false);
})

/////////////////////////////////// FUNCTIONS ///////////////////////////////////

exports.start = () => {
    console.log('initiate mqtt client');
}

// Get the topics to subscribe/publish
const getTopicsAndSubscribe = async() => {
    const queryTopicsSubscribePromise = mySqlController.getFunction(queryController.getSubscribeTopicsSQL);
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

    const topicPublishPromise = mySqlController.getFunction(queryController.getPublishTopicsSQL);
    const topicPublish = await topicPublishPromise;
    
    const deviceIDPromise = mySqlController.getDeviceByIP(deviceIP[0]);
    const deviceIDResult = await deviceIDPromise;

    if (deviceIDResult[0] === false) {
        const deviceID = await generateClientID(); // calling func to generate client id on server side if device has no entry in DB
        mySqlController.insertIntoDevices_Test([[deviceID, deviceIP[0]]]); // adding the device to the DB
        const msgReject = `{ device_ip: ${deviceIP[0]}, device_id: ${deviceID} }`;
        const publishPromise = publishToTopic(mqttClient, topicPublish[1].topics, msgReject);
        const response = await publishPromise;    
    } else {
        const msgResolve = `{ "device_ip": "${deviceIP[0]}", "device_id": "${deviceIDResult[0].clientID}" }`;
        const publishPromise = publishToTopic(topicPublish[1].topics, msgResolve);
        const response = await publishPromise;
        deviceIP.pop();
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
                //proxy_test.outgoingMsg = response;
                dataTest.outgoingMsg(response);
                reject(response);
            } else {
                //console.log('message published with retain flag set to true');
                const response = { 'success': true, 'msg': `message published successfully on topic: ${topic}` };
                const msg_json = JSON.parse(message);
                const messagePublished = { 'topic': topic, 'message': msg_json };
                //proxy_test.popupNotification = response;
                dataTest.setPopupNotification(response);
                //proxy_test.outgoingMsg = messagePublished;
                dataTest.setOutgoingMsg(messagePublished);
                resolve(response);
            }
        })
    })
    
}

const handleMessage = async (topic, msg) => {
    
    if (topic === 'weather/data') {
        const DeviceIDPromise = mySqlController.getDeviceByClientID(msg.device_id);
        const DeviceID = await DeviceIDPromise;

        const values = [DeviceID[0].id, msg.temperature, msg.humidity];

        const insertIntoWeather_DataPromise = mySqlController.insertIntoWeather_Data([values]);
        const insertFinished = await insertIntoWeather_DataPromise;
        
    }
}
