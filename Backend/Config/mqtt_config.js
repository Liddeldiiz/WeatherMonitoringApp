const mqtt = require('mqtt');

const dotenv = require('dotenv');
dotenv.config()

const connectToMqttBroker = () => {

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
            console.log(err);
            reject(err);
        }
    })
}


// not used
const runMQTTConfig = async () => {
    //const mqttClient = connectToMqttBroker();

    const mqttClientPromise = connectToMqttBroker();
    const mqttClient = await mqttClientPromise;

    mqttClient.on('connect', (ack) => {
        //console.log('initiating mqtt_client.on("connect") function...')
        if (!ack) {
            console.log(`MQTT Client not connected!`)
        } else {
            console.log(`MQTT Client connected!`)
            return mqttClient;
            //console.log(ack)
        }
    })
    
}

//const mqttClient = runMQTTConfig();

module.exports = {
    runMQTTConfig,
    connectToMqttBroker
};

