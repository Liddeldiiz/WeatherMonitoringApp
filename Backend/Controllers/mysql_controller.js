/////////////////////////////////// IMPORTS ///////////////////////////////////
const { runDBConfig, connectToDB } = require('../Config/mysql_config');
const { proxy1 } = require('../Data/dashboard');

const {
    getDeviceByIPSQL, 
    getDeviceByClientIDSQL, 
    getTempForSelectedDevicesSQL, 
    insertNewDeviceSQL, 
    insertNewWeahterDataSQL
} = require('../Queries');

/////////////////////////////////// MYSQL CLIENT ///////////////////////////////////
const mySQLClient = connectToDB();


/////////////////////////////////// EVENTS ///////////////////////////////////

mySQLClient.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL server: ', err);
        proxy1.service_status_db = false;
        //triggerDisplayDashboard.service_status_db = false;
        //setServiceStatusDB(false);
        delay(5000, () => {
            runDBConfig();
        })
        
    } else {
        console.log('MySQL Client connected')
        proxy1.service_status_db = true;
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

const getDeviceByIP = (device_ip) => {
    return new Promise((resolve, reject) => {
        
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
    

    
    //return row
    
    //console.log(`Result in mysql_controller after mysql_client: ${query_result}`);
    //return result;
}

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

const getDeviceByID = (mySQLClient, values) => {
    var sql = "SELECT * FROM devices_test where id in ?;";

}

const getTemp = (values) => {
    var sql = "SELECT createDate, device_id, temperature FROM weather_data where device_id in ?;";

    const query_result = [];
    var query = mySQLClient.query(getTempForSelectedDevicesSQL, [values]);
    query
        .on('error', function(err) {
            if (err) console.log(err);
        })
        .on('result', function(row) {
            query_result.push(row);
        })
        .on('end', function() {
            console.log('Query successful');
            console.log(query_result);
            //resolve(query_result);
        })
}

const handleCustomGetTemp = () => {

}

// INSERT

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

const handleMessage = async (topic, msg) => {
    
    if (topic === 'weather/data') {
        console.log(`msg.device_id = ${msg.device_id}`);
        DeviceIDPromise = getDeviceByClientID(msg.device_id);
        DeviceID = await DeviceIDPromise;

        console.log(DeviceID[0].id);
        console.log(msg.temperature);
        console.log(msg.humidity);

        const values = [DeviceID[0].id, msg.temperature, msg.humidity];

        const insertIntoWeather_DataPromise = insertIntoWeather_Data([values]);
        insertFinished = await insertIntoWeather_DataPromise;
        
    }
}


/////////////////////////////////// EXPORTS ///////////////////////////////////

module.exports =  {
    getDeviceByIP,
    getFunction,
    getTemp,
    insertIntoDevices_Test,
    insertIntoWeather_Data,
    getDeviceByClientID,
    handleMessage,
}