const dataObj = require('../Models/dashboard');
const mySqlController = require('../Controllers/mysql_controller');

exports.getDashboard = (req, res) => {
    var data = dataObj.getData();
    res.render('Dashboard', {data});
}

exports.updateDashboard = (req, res) => {
    var updatedData = getData();
    res.json(updatedData);
    //res.render('Dashboard', {data});
}

exports.getWeatherData = async (req, res) => {
    values = [1, 6, 23]
    
    const resultPromise = mySqlController.getAllWeatherDataForSelectedDevices([values]);
    const resultDone = await resultPromise;
    //console.log(resultDone);
    res.status(200).json(resultDone);
    res.end();
}

let dashboardUpdateCallback;

exports.setDashboardUpdateCallback = (callback) => {
    dashboardUpdateCallback = callback;
    //dashboardUpdateCallback = undefined;
}

exports.triggerDashboardUpdate = () => {
    if (dashboardUpdateCallback) {
        dashboardUpdateCallback();
    }
}

// not used anymore

let triggerDisplayDashboard;
const createDisplayDashboardTrigger = () => {
    return new Proxy({}, {
        set: (target, property, value) => {
            target[property] = value;
            //console.log(`target: ${JSON.stringify(target)}\nproperty: ${property}\nvalue: ${value}`)
            //displayDashboard();
            console.log('triggerDisplayDashboard triggered');
            triggerDashboardUpdate();
            return true;
        }
    });
};

triggerDisplayDashboard = createDisplayDashboardTrigger();

/*
module.exports = {
    setDashboardUpdateCallback,
    triggerDisplayDashboard,
    triggerDashboardUpdate,
}
*/