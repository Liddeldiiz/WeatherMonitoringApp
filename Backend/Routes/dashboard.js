const express = require('express');
const router = express.Router();

const {
    setDashboardUpdateCallback,
} = require('../Controllers/dashboard_controller');

const {
    getData
} = require('../Data/dashboard');

const {
    getAllWeatherDataForSelectedDevices,
} = require('../Controllers/mysql_controller');

router.get('/', (req, res) => {
    var data = getData();
    res.render('Dashboard', {data});
})

setDashboardUpdateCallback(() => {
    console.log('setDashboardUpdateCallback triggered')
    router.post('/api/data_dashboard', (req, res) => {
        var updatedData = getData();
        res.json(updatedData);
        //res.render('Dashboard', {data});
    })
})


router.get('/api/data_dashboard', (req, res) => {
    //queryDataWorker(getAllDevices);
    var updatedData = getData();
    res.json(updatedData);
    //res.render('Dashboard', {data});
})

router.get('/api/data_dashboard/weather', async (req, res) => {
    values = [1, 6, 23]
    
    const resultPromise = getAllWeatherDataForSelectedDevices([values]);
    const resultDone = await resultPromise;
    //console.log(resultDone);
    res.status(200).json(resultDone);
    res.end();
})

module.exports = router;