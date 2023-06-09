const mqtt_async_client = require('../Config/mqtt_config');
const mysql_client = require('../Config/mysql_config');



const setup_devices = async () => {
    // topics definition
    const topic_subscribe = 'device/client_ip';
    const topic_publish = 'device/client_id';

    try {
        // device IP Promise -> communication with mqtt broker
        const deviceIPPromise = new Promise((resolve) => {
            mqtt_async_client.subscribe(topic_subscribe, () => {
                console.log('MQTT Client subscribed to topic: ', topic_subscribe);
                mqtt_async_client.on('message', (topic_subscribe, message) => {
                    const device_ip = message.toString();
                    resolve(device_ip);
                })
            })
        })
        const device_ip = await deviceIPPromise;

        // device ID Promise -> communication with db
        const deviecIDPromise = new Promise((resolve) => {

            var sql = 'select * from devices_test where clientIP = ?;';
            var sqlParams = [device_ip];
            
            const query_result = [];
            
            var query = mysql_client.query(sql, sqlParams);

            query
                .on('error', (err) => {
                    if (err) throw err;
                })
                .on('result', (result) => {
                    query_result.push(result);
                })
                .on('end', () => {
                    if (query_result.length === 0) {
                        console.log('Query unsuccessful!');
                        query_result.push('False');
                    } else {
                        console.log('Query successful');
                    }
                    
                    resolve(query_result);
                });
            
        })

        const query_result = await deviecIDPromise;

        console.log(query_result);
    } catch(err) {
        console.log(err);
    }
}

module.exports = {
    setup_devices
}