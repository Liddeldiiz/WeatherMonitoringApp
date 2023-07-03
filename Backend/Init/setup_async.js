const { connectToMqttBroker } = require('../Config/mqtt_config');
const {
    subscribeToTopic,
    publishToTopic,
    subscribeToAllTopics
} = require('../Controllers/mqtt_controller');

const { connectToDB } = require('../Config/mysql_config');
const { getFunction, getDeviceByIP } = require('../Controllers/mysql_controller');

//const mysql_client = require('../Config/mysql_config');

const setup = async () => {
    // setup MySQL
    const connectToDBPromise = connectToDB();
    const mySQLClient = await connectToDBPromise;
    
    //console.log(`db_status: ${db_status}`);

    // setup MQTT
    const mqttClientPromise = connectToMqttBroker();
    const mqttClient = await mqttClientPromise;
    mqttClient.on('connect', (ack) => {
        if (!ack) console.log('MQTT Client not connected');
        else console.log('MQTT Client connected');
    })

    console.log('Starting setup sequence...')

    var sql_subscribe = 'select * from devices_topics where subscribe = 1 and publish = 0;';
    var sql_publish = 'select * from devices_topics where publish = 1;';

    // topics definition
    const queryTopicsSubscribePromise = getFunction(mySQLClient, sql_subscribe);
    const queryTopicSubscribe = await queryTopicsSubscribePromise;
    const topicPublishPromise = getFunction(mySQLClient, sql_publish);
    const topicPublish = await topicPublishPromise;

    try {
        // device IP Promise -> communication with mqtt broker
        const subscribePromise = subscribeToAllTopics(mqttClient, queryTopicSubscribe);
        const subscribeDone = await subscribePromise;

        const deviceIP = [];

        mqttClient.on('message', (topic, message) => {
            const message_ = message.toString();
            if (topic == 'device/client_ip') {
                deviceIP.push(message_);
                checkDeviceIP(mySQLClient, deviceIP, mqttClient, topicPublish);
            }  
        })
    } catch(err) {
        console.log(err);
    }
}

const checkDeviceIP = async (mySQLClient, deviceIP, mqttClient, topicPublish) => {
    const deviceIDPromise = getDeviceByIP(mySQLClient, deviceIP[0]);
    const deviceIDResult = await deviceIDPromise;
        
    console.log(`publishing on topic: ${topicPublish[0].topics}`);
    if (deviceIDResult[0] === false) {
        const msgReject = `{ device_ip: ${deviceIP[0]}, device_id: False }`;
        const publishPromise = publishToTopic(mqttClient, topicPublish[0].topics, msgReject);
        const response = await publishPromise;
        console.log(`Response: ${response}`);
        
    } else {
        const msgResolve = `{ "device_ip": "${deviceIP[0]}", "device_id": "${deviceIDResult[0].clientID}" }`;
        const publishPromise = publishToTopic(mqttClient, topicPublish[0].topics, msgResolve);
        const response = await publishPromise;
        console.log(`Response: ${response}`);
    }
}

module.exports = {
    setup
}