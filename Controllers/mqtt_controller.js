const client = require('../Config/mqtt_config');
const { Worker } = require('worker_threads');

const subscribeToTopic = (req, res) => {
    const { topic } = req.body;
    console.log(topic);
    const worker = new Worker('./Config/worker.js');
    worker.on('message', (data) => {
        res.status(200)
        console.log(data);
    });
    worker.on('error', (err) => {
        res.status(500)
        console.log(`An error has occured: ${err}`)
    })
    
    /*
    const {topic} = req.body;
    if (!topic) {
        return res.status(400).json({ success: false, msg: 'please provide topic value' })
    }
    client.subscribe(topic, () => {
        console.log('subscribed to topic: ', topic);
        res.status(200).json({ success: true, msg: `subscribed successfully to topic: ${topic}`})
        client.on('message', (topic, message) => {
            console.log(message.toString())
        })
    })
    */
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
        return message.toString();
        //res.status(200).json({ success: true, msg: message.toString() })
    })
}

module.exports = {
    subscribeToTopic,
    publishToTopic,
    onMessage
}