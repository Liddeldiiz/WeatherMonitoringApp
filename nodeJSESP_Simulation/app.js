const express = require('express');
const app = express();

const mqtt = require('mqtt')
var client; 
try {
    client = mqtt.connect('mqtt://test.mosquitto.org')
    console.log('initiating client.on("connect") function...')
    client.on('connect', function() {
        console.log(`Client connected`)
    })
} catch(err) {
    console.log(err)
}

const _topic = '/nodejs'

app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
    console.log('User hit index resource')
    res.status(200).send("Index Page")
    res.end()
})


app.post('/api/subscribe/esp/:topic', (req, res) => {
    
    const topic = `/${req.params.topic}` // accessing the :topic element
    console.log(`Topic: ${topic}`)
    console.log('subscribing to topic')
    client.subscribe(topic, (err) => {
        if(!err) {
            const msg = 'Hello ESP!'
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

/*
app.get('*', (req, res) => {
    console.log('User hit 404 resource')
    res.status(404).send("404 Page Not Found")
    res.end()
})
*/
app.listen(5000, () => {
    console.log('Server is listening on port 5000')
    
})

/*

app.get('/api/read', (req, res) => {
    console.log('Initiating client.on("message") function...')
    client.on('message', function(topic, message) {
        // message is Buffer?
        console.log(topic.toString())
        console.log(`Message from Buffer: ${message.toString()}`)
        res.status(200).json({ success: true, msg: `Message received from mqtt broker: ${message.toString() }`})
        client.end(function(err) {
            if(!err) {
                console.log('Client disconnected')
                res.end()
                
            } else {
                console.log(`Error: ${err}`)
            }
        })
    
    })
})

app.post('/api/subscribe', (req, res) => {
    console.log('Initiating client.on("connect") function...')
    client.on('connect', function(err) {
        if(!err) {
            console.log('Connected')
        } else {
            console.log(`Error while Initiating client.on() function: ${err}`)
        }
        client.subscribe([_topic], function(err) {
            if(!err) {
                client.publish(_topic, 'Hello mqtt')
                console.log('message published')
                res.status(200).json({ success: true, respMsg: "message published", msg: "Hello mqtt" } )
            } else {
                console.log(`Error: ${err}`)
                res.json({ success: false, msg: `Error while publishing message: ${err}` })
            }
            res.end()
        })
    })
    
})

*/