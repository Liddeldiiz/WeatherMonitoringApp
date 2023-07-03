const express = require('express');
const router = express.Router();

const {
    publishToTopic,
    onMessage
} = require('../Controllers/mqtt_controller');



//connectToMqttBroker()

//router.get('/api/subscribe/esp', subscribeToTopic)
//router.post('/api/publish/esp', publishToTopic)

module.exports = router;