const { connectToMqttBroker } = require('../Config/mqtt_config');
const { connectToDB } = require('../Config/mysql_config');


const { subscribeToAllTopics } = require('../Controllers/mqtt_controller');

const setup_experiment = async () => {

    // setup MySQL
    const connectToDBPromise = connectToDB();
    const mySQLClient = await connectToDBPromise;
    
    //console.log(`db_status: ${db_status}`);

    // setup MQTT
    const mqttClientPromise = connectToMqttBroker();
    const mqttClient = await mqttClientPromise;
    mqttClient.on('connect', (ack) => {
        if (!ack) console.log('MQTT Client not connected');
        else console.log('MQTT Client connected');
    })

    

    

    const subscribeToAllTopicsPromise = subscribeToAllTopics(mqttClient);
    const result = await subscribeToAllTopicsPromise;
    
    console.log('Result: ', result);
}

module.exports = {
    setup_experiment
}

