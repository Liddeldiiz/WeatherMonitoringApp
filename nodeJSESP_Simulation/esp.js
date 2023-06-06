const express = require('express');
const app = express();

const mqtt = require('mqtt');
var mqtt_client;

try {
    client = mqtt.connect('mqtt://test.mosquitto.org')
    console.log('initiating client.on("connect") function...')
    client.on('connect', function() {
        console.log(`Client connected`)
    })
} catch(err) {
    console.log(err)
}

app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
    console.log('User hit esp index resource')
    res.status(200).send("ESP Index Page")
    res.end()
})

app.post('/api/subscribe/nodejs/:topic', (req, res) => {
    
    const topic = `/${req.params.topic}` // accessing the :topic element
    console.log(`Topic: ${topic}`)
    console.log('subscribing to topic')
    client.subscribe(topic, (err) => {
        if(!err) {
            const msg = 'Hello NodeJS!'
            console.log('publishing msg...')
            client.publish(topic, msg, { retain: true }, (err) => {
                if (err) {
                    console.error('Failed to publish message: ', err)
                    
                } else {
                    console.log('Message published with retain flag set to true')
                    res.status(200).json({ success: true, msg: `msg: ${msg} | published in topic: ${topic}` })
                    console.log('msg published!')
                }
            })
        } else {
            console.error('Failed to subscribe to topic: ', err)
        }
    })
})

app.get('/api/subscribe/esp/:topic', (req, res) => {
    const topic = `/${req.params.topic}` // accessing the :topic element
    console.log(`Topic: ${topic}`)
    console.log('subscribing to topic')
    client.subscribe(topic)
    console.log('fetching msg...')
    client.on('message', function(topic, message) {
        console.log(message.toString())
        //res.status(200).json({ success: true, msg: message.toString() })
        console.log('msg fetched!')
    })
    
})

app.listen(3000, () => {
    console.log('Server is listening on port 3000')
})