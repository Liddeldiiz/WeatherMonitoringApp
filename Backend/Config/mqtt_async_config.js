const mqtt = require('mqtt');
const { AsyncClient } = require('async-mqtt');

const dotenv = require('dotenv');
dotenv.config();

const connectToMqttBroker = () => {
    const connectUrl = `${process.env.MQTT_PROTOCOL}://${process.env.MQTT_HOST}:${process.env.MQTT_PORT}`
    const clientId = `mqttjs_${Math.random().toString(8).slice(2, 4)}`
    //console.log(connectUrl)
    try {
        const temp_mqtt_client = mqtt.connect(
            connectUrl, {
                clientId: clientId,
                username: process.env.MQTT_USERNAME,
                password: process.env.MQTT_PASSWORD,  
                connectTimeout: 10000,  
            }
        )
        console.log('MQTT Async Client Connected!')
        return temp_mqtt_client;
    } catch (err) {
        console.log(err)
    }
    
}

const mqtt_client = connectToMqttBroker();

const mqtt_async_client = new AsyncClient(mqtt_client);

module.exports = mqtt_async_client;