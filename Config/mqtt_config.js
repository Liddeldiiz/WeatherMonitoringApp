const mqtt = require('mqtt')
var mqtt_client; 

const dotenv = require('dotenv');
dotenv.config()

const connectToMqttBroker = () => {

    const connectUrl = `${process.env.MQTT_PROTOCOL}://${process.env.MQTT_HOST}:${process.env.MQTT_PORT}`
    const clientId = `mqttjs_${Math.random().toString(8).slice(2, 4)}`
    //console.log(connectUrl)
    try {
        mqtt_client = mqtt.connect(
            connectUrl, {
                clientId: clientId,
                username: process.env.MQTT_USERNAME,
                password: process.env.MQTT_PASSWORD,  
                connectTimeout: 10000,  
            }
        )
    } catch (err) {
        console.log(err)
    }
    mqtt_client.on('connect', (ack) => {
        //console.log('initiating mqtt_client.on("connect") function...')
        if (!ack) {
            console.log(`MQTT Client not connected!`)
        } else {
            console.log(`MQTT Client connected!`)
            //console.log(ack)
        }
    })
}

connectToMqttBroker();

module.exports = mqtt_client;