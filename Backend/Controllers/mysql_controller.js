/////////////////////////////////// IMPORTS ///////////////////////////////////
const { runDBConfig, connectToDB } = require('../Config/mysql_config');
const { proxy1 } = require('../Data/dashboard');
const { proxy_test } = require('../Data/test');

const {
    getAllDevicesSQL,
    getDeviceByIPSQL, 
    getDeviceByClientIDSQL, 
    getTempForSelectedDevicesSQL, 
    insertNewDeviceSQL, 
    insertNewWeahterDataSQL,
    getAllWeatherDataForSelectedDevicesSQL,
    getAllTopicsSQL,
} = require('../Queries');

/////////////////////////////////// MYSQL CLIENT ///////////////////////////////////
const mySQLClient = connectToDB();


/////////////////////////////////// EVENTS ///////////////////////////////////

mySQLClient.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL server: ', err);
        proxy1.service_status_db = false;
        proxy_test.service_status_db = false;
        //triggerDisplayDashboard.service_status_db = false;
        //setServiceStatusDB(false);
        delay(5000, () => {
            runDBConfig();
        })
        
    } else {
        console.log('MySQL Client connected')
        proxy1.service_status_db = true;
        proxy_test.service_status_db = true;
        //triggerDisplayDashboard.service_status_db = true;
        //setServiceStatusDB(true);
    }
    //console.log(`db_status: ${db_status}`);
    
})

mySQLClient.on('error', (err) => {
    if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNREFUSED') {
        console.error('MySQL connection lost. Reconnecting...');
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

const getAllDevices = () => {
    return new Promise((resolve, reject) => {
        var counter = 0;
        const query_result = {};

        var query = mySQLClient.query(getAllDevicesSQL);

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
const getDeviceByID = (mySQLClient, values) => {
    var sql = "SELECT * FROM devices_test where id in ?;";

}

const getDeviceByIP = (device_ip) => {
    return new Promise((resolve, reject) => {
        
        console.log('getDeviceByIP: values: ', device_ip);
        var sqlParams = [device_ip]
        const query_result = [];
        var query = mySQLClient.query(getDeviceByIPSQL, sqlParams);
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

const getDeviceByClientID = (ClientID) => {
    return new Promise((resolve, reject) => {
        const query_result = [];
        
        var sql = "SELECT id FROM devices_test WHERE clientID = ?";

        var query = mySQLClient.query(getDeviceByClientIDSQL, ClientID);
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
const insertIntoDevices_Test = (values) => {
    var sql = "INSERT INTO devices_test (clientID, clientIP) VALUES ?;"

    var query = mySQLClient.query(insertNewDeviceSQL, [values]);
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

const getAllWeatherDataForSelectedDevices = (values) => {
    return new Promise((resolve, reject) => {
        var counter = 0;
        const query_result = {};
        var query = mySQLClient.query(getAllWeatherDataForSelectedDevicesSQL, [values]);
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

const getTempForSelectedDevices = (values) => {
    return new Promise((resolve, reject) => {
        var counter = 0;
        const query_result = {};
        var query = mySQLClient.query(getTempForSelectedDevicesSQL, [values]);
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

// INSERT //

const insertIntoWeather_Data = async (values) => {
    return new Promise((resolve, reject) => {
        //const finalValues = [[query_result[0], values[1], values[2]]];
    
        var sql2 = "INSERT INTO weather_data (device_id, temperature, humidity) VALUES ?"
    
        var query2 = mySQLClient.query(insertNewWeahterDataSQL, [values]);
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

const getAllTopics = () => {
    return new Promise((resolve, reject) => {
        var counter = 0;
        const query_result = {};

        var query = mySQLClient.query(getAllTopicsSQL);
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

const handleMessage = async (topic, msg) => {
    
    if (topic === 'weather/data') {
        DeviceIDPromise = getDeviceByClientID(msg.device_id);
        DeviceID = await DeviceIDPromise;

        const values = [DeviceID[0].id, msg.temperature, msg.humidity];

        const insertIntoWeather_DataPromise = insertIntoWeather_Data([values]);
        insertFinished = await insertIntoWeather_DataPromise;
        
    }
}

const handleTempDataFromDB = async(values) => {
    getTempPromise = await getTemp([values]);
    getTempDone = getTempPromise;

    return getTempDone;
}

////////////////// NOT USED FUNCTIONS //////////////////

const getFunction = (sql) => {
    
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

/////////////////////////////////// EXPORTS ///////////////////////////////////

module.exports =  {
    getDeviceByIP,
    getFunction,
    getTempForSelectedDevices,
    insertIntoDevices_Test,
    insertIntoWeather_Data,
    getDeviceByClientID,
    handleMessage,
    handleTempDataFromDB,
    getAllWeatherDataForSelectedDevices,
    getAllDevices,
    getAllTopics,
}