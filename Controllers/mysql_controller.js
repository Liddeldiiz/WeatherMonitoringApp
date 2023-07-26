/////////////////////////////////// IMPORTS ///////////////////////////////////
const { runDBConfig, connectToDB } = require('../Config/mysql_config');
const serverStatus = require('../Models/server_status');

const queryController = require('./query_controller');

/////////////////////////////////// MYSQL CLIENT ///////////////////////////////////
const mySQLClient = connectToDB();


/////////////////////////////////// EVENTS ///////////////////////////////////

mySQLClient.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL server: ', err);
        serverStatus.setStatusDB(false);
        delay(5000, () => {
            runDBConfig();
        })
        
    } else {
        console.log('MySQL Client connected')
        serverStatus.setStatusDB(true);
    }
    //console.log(`db_status: ${db_status}`);
    
})

mySQLClient.on('error', (err) => {
    if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNREFUSED') {
        console.error('MySQL connection lost. Reconnecting...');
        serverStatus.setStatusDB(false);
        delay(5000, () => {
            runDBConfig();
        })
    } else if (err.code === 'ER_EMPTY_QUERY') {
        console.error('Query was empty!');
    }
})


/////////////////////////////////// FUNCTIONS ///////////////////////////////////

////////////////// DEVICES //////////////////

// GET //

exports.getAllDevices = () => {
    return new Promise((resolve, reject) => {
        var counter = 0;
        const query_result = {};

        var query = mySQLClient.query(queryController.getAllDevicesSQL);

        query
            .on('error', function(err) {
                if (err) reject(err);
            })
            .on('result', function(row) {
                //console.log(row);
                //query_test.push(row);
                
                var resultObj = {
                    "device_id": row.id,
                    "client_id": row.clientID
                }
                
                query_result[counter] = resultObj;
                counter += 1;
            })
            .on('end', function() {
                console.log('Query successful');
                resolve(query_result);
            })
    })
}

// to be updated!
exports.getDeviceByID = (mySQLClient, values) => {
    var sql = "SELECT * FROM devices_test where id in ?;";

}

exports.getDeviceByIP = (device_ip) => {
    return new Promise((resolve, reject) => {
        
        console.log('getDeviceByIP: values: ', device_ip);
        var sqlParams = [device_ip]
        const query_result = [];
        var query = mySQLClient.query(queryController.getDeviceByIPSQL, sqlParams);
        query
            .on('error', function(err) {
                if (err) reject(err);
            })
            .on('result', function(row) {
                query_result.push(row)
            }) 
            .on('end', function() {
                if (query_result.length === 0) {
                    console.log('Query unsuccessful!');
                    query_result.push(false);
                } else {
                    console.log('Query successful');
                }
                resolve(query_result);
            });
    })
}

exports.getDeviceByClientID = (ClientID) => {
    return new Promise((resolve, reject) => {
        const query_result = [];
        
        var sql = "SELECT id FROM devices_test WHERE clientID = ?";

        var query = mySQLClient.query(queryController.getDeviceByClientIDSQL, ClientID);
        query
            .on('error', function(err) {
                if (err) reject(err);
            })
            .on('result', function(row) {
                query_result.push(row);
            })
            .on('end', function() {
                console.log('Query successful');
                //console.log(query_result);
                resolve(query_result);
            })
    })
    
}

// INSERT //
// to be updated!
exports.insertIntoDevices_Test = (values) => {
    var sql = "INSERT INTO devices_test (clientID, clientIP) VALUES ?;"

    var query = mySQLClient.query(queryController.insertNewDeviceSQL, [values]);
    query
        .on('error', function(err) {
            if (err) console.log(err);
        })
        .on('result', function(result) {
            console.log("Number of records inserted: " + result.affectedRows);
        })
        .on('end', function() {
            console.log('Query successful');
        })
}

////////////////// WHEATHER //////////////////

// GET //

exports.getAllWeatherDataForSelectedDevices = (values) => {
    return new Promise((resolve, reject) => {
        var counter = 0;
        const query_result = {};
        var query = mySQLClient.query(queryController.getAllWeatherDataForSelectedDevicesSQL, [values]);
        query
            .on('error', function(err) {
                if (err) reject(err);
            })
            .on('result', function(row) {
                var resultObj = {
                    "date": row.createDate,
                    "device_id": row.device_id,
                    "temperature": row.temperature,
                    "humidity": row.humidity
                }
                query_result[counter] = resultObj;
                counter += 1;
            })
            .on('end', function() {
                console.log('Query successful');
                resolve(query_result);
            })
    })
}

exports.getTempForSelectedDevices = (values) => {
    return new Promise((resolve, reject) => {
        var counter = 0;
        const query_result = {};
        var query = mySQLClient.query(queryController.getTempForSelectedDevicesSQL, [values]);
        query
            .on('error', function(err) {
                if (err) reject(err);
            })
            .on('result', function(row) {
                var resultObj = {
                    "date": row.createDate,
                    "device_id": row.device_id,
                    "temperature": row.temperature
                }
                query_result[counter] = resultObj;
                counter += 1;
            })
            .on('end', function() {
                console.log('Query successful');
                resolve(query_result);
            })
    })
}

exports.getWeatherDataForTimeRangeAndSelectedDevice = (from, to, deviceArray) => {
    return new Promise((resolve, reject) => {
        var counter = 0;
        const query_result = {};
        var query = mySQLClient.query(queryController.getWheatherDataForTimeRangeSQL, [from, to, deviceArray]);

        query
            .on('error', function(err) {
                if (err) reject(err);
            })
            .on('result', function(row) {
                var resultObj = {
                    "date": row.createDate,
                    "device_id": row.device_id,
                    "temperature": row.temperature,
                    "humidity": row.humidity,
                }
                query_result[counter] = resultObj;
                counter += 1;
            })
            .on('end', function() {
                console.log('Query successful');
                resolve(query_result);
            })
            
    })
}

// INSERT //

exports.insertIntoWeather_Data = async (values) => {
    return new Promise((resolve, reject) => {
        //const finalValues = [[query_result[0], values[1], values[2]]];
    
        var sql2 = "INSERT INTO weather_data (device_id, temperature, humidity) VALUES ?"
    
        var query2 = mySQLClient.query(queryController.insertNewWeahterDataSQL, [values]);
        query2
            .on('error', function(err) {
                if (err) reject(err);
            })
            .on('result', function(result) {
                console.log("Number of records inserted: " + result.affectedRows);
            })
            .on('end', function() {
                console.log('Query successful');
                resolve(true);
            }) 
    })
}

////////////////// TOPICS //////////////////

exports.getAllTopics = () => {
    return new Promise((resolve, reject) => {
        var counter = 0;
        const query_result = {};

        var query = mySQLClient.query(queryController.getAllTopicsSQL);
        query
            .on('error', function(err) {
                if (err) reject(err);
            })
            .on('result', function(row) {
                //query_test.push(row);
                console.log(row);
                
                var resultObj = {
                    "topic": row.topics,
                    "subscribe": row.subscribe,
                    "publish": row.publish
                }
                
                query_result[counter] = resultObj;
                counter += 1;
            })
            .on('end', function() {
                console.log('Query successful');
                resolve(query_result);
            })
    })
}

////////////////// HELPER FUNCTIONS //////////////////

// where to move this helper function?
exports.handleTempDataFromDB = async(values) => {
    getTempPromise = await getTemp([values]);
    getTempDone = getTempPromise;

    return getTempDone;
}

////////////////// NOT USED FUNCTIONS //////////////////

exports.getFunction = (sql) => {
    
    return new Promise((resolve, reject) => {
        const query_result = [];
        var query = mySQLClient.query(sql);
        query
            .on('error', function(err) {
                if (err) reject(err);
            })
            .on('result', function(row) {
                query_result.push(row);
            })
            .on('end', function() {
                console.log('Query successful');
                //console.log(query_result);
                resolve(query_result);
            })
    })
    
}