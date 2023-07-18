/////////////////////////////////// DEVICES ///////////////////////////////////
// GET //
var getAllDevicesSQL = 'SELECT * FROM devices_test;';

var getDeviceByIDSQL = "SELECT * FROM devices_test WHERE id IN ?;";

var getDeviceByIPSQL = 'SELECT * FROM devices_test WHERE clientIP = ?;';

var getDeviceByClientIDSQL = "SELECT id FROM devices_test WHERE clientID = ?";

// INSERT //
var insertNewDeviceSQL = "INSERT INTO devices_test (clientID, clientIP) VALUES ?;"


/////////////////////////////////// DEVICE SETTINGS ///////////////////////////////////
// GET //
var getSettingsForAllDevices = 'SELECT device_id, settings_property, settings_value, modify_date FROM devices_settings ORDER BY device_id ASC;';

/////////////////////////////////// WEATHER DATA ///////////////////////////////////
// GET //
var getAllDataForOneDeviceSQL = 'SELECT * FROM devices_data WHERE device_id = ?;';

var getTempForSelectedDevicesSQL = "SELECT createDate, device_id, temperature FROM weather_data where device_id in ?;";

var getAllTempSQL = 'SELECT temperature FROM devices_data;';

var getAllHumSQL = 'SELECT humidity FROM devices_data;';

var getHumForSelectedDevicesSQL = "SELECT createDate, device_id, humidity FROM weather_data where device_id in ?;";

var getAllWeatherDataForSelectedDevicesSQL = "SELECT createDate, device_id, temperature, humidity FROM weather_data where device_id in ?;";


// INSERT //
var insertNewWeahterDataSQL = "INSERT INTO weather_data (device_id, temperature, humidity) VALUES ?"


/////////////////////////////////// TOPICS ///////////////////////////////////
// GET //
var getSubscribeTopicsSQL = 'SELECT * FROM devices_topics WHERE subscribe = 1 AND publish = 0;';

var getPublishTopicsSQL = 'SELECT * FROM devices_topics WHERE publish = 1 AND subscribe = 0;';

var getAllTopicsSQL = 'SELECT * FROM devices_topics;'




module.exports = {
    // DEVICES //
    getAllDevicesSQL,
    getDeviceByIDSQL,
    getDeviceByIPSQL,
    getDeviceByClientIDSQL,
    insertNewDeviceSQL,

    // WEATHER //
    getAllDataForOneDeviceSQL,
    getTempForSelectedDevicesSQL,
    getAllTempSQL,
    getAllHumSQL,
    getHumForSelectedDevicesSQL,
    insertNewWeahterDataSQL,
    getAllWeatherDataForSelectedDevicesSQL,

    // TOPICS //
    getSubscribeTopicsSQL,
    getPublishTopicsSQL,
    getAllTopicsSQL,
}


// create table devices_data (id INT AUTO_INCREMENT, device_id INT, temperature FLOAT, humidity FLOAT, PRIMARY KEY (id), FOREIGN KEY (device_id) REFERENCES decices_test (id));
    