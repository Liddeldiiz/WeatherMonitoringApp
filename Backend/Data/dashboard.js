const { triggerDashboardUpdate } = require('../Controllers/dashboard_controller');

function Data(
    isSetup, 
    service_status_db, 
    service_status_mqtt, 
    temp_value, 
    hum_value, 
    client_ip_value, 
    client_id_value, 
    
    ) 
{
        this.isSetup = isSetup;
        this.service_status_db = service_status_db;
        this.service_status_mqtt = service_status_mqtt;
        this.temp_value = temp_value;
        this.hum_value = hum_value;
        this.client_ip_value = client_ip_value;
        this.client_id_value = client_id_value;
        
}

const data = new Data(false, false, false, "", "", "", "", 0);


// Getter
const getData = () => {
    //console.log(JSON.stringify(data));
    return data;
}

// setting up the proxy
const handler1 = {
    set(obj, prop, value) {
        obj[prop] = value;
        triggerDashboardUpdate();
    }
}

const proxy1 = new Proxy(data, handler1);

module.exports = {
    proxy1,
    getData
}