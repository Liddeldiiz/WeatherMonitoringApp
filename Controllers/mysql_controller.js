const mysql_client = require('../Config/mysql_config');

const getDeviceByIP = (device_ip) => {
    var sql = 'select * from devices_test where clientIP = ?;';
    var sqlParams = [device_ip]
    mysql_client.query(sql, sqlParams, (err, result) => {
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

    })
    //console.log(`Result in mysql_controller after mysql_client: ${query_result}`);
    //return result;
}

module.exports =  {
    getDeviceByIP
}