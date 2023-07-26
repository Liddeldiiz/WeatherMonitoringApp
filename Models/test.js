//const testController = require('../Controllers/test_controller');

class Data_test {
    constructor(incomingMsg, outgoingMsg, popupNotification) {
        this.incomingMsg = incomingMsg;
        this.outgoingMsg = outgoingMsg;
        this.popupNotification = popupNotification;
    }

    getData() {
        return this;
    }

    handleData(prop, value) {
        this.prop = value;
        //testController.triggerTestUpdate();
    }

    setIncomingMsg(msg) {
        this.incomingMsg = msg;
    }

    setOutgoingMsg(msg) {
        this.outgoingMsg = msg;
    }

    setPopupNotification(popup) {
        this.popupNotification = popup;
    }
}

const data_test = new Data_test({}, {}, {});

module.exports = data_test;