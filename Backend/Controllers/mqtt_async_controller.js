const mqtt_async_client = require('../Config/mqtt_async_config');

const subscribeToTopic = async (topic) => {
    console.log('Preparing answering Promise in "subscribeToTopic..."')
    return new Promise((resolve, reject) => {
        console.log('calling subscribe method on mqtt_async_client')
        mqtt_async_client.subscribe(topic, (err) => {
            if (err) {
                console.log('An error has occured: ', err)
                reject(err);
            } else {
                console.log('MQTT Client subscribed to topic: ', topic);
                mqtt_async_client.on('message', (topic_subscribe, message) => {
                    const device_ip = message.toString();
                    console.log('inside subscribeToTopic -> ', device_ip)
                    resolve(device_ip);
                })
            }
            console.log('after the if statement')
            
        })
        console.log('after the mqtt_async_client.subscribe method')
    })
}

module.exports = {
    subscribeToTopic
}