const express = require('express');
const router = express.Router();

const { queryDataWorker } = require('../Controllers/worker_controller');
const { getAllDevices } = require('../Queries');

const {
    setDashboardUpdateCallback,
} = require('../Controllers/dashboard_controller');

const {
    getData
} = require('../Data/dashboard');

const mySQLClient = require('../../app');

const {
    getTemp
} = require('../Controllers/mysql_controller');

//router.get('/', displayDashboard);
//router.get('/update', )

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

router.get('/api/data_dashboard/temp', (req, res) => {
    values = [1, 6, 23]
    //getTemp(mySQLClient, [values]);
})

module.exports = router;