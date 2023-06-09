const mqtt_client = require('../Config/mqtt_config');
const mysql_client = require('../Config/mysql_config');



const setup_devices = async () => {
    var device_ip;
    mqtt_client.subscribe('device/client_ip', () => {
        console.log('MQTT Client subscribed to topic: device/client_ip');
        mqtt_client.on('message', (topic, message) => {
            device_ip = message.toString()
            console.log(`Value from message: ${device_ip}`);
            var sql = 'select * from devices_test where clientIP = ?;';
            //var sqlParams = [device_ip];
            var sqlParams = ['192.168.1.143'];
            const query_result = [];
            var query = mysql_client.query(sql, sqlParams);
            try {
                query
                .on('error', function(err) {
                        console.log('An error has occured: ', err);
                        if (err) throw err;
                    })
                    .on('result', function(row) {
                        if(!row.clientID) throw err;
                        query_result.push(row)
                    }) 
                    .on('end', function() {
                        console.log('Query successful');
                        console.log(query_result);
                        console.log('publishing on topic: device/client_id')
                        const topic = 'device/client_id';
                        const msg = `{ device_ip: ${device_ip}, device_id: ${query_result[0].clientID} }`
                        mqtt_client.publish(topic, msg,{ retain: true }, (err) => {
                            if (err) {
                                console.log('Failed to publish message: ', err);
                            } else {
                                console.log('Message published with retain flag set to true');
                                console.log(msg);
                            }
                        })
                    });
                //const rows = getDeviceByIP(device_ip)
                //var rows = getDeviceByIP(device_ip);
                //console.log(`Result: \n${rows}`);
                //mqtt_client.unsubscribe('device/client_ip');
                
            } catch (error) {
                console.log(error);
                console.log('No record found for ', device_ip);
                const topic = 'device/client_id';
                const msg = `{ device_ip: ${device_ip}, device_id: False }`;
                
                mqtt_client.publish(topic, msg, { retain : true }, (err) => {
                    if (err) {
                        console.log('Failed to publish message: ', err);
                    } else {
                        console.log('Message published with retian flag set to true');
                        console.log(msg);
                    }
                })
            }
        })
            
    })
}

module.exports = {
    setup_devices
}