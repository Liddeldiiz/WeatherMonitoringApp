//const mqttClient = require('../Config/mqtt_config');


const subscribeToAllTopics = (mqttClient, query) => {
    return new Promise((resolve, reject) => {
        try {
            for (let i = 0; i < query.length; i++) {
                mqttClient.subscribe(query[i].topics, () => {
                    console.log(`Subscribed to topic: ${query[i].topics}`);
                })
            }
            resolve(true);
        } catch (err) {
            console.log(`Subscribing failed due to: ${err}`);
            reject(err);
        }

    })
}

const subscribeToTopic = (mqttClient, topic) => {
    
    return new Promise((resolve, reject) => {
        
        mqttClient.subscribe(topic, (err) => {
            if (err) {
                console.log('An error has occured: ', err)
                reject(err);
            } else {
                console.log('MQTT Client subscribed to topic: ', topic);
                mqttClient.on('message', (topic_subscribe, message) => {
                    const device_ip = message.toString();
                    //console.log('inside subscribeToTopic -> ', device_ip)
                    resolve(device_ip);
                })
            }
            
            
        })
        
    })
}

const publishToTopic = (mqttClient, topic, message) => {

    return new Promise((resolve, reject) => {
        mqttClient.publish(topic, message, { retain: true }, (err) => {
            if (err) {
                console.log(`Failed to publish msg: ${message}\nTo topic: ${topic}`);
                reject({ success: false, msg: 'something went wrong' });
            } else {
                console.log('message published with retain flag set to true');
                const response = 'success';
                resolve(response);
            }
        })
    })
    
}

const onMessage = () => {
    mqttClient.on('message', function(message) {
        return message.toString();
        //res.status(200).json({ success: true, msg: message.toString() })
    })
}

module.exports = {
    subscribeToAllTopics,
    subscribeToTopic,
    publishToTopic,
    onMessage
}

/* 
const publishToTopic = (req, res) => {
    console.log(req.body);
    const {topic} = req.body;
    const {msg} = req.body;

    if(!msg) {
        return res.status(400).json({ success: false, msg: 'please provide msg value' })
    } else if (!topic) {
        return res.status(400).json({ success: false, msg: 'please provide topic value' })
    }

    mqtt_async_client.publish(topic, msg, { retain: true }, (err) => {
        if (err) {
            console.log(`Failed to publish msg: ${msg}\nTo topic: ${topic}`);
            return res.status(500).json({ success: false, msg: 'something went wrong' })
        } else {
            console.log('message published with retain flag set to true');
            return res.status(201).json({ success: true, msg: `msg: ${msg} | published in topic: ${topic}` });
        }
    })
}
*/