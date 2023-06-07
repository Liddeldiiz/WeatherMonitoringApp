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

const subscribeToTopic = (req, res) => {
    const {topic} = req.body;
    if (!topic) {
        return res.status(400).json({ success: false, msg: 'please provide topic value' })
    }
    client.subscribe(topic, () => {
        console.log('subscribed to topic: ', topic);
        return res.status(200).json({ success: true, msg: `subscribed successfully to topic: ${topic}`})
    })
}

const publishToTopic = (req, res) => {
    console.log(req.body);
    const {topic} = req.body;
    const {msg} = req.body;

    if(!msg) {
        return res.status(400).json({ success: false, msg: 'please provide msg value' })
    } else if (!topic) {
        return res.status(400).json({ success: false, msg: 'please provide topic value' })
    }

    client.publish(topic, msg, { retain: true }, (err) => {
        if (err) {
            console.log(`Failed to publish msg: ${msg}\nTo topic: ${topic}`);
            return res.status(500).json({ success: false, msg: 'something went wrong' })
        } else {
            console.log('message published with retain flag set to true');
            return res.status(201).json({ success: true, msg: `msg: ${msg} | published in topic: ${topic}` });
        }
    })
}

const onMessage = () => {
    client.on('message', function(message) {
        console.log(message.toString);
        res.status(200).json({ success: true, msg: message.toString() })
    })
}

module.exports = {
    connectToMqttBroker,
    subscribeToTopic,
    publishToTopic,
    onMessage
}