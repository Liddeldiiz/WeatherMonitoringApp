const { triggerTestUpdate } = require('../Controllers/test_controller');

function Data_test(incomingMsg, outgoingMsg, popupNotification, service_status_db, service_status_mqtt) {
    this.incomingMsg = incomingMsg;
    this.outgoingMsg = outgoingMsg;
    this.popupNotification = popupNotification;
    this.service_status_db = service_status_db;
    this.service_status_mqtt = service_status_mqtt;
}

const data_test = new Data_test({}, {}, {}, false, false);

const get_data_test = () => {
    return data_test;
}

const handler1 = {
    set(obj, prop, value) {
        obj[prop] = value;
        triggerTestUpdate();
    }
}

const proxy_test = new Proxy(data_test, handler1);

module.exports = {
    proxy_test,
    get_data_test,
}