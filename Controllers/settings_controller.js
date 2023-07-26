let settingsUpdateCallback;

const setSettingsUpdateCallbackUpdateCallback = (callback) => {
    settingsUpdateCallbackUpdateCallback = callback;
    //dashboardUpdateCallback = undefined;
}

const triggerSettingsUpdate = () => {
    if (settingsUpdateCallbackUpdateCallback) {
        settingsUpdateCallbackUpdateCallback();
    }
}

module.exports = {
    setSettingsUpdateCallbackUpdateCallback,
    triggerSettingsUpdate,
}