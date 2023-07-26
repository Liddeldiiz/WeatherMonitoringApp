//const { triggerTestUpdate } = require('../Controllers/test_controller');

class Server_Status {
    constructor(service_status_db, service_status_mqtt) {
        this.service_status_db = service_status_db;
        this.service_status_mqtt = service_status_mqtt;
    }
    
    hanldeServerStatus(service, status) {
        this.service = status;
        //triggerTestUpdate();
    }

    setStatusDB(status) {
        this.service_status_db = status;
    }

    setStatusMQTT(status) {
        this.service_status_mqtt = status;
    }

    getServerStatus() {
        return this;
    }
}

const serverStatus = new Server_Status(false, false);

module.exports = serverStatus;