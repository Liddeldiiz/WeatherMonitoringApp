const express = require('express');
const router = express.Router();

const testController = require('../Controllers/test_controller');
const dataTestObj = require('../Models/test');

const mySqlController = require('../Controllers/mysql_controller');

const serverStatusObj = require('../Models/server_status').default;

const getDefualtDeviceList = async () => {
    const resultPromise = mySqlController.getAllDevices();
    const resultDone = await resultPromise;

    const asArray = Object.entries(resultDone);
    const deviceIDs = asArray.map(entry => entry[1].device_id);

    //console.log('deviceIDs: ', deviceIDs);
    //proxyChartSettings.devicesArray = deviceIDs;
    //console.log('proxyChartSettings.devices_array: ', proxyChartSettings.devicesArray);
    console.log('default device list setup');
    
}

// setup default settings for the chart

var day = new Date().getDate();
var month = new Date().getMonth();
var year = new Date().getFullYear();

var today = `${year}-${month}-${day} 00:00:00`;
var yesterday = `${year}-${month}-${day-1} 00:00:00`;

//const defaultTimerange = [today, yesterday];
const mockDefaultTimerange = ['2023-07-13 00:00:00', '2023-07-14 00:00:00']
//proxyChartSettings.timerange = mockDefaultTimerange;

const defaultDevicesArray = []
getDefualtDeviceList(defaultDevicesArray);
//console.log(proxyChartSettings.devices_array)
//proxyChartSettings.devices_array = defaultDevicesArray;

router.get('/test', testController.getTest)

router.get('/api/data_test/data', testController.getTestData);

router.get('/api/data_test/weather', testController.getTestWeather);

router.get('/api/data_test/topics', testController.getTestTopics);

router.get('/api/data_test/devices', testController.getTestDevices);

testController.setTestMqttUpdateCallback(() => {
    console.log('setTestMqttUpdateCallback triggered')
    
    var updatedData = dataTestObj.getData();
    console.log(updatedData);
    router.post('/api/data_test/data', testController.getTestData);
});

router.get('/api/data_test/chart_data/defaultSettings', testController.getDataTestChartDefaultSettings);

router.post('/api/data_test/chart_data', async (req, res) => {

    //const resultPromise = getWeatherDataForTimeRangeAndSelectedDevice(proxyChartSettings.timerange[0], proxyChartSettings.timerange[1], proxyChartSettings.devicesArray);
    //const resultDone = await resultPromise;
    //console.log(resultDone)
    /*
    console.log(req.method);
    console.log(req.body);
    console.log(req.headers);
    */
})

module.exports = router;