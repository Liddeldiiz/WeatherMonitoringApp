const express = require('express');
const app = express();

const {
    protocol,
    host,
    port,
    username,
    password
} = require('./mqtt_conf')

const mqtt = require('mqtt')
var client; 

const connectToMqttBroker = () => {

    const connectUrl = `${protocol}://${host}:${port}`
    const clientId = `mqttjs_${Math.random().toString(8).slice(2, 4)}`
    console.log(connectUrl)
    try {
        client = mqtt.connect(
            connectUrl, {
                clientId: clientId,
                username: username,
                password: password,  
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

connectToMqttBroker()

const _topic = '/'

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.get('/', (req, res) => {
    console.log('User hit index resource')
    res.status(200).send("Index Page")
    res.end()
})

app.post('/api/subscribe/esp/:topic_part1/:topic_part2', (req, res) => {
    
    const topic = `${req.params.topic_part1}/${req.params.topic_part2}` // accessing the :topic element
    console.log(`Topic: ${topic}`)
    console.log('subscribing to topic')
    const {msg} = req.body
    if(!msg) {
        return res.status(400).json({success: false, msg: 'please provide msg value'})
    }

    console.log(req.body) 
            
    console.log('publishing msg...')
    client.publish(topic, msg, { retain: true }, (err) => {
        if (err) {
            console.error('Failed to publish message: ', err)
        } else {
            console.log('Message published with retain flag set to true')
            res.status(201).json({ success: true, msg: `msg: ${msg} | published in topic: ${topic}` })
            console.log('msg published!')
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

app.listen(5000, () => {
    console.log('Server is listening on port 5000')
    
})