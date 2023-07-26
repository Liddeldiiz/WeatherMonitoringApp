const dashBoardController = require('../Controllers/dashboard_controller');

class Data {
    constructor(
        isSetup, 
        service_status_db, 
        service_status_mqtt, 
        temp_value, 
        hum_value, 
        client_ip_value, 
        client_id_value, 
    ) {
        this.isSetup = isSetup;
        this.service_status_db = service_status_db;
        this.service_status_mqtt = service_status_mqtt;
        this.temp_value = temp_value;
        this.hum_value = hum_value;
        this.client_ip_value = client_ip_value;
        this.client_id_value = client_id_value;
    }

    getData() {
        return this;
    }

    handleData(prop, value) {
        this.prop = value;
        dashBoardController.triggerDashboardUpdate();
    }
}

const data = new Data(false, false, false, 0, 0, '', '');

module.exports = data;