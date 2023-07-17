import { Chart } from 'chart.js';

/////////////////////////////////// VARIABLES ///////////////////////////////////
const not_unique_device_ids = [];

const device1_temp = [];
const device2_temp = [];
const device3_temp = [];

const device1_hum = [];
const device2_hum = [];
const device3_hum = [];

const tempDataFromDB = [
    { label: 'Device 1', values: device1_temp, fill: false, borderColor: 'rgb(75, 192, 192)', tension: 0.1 },
    { label: 'Device 2', values: device2_temp, fill: false, borderColor: 'rgb(255, 75, 25)', tension: 0.1 },
    { label: 'Device 3', values: device3_temp, fill: false, borderColor: 'rgb(130, 130, 130)', tension: 0.1 }
];

const humDataFromDB = [
    { label: 'Device 1', values: device1_hum, fill: false, borderColor: 'rgb(75, 192, 192)', tension: 0.1 },
    { label: 'Device 2', values: device2_hum, fill: false, borderColor: 'rgb(255, 75, 25)', tension: 0.1 },
    { label: 'Device 3', values: device3_hum, fill: false, borderColor: 'rgb(130, 130, 130)', tension: 0.1 }
];


/////////////////////////////////// FUNCTIONS ///////////////////////////////////

function fetchWeatherData() {
    fetch('/api/data_dashboard/weather')
        .then(response => response.json())
        .then(dataFromBackend => {
            for(let i = 0; i < Object.getOwnPropertyNames(dataFromBackend).length; i++) {
                if (dataFromBackend[i].device_id == 1) {
                    not_unique_device_ids.push(dataFromBackend[i].device_id);
                    //device1_labels.push(dataFromBackend[i].date);
                    device1_temp.push({x: dataFromBackend[i].date, y: dataFromBackend[i].temperature});
                    device1_hum.push({x: dataFromBackend[i].date, y: dataFromBackend[i].humidity});
                }
                else if (dataFromBackend[i].device_id == 6) {
                    not_unique_device_ids.push(dataFromBackend[i].device_id);
                    //device2_labels.push(dataFromBackend[i].date);
                    device2_temp.push({x: dataFromBackend[i].date, y: dataFromBackend[i].temperature});
                    device2_hum.push({x: dataFromBackend[i].date, y: dataFromBackend[i].humidity});
                }
                else if (dataFromBackend[i].device_id == 23) {
                    not_unique_device_ids.push(dataFromBackend[i].device_id);
                    //device3_labels.push(dataFromBackend[i].date);
                    device3_temp.push({x: dataFromBackend[i].date, y: dataFromBackend[i].temperature});
                    device3_hum.push({x: dataFromBackend[i].date, y: dataFromBackend[i].humidity});
                }
            }
            const tempDatasets = tempDataFromDB.map((data) => {
                return {
                    label: data.label,
                    data: data.values,
                    fill: data.fill, 
                    borderColor: data.borderColor, 
                    tension: data.tension
                }
            })
            const humDatasets = humDataFromDB.map((data) => {
                return {
                    label: data.label,
                    data: data.values,
                    fill: data.fill, 
                    borderColor: data.borderColor, 
                    tension: data.tension
                }
            })
            temp_chart.data.datasets = tempDatasets;
            hum_chart.data.datasets = humDatasets;
            temp_chart.update();
            hum_chart.update();
            
        })
}


/////////////////////////////////// CREATING CHART WITH DATA FROM DB ///////////////////////////////////

const ctx_temp = document.getElementById('temp_chart');
const ctx_hum = document.getElementById('hum_chart');


const temp_chart = new Chart(ctx_temp, {
    type: 'line',
    data: {
        datasets: []
    },
    options: {
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'hour',
                    displayFormats: {
                        hour: 'HH:mm'
                    }
                },
                ticks: {
                    source: 'data'
                }
            },
            y: {
            }
        }
    }
})

const hum_chart = new Chart(ctx_hum, {
    type: 'line',
    data: {
        datasets: []
    },
    options: {
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'hour',
                    displayFormats: {
                        hour: 'HH:mm'
                    }
                },
                ticks: {
                    source: 'data'
                }
            },
            y: {
            }
        }
    }
})


/////////////////////////////////// CALLING FUNCTIONS ///////////////////////////////////

fetchWeatherData();