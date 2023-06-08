const mqtt_client = require('../Config/mqtt_config');
const {
    getDeviceByIP
} = require('../Controllers/mysql_controller');

const setup_devices = () => {
    var device_ip;
    mqtt_client.subscribe('device/client_ip', () => {
        console.log('mqtt_client subscribed to topic: device/client_ip');
        mqtt_client.on('message', (topic, message) => {
            device_ip = message.toString()
            console.log(`Value from message: ${device_ip}`);
            //const rows = getDeviceByIP(device_ip)
            var rows;
            rows = getDeviceByIP('192.168.1.143');
            console.log(`Result: \n${rows}`);
            //mqtt_client.unsubscribe('device/client_ip');
        })
    })
}

module.exports = {
    setup_devices
}