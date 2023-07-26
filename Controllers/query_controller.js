/////////////////////////////////// DEVICES ///////////////////////////////////
// GET //
exports.getAllDevicesSQL = 'SELECT * FROM devices_test;';

exports.getDeviceByIDSQL = "SELECT * FROM devices_test WHERE id IN ?;";

exports.getDeviceByIPSQL = 'SELECT * FROM devices_test WHERE clientIP = ?;';

exports.getDeviceByClientIDSQL = "SELECT id FROM devices_test WHERE clientID = ?";

// INSERT //
exports.insertNewDeviceSQL = "INSERT INTO devices_test (clientID, clientIP) VALUES ?;"


/////////////////////////////////// DEVICE SETTINGS ///////////////////////////////////
// GET //
exports.getSettingsForAllDevices = 'SELECT device_id, settings_property, settings_value, modify_date FROM devices_settings ORDER BY device_id ASC;';

/////////////////////////////////// WEATHER DATA ///////////////////////////////////
// GET //
exports.getAllDataForOneDeviceSQL = 'SELECT * FROM devices_data WHERE device_id = ?;';

exports.getTempForSelectedDevicesSQL = "SELECT createDate, device_id, temperature FROM weather_data where device_id in ?;";

exports.getAllTempSQL = 'SELECT temperature FROM devices_data;';

exports.getAllHumSQL = 'SELECT humidity FROM devices_data;';

exports.getHumForSelectedDevicesSQL = "SELECT createDate, device_id, humidity FROM weather_data where device_id in ?;";

exports.getAllWeatherDataForSelectedDevicesSQL = "SELECT createDate, device_id, temperature, humidity FROM weather_data where device_id in ?;";
//                                                                                                                                    '2023-07-18 00:00:00'                                                                       '2023-07-19 00:00:00'
exports.getWheatherDataForTimeRangeSQL = "SELECT * FROM weather_data WHERE createDate BETWEEN (SELECT createDate FROM weather_data WHERE createDate >= ? ORDER BY createDate LIMIT 1) and (SELECT createDate FROM weather_data WHERE createDate <= ? ORDER BY createDate DESC LIMIT 1) AND device_id in (?);";


// INSERT //
exports.insertNewWeahterDataSQL = "INSERT INTO weather_data (device_id, temperature, humidity) VALUES ?"


/////////////////////////////////// TOPICS ///////////////////////////////////
// GET //
exports.getSubscribeTopicsSQL = 'SELECT * FROM devices_topics WHERE subscribe = 1 AND publish = 0;';

exports.getPublishTopicsSQL = 'SELECT * FROM devices_topics WHERE publish = 1 AND subscribe = 0;';

exports.getAllTopicsSQL = 'SELECT * FROM devices_topics;'

// create table devices_data (id INT AUTO_INCREMENT, device_id INT, temperature FLOAT, humidity FLOAT, PRIMARY KEY (id), FOREIGN KEY (device_id) REFERENCES decices_test (id));
    