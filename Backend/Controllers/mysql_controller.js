//const mysql_client = require('../Config/mysql_config');

const getDeviceByIP = (mysql_client, device_ip) => {
    return new Promise((resolve, reject) => {
        var sql = 'select * from devices_test where clientIP = ?;';
        var sqlParams = [device_ip]
        const query_result = [];
        var query = mysql_client.query(sql, sqlParams);
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

const getFunction = (mysql_client, sql) => {
    
    return new Promise((resolve, reject) => {
        const query_result = [];
        var query = mysql_client.query(sql);
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


module.exports =  {
    getDeviceByIP,
    getFunction
}

/*

 (err, result) => {
        if (err) throw err;
        else {
            try {
                const { clientID } = result[0];
                //console.log(`Result in mysql_controller after mysql_client: ${clientID}`);
                return clientID;
            } catch (error) {
                //console.log('No record with this IP has been found');
                return 0;
            }
        }

*/