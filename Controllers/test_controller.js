
const dataTestObj = require('../Models/test');
const serverStatusObj = require('../Models/server_status');
const mySqlController = require('../Controllers/mysql_controller');

exports.getTest = (req, res) => {
    let test = dataTestObj.getData();
    console.log(test);
    let server_status = serverStatusObj.getServerStatus();
    const mergedObj = {
        test,
        server_status
    }
    console.log(mergedObj)
    res.render('TestNoTable', {mergedObj});
}

exports.getTestData = (req, res) => {
    //queryDataWorker(getAllDevices);
    var test = dataTestObj.getData();
    var server_status = serverStatusObj.getServerStatus();
    const mergedObj = {
        test,
        server_status
    }
    
    res.json(mergedObj);
    //res.render('Dashboard', {data});
}

exports.getTestWeather = async (req, res) => {
    values = [1, 6, 23];

    const resultPromise = mySqlController.getAllWeatherDataForSelectedDevices([values]);
    const resultDone = await resultPromise;

    
    res.status(200).json(resultDone);
    res.end();
}

exports.getTestTopics = async (req, res) => {
    const resultPromise = mySqlController.getAllTopics();
    const resultDone = await resultPromise;

    res.status(200).json(resultDone);
    res.end();
}

exports.getTestDevices = async (req, res) => {
    const resultPromise = mySqlController.getAllDevices();
    const resultDone = await resultPromise;

    // what are the possible error codes from the query.on() event?
    res.status(200).json(resultDone);
    res.end()
}

exports.getDataTestChartDefaultSettings = async (req, res) => {

    const resultPromise = mySqlController.getWeatherDataForTimeRangeAndSelectedDevice(proxyChartSettings.timerange[0], proxyChartSettings.timerange[1], proxyChartSettings.devicesArray);
    const resultDone = await resultPromise;

    const mergedObj = {
        deviceArray: proxyChartSettings.devicesArray,
        resultDone,
    }

    res.status(200).json(mergedObj)
}

let testMqttUpdateCallback;

exports.setTestMqttUpdateCallback = (callback) => {
    testMqttUpdateCallback = callback;
    //dashboardUpdateCallback = undefined;
}

exports.triggerTestUpdate = () => {
    if (testMqttUpdateCallback) {
        testMqttUpdateCallback();
    }
}
