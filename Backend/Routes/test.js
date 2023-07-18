const express = require('express');
const router = express.Router();

const {
    setTestMqttUpdateCallback
} = require('../Controllers/test_controller');

const {
    get_data_test
} = require('../Data/test');

const {
    getAllWeatherDataForSelectedDevices,
    getAllDevices,
    getAllTopics
} = require('../Controllers/mysql_controller');

router.get('/test', (req, res) => {
    var data = get_data_test();
    console.log(data);
    res.render('Test', {data});
})

router.get('/api/data_test/data', (req, res) => {
    //queryDataWorker(getAllDevices);
    var updatedData = get_data_test();
    res.json(updatedData);
    //res.render('Dashboard', {data});
})

router.get('/api/data_test/weather', async (req, res) => {
    values = [1, 6, 23];

    const resultPromise = getAllWeatherDataForSelectedDevices([values]);
    const resultDone = await resultPromise;

    res.status(200).json(resultDone);
    res.end();
})

router.get('/api/data_test/topics', async (req, res) => {
    const resultPromise = getAllTopics();
    const resultDone = await resultPromise;

    res.status(200).json(resultDone);
    res.end();
})

router.get('/api/data_test/devices', async (req, res) => {
    const resultPromise = getAllDevices();
    const resultDone = await resultPromise;

    // what are the possible error codes from the query.on() event?
    res.status(200).json(resultDone);
    res.end()
})

setTestMqttUpdateCallback(() => {
    console.log('setTestMqttUpdateCallback triggered')
    var updatedData = get_data_test();
    console.log(updatedData);
    router.post('/api/data_test/data', (req, res) => {
        
        //console.log(updatedData.incomingMsg);
    })
})

module.exports = router;