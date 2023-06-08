const mysql_client = require('../Config/mysql_config');

const getDeviceByIP = (device_ip) => {
    var sql = 'select * from devices_test where clientIP = ?;';
    var sqlParams = [device_ip]
    mysql_client.query(sql, sqlParams, (err, result) => {
        if (err) throw err;
        else if (result[0].clientID == undefined) { return 0; }
        else {
            const { clientID } = result[0];
            console.log(`Result in mysql_controller after mysql_client: ${clientID}`);
        }

    })
    //console.log(`Result in mysql_controller after mysql_client: ${query_result}`);
    //return result;
}

module.exports =  {
    getDeviceByIP
}