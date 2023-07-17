let testMqttUpdateCallback;

const setTestMqttUpdateCallback = (callback) => {
    testMqttUpdateCallback = callback;
    //dashboardUpdateCallback = undefined;
}

const triggerTestUpdate = () => {
    if (testMqttUpdateCallback) {
        testMqttUpdateCallback();
    }
}

module.exports = {
    setTestMqttUpdateCallback,
    triggerTestUpdate,
}