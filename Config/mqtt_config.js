const mqtt = require('mqtt')
var client; 

const dotenv = require('dotenv');
dotenv.config()

const connectToMqttBroker = () => {

    const connectUrl = `${process.env.MQTT_PROTOCOL}://${process.env.MQTT_HOST}:${process.env.MQTT_PORT}`
    const clientId = `mqttjs_${Math.random().toString(8).slice(2, 4)}`
    //console.log(connectUrl)
    try {
        client = mqtt.connect(
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
    client.on('connect', (err) => {
        console.log('initiating client.on("connect") function...')
        if (!err) {
            console.log(`Client not connected`)
        } else {
            console.log(`Client connected`)
            console.log(err)
        }
    })
}

connectToMqttBroker();

module.exports = client;