const express = require('express');
const router = express.Router();
const dashBoardController = require('../Controllers/dashboard_controller');

router.get('/', dashBoardController.getDashboard);

dashBoardController.setDashboardUpdateCallback(() => {
    console.log('setDashboardUpdateCallback triggered')
    router.post('/api/data_dashboard', dashBoardController.updateDashboard);
})

router.get('/api/data_dashboard/weather', dashBoardController.getWeatherData)

// not used
router.get('/api/data_dashboard', (req, res) => {
    //queryDataWorker(getAllDevices);
    //var test = getData();
    //var server_status = getServerStatus();

    /*
    const mergedObj = {
        test,
        server_status
    }
    console.log(JSON.stringify(mergedObj));

    */
    //res.json(updatedData);
    //res.render('Dashboard', {data});
})

module.exports = router;