/////////////////////////////////// VARIABLES ///////////////////////////////////
var counter = 0;


/////////////////////////////////// FUNCTIONS ///////////////////////////////////

function fetchDataAndUpdate() {
    counter += 1;
    document.getElementById('counter').textContent = counter;
    fetch('/api/data_dashboard')
        .then(response => response.json())
        .then(updatedData => {
            if (updatedData.service_status_db) {
                document.getElementById('service_status_db').textContent = "Connected";
            } else {
                document.getElementById('service_status_db').textContent = "Connecting...";
            }
            
            if (updatedData.service_status_mqtt) {
                document.getElementById('service_status_mqtt').textContent = "Connected";
            } else {
                document.getElementById('service_status_mqtt').textContent = "Connecting...";
            }
            
            //document.getElementById(/*one by one*/);
        })
}


/////////////////////////////////// CALLING FUNCTIONS ///////////////////////////////////

setInterval(fetchDataAndUpdate, 3000);

fetchDataAndUpdate();