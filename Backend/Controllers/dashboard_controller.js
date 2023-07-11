const fs = require('fs');
const express = require('express');



function Data(
    isSetup, service_status_db, 
    service_status_mqtt, temp_value, 
    hum_value, client_ip_value, client_id_value, counter) {
        this.isSetup = isSetup;
        this.service_status_db = service_status_db;
        this.service_status_mqtt = service_status_mqtt;
        this.temp_value = temp_value;
        this.hum_value = hum_value;
        this.client_ip_value = client_ip_value;
        this.client_id_value = client_id_value;
        this.counter = counter;
}

const data = new Data(false, false, false, "", "", "", "", 0)

let dashboardUpdateCallback;

const displayDashboard = (req, res) => {
    //console.log(data);
    res.render('Dashboard', 
        {   
            data
        });
}

const setServiceStatusDB = (value) => {
    return data.service_status_db = value;
}

const getData = () => {
    //console.log(JSON.stringify(data));
    return data;
}

const setDashboardUpdateCallback = (callback) => {
    dashboardUpdateCallback = callback;
    //dashboardUpdateCallback = undefined;
}

const triggerDashboardUpdate = () => {
    if (dashboardUpdateCallback) {
        dashboardUpdateCallback();
    }
}

// setting up the proxy
const handler1 = {
    set(obj, prop, value) {
        obj[prop] = value;
        triggerDashboardUpdate();
    }
}

const proxy1 = new Proxy(data, handler1);

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
    displayDashboard,
    setServiceStatusDB,
    setDashboardUpdateCallback,
    getData,
    triggerDisplayDashboard,
    proxy1
}