const fs = require('fs');
const express = require('express');

let dashboardUpdateCallback;

const setDashboardUpdateCallback = (callback) => {
    dashboardUpdateCallback = callback;
    //dashboardUpdateCallback = undefined;
}

const triggerDashboardUpdate = () => {
    if (dashboardUpdateCallback) {
        dashboardUpdateCallback();
    }
}

// not used anymore

let triggerDisplayDashboard;
const createDisplayDashboardTrigger = () => {
    return new Proxy({}, {
        set: (target, property, value) => {
            target[property] = value;
            //console.log(`target: ${JSON.stringify(target)}\nproperty: ${property}\nvalue: ${value}`)
            //displayDashboard();
            console.log('triggerDisplayDashboard triggered');
            triggerDashboardUpdate();
            return true;
        }
    });
};

triggerDisplayDashboard = createDisplayDashboardTrigger();

module.exports = {
    setDashboardUpdateCallback,
    triggerDisplayDashboard,
    triggerDashboardUpdate,
}