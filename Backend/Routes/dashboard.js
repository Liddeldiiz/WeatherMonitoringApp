const express = require('express');
const router = express.Router();

const {
    displayDashboard,
    setDashboardUpdateCallback,
    getData
} = require('../Controllers/dashboard_controller');

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
    var updatedData = getData();
    res.json(updatedData);
    //res.render('Dashboard', {data});
})

module.exports = router;