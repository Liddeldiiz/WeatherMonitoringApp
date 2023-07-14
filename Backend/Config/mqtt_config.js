const mqtt = require('mqtt');
const { proxy1 } = require('../Data/dashboard');
const dotenv = require('dotenv');
dotenv.config()

const connectToMqttBroker = () => {

    const connectUrl = `${process.env.MQTT_PROTOCOL}://${process.env.MQTT_HOST}:${process.env.MQTT_PORT}`
    const clientId = `mqttjs_${Math.random().toString(8).slice(2, 4)}`
    let mqttClient;
    try {
        mqttClient = mqtt.connect(
            connectUrl, {
                clientId: clientId,
                username: process.env.MQTT_USERNAME,
                password: process.env.MQTT_PASSWORD,  
                connectTimeout: 10000,  
            }
        )
        return mqttClient;
    } catch (err) {
        console.log('Connection to MQTT Broker failed: ', err);
    }
}


///////////////////////////////////////////////////////////////// NOT USED ///////////////////////////////////////////////////////////////// 

const connectToMqttBrokerPromise = () => {

    const connectUrl = `${process.env.MQTT_PROTOCOL}://${process.env.MQTT_HOST}:${process.env.MQTT_PORT}`
    const clientId = `mqttjs_${Math.random().toString(8).slice(2, 4)}`
    let mqttClient;
    return new Promise((resolve, reject) => {
        try {
            mqttClient = mqtt.connect(
                connectUrl, {
                    clientId: clientId,
                    username: process.env.MQTT_USERNAME,
                    password: process.env.MQTT_PASSWORD,  
                    connectTimeout: 10000,  
                }
            )
            resolve(mqttClient);
        } catch (err) {
            console.log('Connection to MQTT Broker failed: ', err);
            reject(err);
        }
    })
}


const runMQTTConfig = () => {
    //const mqttClient = connectToMqttBroker();

    const mqttClient = connectToMqttBroker();
    

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

    mqttClient.on('close', () => {
        console.log('mqtt connection closed');

    })

    return mqttClient;
}



module.exports = {
    runMQTTConfig,
    connectToMqttBroker
};

