function DeviceArray(deviceID) {
    this.deviceID = deviceID
    this.tempArray = [];
    this.humArray = [];
}

var data = '<%= data %>';

const nodeArrDevices_incoming = []; // used in devices
const nodeArrTopics_incoming = [];
const nodeArrMsg_incoming = [];
const nodeArrJsonMsg_incoming = [];
const nodeArrDevices_outgoing = [];
const nodeArrTopics_outgoing = [];
const nodeArrMsg_outgoing = [];
const nodeArrJsonMsg_outgoing = [];

var isSettingUpIncoming = true;
var isSettingUpOutgoing = true;
var isSettingUpDefaultChart = true;


const not_unique_device_ids = [];
const deviceObjArr = [];

const device1_temp = [];
const device2_temp = [];
const device3_temp = [];

const device1_hum = [];
const device2_hum = [];
const device3_hum = [];

const color_pallette = ['rgb(75, 192, 192)', 'rgb(255, 75, 25)', 'rgb(130, 130, 130)']

const temperatureDataFromDB = [];

const humDataFromDB = [
    { label: 'Device 1', values: device1_hum, fill: false, borderColor: 'rgb(75, 192, 192)', tension: 0.1 },
    { label: 'Device 2', values: device2_hum, fill: false, borderColor: 'rgb(255, 75, 25)', tension: 0.1 },
    { label: 'Device 3', values: device3_hum, fill: false, borderColor: 'rgb(130, 130, 130)', tension: 0.1 }
];



const db_icon = document.getElementById('svg-db');
const mqtt_icon = document.getElementById('svg-mqtt');

const mqtt_incoming_id_string = 'mqtt-incoming-id';
var mqtt_incoming_id = document.createElement('div');

const mqtt_outoging_id_string = 'mqtt-outgoing-id';
var mqtt_outgoing_id = document.createElement('div');

const mqtt_topics_id_string = 'mqtt-topics-id';
var mqtt_topics = document.createElement('div');

const device_bar_id_string = 'device-bar-id';
var device_bar = document.getElementById(device_bar_id_string);

const empty_body_string = 'empty-incoming-msg-body';
var empty_body_div;

const empty_outgoing_body_string = 'empty-outgoing-msg-body';
var empty_outgoing_body_div = document.getElementById(empty_outgoing_body_string);

//// INCOMOING ////

const incomingMsg_topic_string = 'incomingMsg-topic';
var incomingMsg_topic = document.createElement('div');

const incomingMsg_message_string = 'incomingMsg-message';
var incomingMsg_message = document.createElement('div');

const incomingMsg_topic_title_string = 'incomingMsg-topic-title';
var incomingMsg_topic_title = document.createElement('div');

const incomingMsg_message_title_string = 'incomingMsg-message-title';
var incomingMsg_message_title = document.createElement('div');

const incomingMsg_topic_content_string = 'incomingMsg-topic-content';
var incomingMsg_topic_content = document.createElement('div');

const incomingMsg_message_content_string = 'incomingMsg-message-content';
var incomingMsg_message_content = document.createElement('div');

const incomingMsg_message_content_row_id = incomingMsg_message_content_string;
const incomingMsg_message_content_row_class = `${incomingMsg_message_content_row_id}-row`;
var incomingMsg_message_content_row;

const incomingMsg_message_content_row_column_key_id = incomingMsg_message_content_row_class;
var incomingMsg_message_content_row_column_key;

const incomingMsg_message_content_row_column_value_id = incomingMsg_message_content_string;
var incomingMsg_message_content_row_column_value;

//// OUTGOING ////

const outgoingMsg_topic_string = 'outgoingMsg-topic';
var outgoingMsg_topic = document.createElement('div');

const outgoingMsg_message_string = 'outgoingMsg-message';
var outgoingMsg_message = document.createElement('div');

const outgoingMsg_topic_title_string = 'outgoingMsg-topic-title';
var outgoingMsg_topic_title = document.createElement('div');

const outgoingMsg_message_title_string = 'outgoingMsg-message-title';
var outgoingMsg_message_title = document.createElement('div');

const outgoingMsg_topic_content_string = 'outgoingMsg-topic-content';
var outgoingMsg_topic_content = document.createElement('div');

const outgoingMsg_message_content_string = 'outgoingMsg-message-content';
var outgoingMsg_message_content = document.createElement('div');

const outgoingMsg_message_content_row_id = outgoingMsg_message_content_string;
const outgoingMsg_message_content_row_class = `${outgoingMsg_message_content_row_id}-row`;
var outgoingMsg_message_content_row;

const outgoingMsg_message_content_row_column_key_id = outgoingMsg_message_content_row_class;
var outgoingMsg_message_content_row_column_key;

const outgoingMsg_message_content_row_column_value_id = outgoingMsg_message_content_string;
var outgoingMsg_message_content_row_column_value;

//// TOPICS ////
const topics_header_string = 'topics-header-row';
var topics_header = document.createElement('div');

const topics_topic_string = 'topics-topic';
var topics_topic = document.createElement('div');

const topics_subscribe_string = 'topics-subscribe';
var topics_subscribe = document.createElement('div');

const topics_publish_string = 'topics-publish';
var topics_publish = document.createElement('div');

const topics_data_string = 'topics-data';
var topics_data = document.createElement('div');

const topics_data_topic_column_string = 'topics-data-topic-column';
var topics_data_topic_column = document.createElement('div');

const topics_data_subscribe_column_string = 'topics-data-subscribe-column';
var topics_data_subscribe_column = document.createElement('div');

const topics_data_publish_column_string = 'topics-data-publish-column';
var topics_data_publish_column = document.createElement('div');

//// DEVICES ////
const devices_header_string = 'devices-header-row';
var devices_header = document.createElement('div');

const devices_clientID_string = 'devices-clientID';
var devices_clientID = document.createElement('div');

const devices_deviceID_string = 'devices-deviceID';
var devices_deviceID = document.createElement('div');

const devices_data_string = 'devices-data';
var devices_data = document.createElement('div');

const devices_data_clientID_string = 'devices-data-clientID-column';
var devices_data_clientID = document.createElement('div');

const devices_data_deviceID_string = 'devices-data-deviceID-column';
var devices_data_deviceID = document.createElement('div');



/////////////////////////////////// FUNCTIONS ///////////////////////////////////

function createNodeWithParams(node_element, text, id, flag, id_self, class_self) {
    if (flag === 0) {
        let node = document.createElement(node_element);
        let text_node = document.createTextNode(text);
        node.appendChild(text_node);
        document.getElementById(id).appendChild(node);
    }
    else if (flag === 1) {
        let node = document.createElement(node_element);
        let text_node = document.createTextNode(text);
        node.id = id_self;
        node.className = class_self;
        node.appendChild(text_node);
        document.getElementById(id).appendChild(node);
    }
}

function createRowsForTableWithParams(dataFromBackend, id, parent, flag, arr) {
    
    
    for (let i = 0; i < Object.getOwnPropertyNames(dataFromBackend).length  + flag; i++) {
        let node = document.createElement('tr');
        let counter = arr.length;
        node.id = `row-${i}-${parent}`;
        node.className = `row-${i}-${parent}`;
        arr.push(node);
        document.getElementById(id).appendChild(arr[i]);
    }
    
}

function createRowsForTableWithParams_Devices(dataFromBackend, id, parent, flag, arr) {
    
    if (nodeArrDevices_incoming.length = 0) {
        for (let i = 0; i < Object.getOwnPropertyNames(dataFromBackend).length  + flag; i++) {
            let node = document.createElement('tr');
            node.id = `row-${i}-${parent}`;
            node.className = `row-${i}-${parent}`;
            arr.push(node);
            document.getElementById(id).appendChild(arr[i]);
        }
    } else {
        for (let i = 0; i < Object.getOwnPropertyNames(dataFromBackend).length  + flag; i++) {
            let node = document.createElement('tr');
            let counter = arr.length - 1;
            node.id = `${counter}-row-${parent}`;
            arr.push(node);
            document.getElementById(id).appendChild(arr[i]);
        }
    }
}

// creates an eventlistener for mouseover event and mouseout event on the server icons
function createMouseoverAndMouseoutEventListener(element, element_state, element_name) {
    element.addEventListener('mouseover', (event) => {
        var tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        if (element_state) {
            tooltip.innerText = `${element_name} is Connected`;
        } else {
            tooltip.innerText = `${element_name} is not Connected!`;
        }
        // Position the tooltip relative to the mouse cursor
        tooltip.style.left = (event.pageX + 10) + "px";
        tooltip.style.top = (event.pageY + 10) + "px";
        // Append the tooltip to the document body
        document.body.appendChild(tooltip);
    })
    element.addEventListener('mouseout', function() {
        var tooltips = document.getElementsByClassName('tooltip');
        // Remove all existing tooltips
        while(tooltips.length > 0) {
            tooltips[0].parentNode.removeChild(tooltips[0]);
        }
    })
}

// creates the display of the message received on the topic: weather/data
function createMsgForWeatherData(updatedData, keysArr) {
    for(let i = 0; i < keysArr.length; i++) {
        // Message
        // creating the second column of the second row                                                        
        incomingMsg_message_content_row = document.createElement('div');
        incomingMsg_message_content_row.id = `${incomingMsg_message_content_string}-${i}`;
        incomingMsg_message_content_row.className = incomingMsg_message_content_row_class;
        incomingMsg_message_content.appendChild(incomingMsg_message_content_row);

        incomingMsg_message_content_row_column_key = document.createElement('div');
        incomingMsg_message_content_row_column_key.id = `incomingMsg-message-content-row-${i}-column-key`;
        incomingMsg_message_content_row_column_key.className = `incomingMsg-message-content-row-column-key`;
        document.getElementById(incomingMsg_message_content_row.id).appendChild(incomingMsg_message_content_row_column_key);
        document.getElementById(incomingMsg_message_content_row_column_key.id).textContent = keysArr[i];

        incomingMsg_message_content_row_column_value = document.createElement('div');
        incomingMsg_message_content_row_column_value.id = `${incomingMsg_message_content_row_column_value_id}-${i}-column-value`;
        incomingMsg_message_content_row_column_value.className = `${incomingMsg_message_content_row_column_value_id}-row-column-value`;
        document.getElementById(incomingMsg_message_content_row.id).appendChild(incomingMsg_message_content_row_column_value);
        document.getElementById(incomingMsg_message_content_row_column_value.id).textContent = updatedData.incomingMsg.message[keysArr[i]];
        console.log('Message added');
    }
}

// creates the display of the message received on the topic: device/setup
function createTableForDeviceSetup(updatedData, keysArr) {
    for(let i = 0; i < keysArr.length; i++) {
    // Message
    // creating the second column of the second row                                                        
        outgoingMsg_message_content_row = document.createElement('div');
        outgoingMsg_message_content_row.id = `${outgoingMsg_message_content_string}-${i}`;
        outgoingMsg_message_content_row.className = outgoingMsg_message_content_row_class;
        outgoingMsg_message_content.appendChild(outgoingMsg_message_content_row);

        outgoingMsg_message_content_row_column_key = document.createElement('div');
        outgoingMsg_message_content_row_column_key.id = `outgoingMsg-message-content-row-${i}-column-key`;
        outgoingMsg_message_content_row_column_key.className = `outgoingMsg-message-content-row-column-key`;
        document.getElementById(outgoingMsg_message_content_row.id).appendChild(outgoingMsg_message_content_row_column_key);
        document.getElementById(outgoingMsg_message_content_row_column_key.id).textContent = keysArr[i];

        outgoingMsg_message_content_row_column_value = document.createElement('div');
        outgoingMsg_message_content_row_column_value.id = `${outgoingMsg_message_content_row_column_value_id}-${i}-column-value`;
        outgoingMsg_message_content_row_column_value.className = `${outgoingMsg_message_content_row_column_value_id}-row-column-value`;
        document.getElementById(outgoingMsg_message_content_row.id).appendChild(outgoingMsg_message_content_row_column_value);
        document.getElementById(outgoingMsg_message_content_row_column_value.id).textContent = updatedData.outgoingMsg.message[keysArr[i]];
        
        console.log('Message added');
    }
}

// clears the div element
function clearDiv(div) {
    while(div.firstChild) {
        div.removeChild(div.firstChild);
    }
}

// takes an existing 'div' as element and gives it an id, a class and some text if provided and attaches to the parent container
function createDivWithIdClassText(element, string, parent, text) {
    //element = document.createElement('div');
    element.id = string;
    element.className = string;
    parent.appendChild(element);
    element.textContent = text;
    //console.log(element);
}

function createDivWithIdClassTextNode(ID, CLASS, parent, text) {
    let node = document.createElement('div');
    node.id = ID;
    node.className = CLASS;
    let text_node = document.createElement('p');
    text_node.textContent = text;
    node.appendChild(text_node);
    parent.appendChild(node);
}

// creates the header row and the first element of the second row on either 'mqtt-incoming' or 'mqtt-outgoing', which can be defined in the flag option as either 'incoming' or 'outgoing'
function createHeaderRowAndTopicColumn(updatedData, flag) {
    if (flag === 'incoming') {
        // Create header row
    createDivWithIdClassText(incomingMsg_topic_title, incomingMsg_topic_title_string, incomingMsg_topic, 'Topic');
    createDivWithIdClassText(incomingMsg_message_title, incomingMsg_message_title_string, incomingMsg_message, 'Message')
    
    // Create info rows
    createDivWithIdClassText(incomingMsg_topic_content, incomingMsg_topic_content_string, incomingMsg_topic, updatedData.incomingMsg.topic)
    createDivWithIdClassText(incomingMsg_message_content, incomingMsg_message_content_string, incomingMsg_message, '');
    } else if (flag === 'outgoing') {
        // Create header row
    createDivWithIdClassText(outgoingMsg_topic_title, outgoingMsg_topic_title_string, outgoingMsg_topic, 'Topic');
    createDivWithIdClassText(outgoingMsg_message_title, outgoingMsg_message_title_string, outgoingMsg_message, 'Message')
    
    // Create info rows
    createDivWithIdClassText(outgoingMsg_topic_content, outgoingMsg_topic_content_string, outgoingMsg_topic, updatedData.outgoingMsg.topic)
    createDivWithIdClassText(outgoingMsg_message_content, outgoingMsg_message_content_string, outgoingMsg_message, '');
    }
}

// fetches data in a set interval from the backend for mqtt-incoming and mqtt-outgoing. Interval can be changed. any new message will retrigger this function
function fetchDataAndUpdate() {
    fetch('/api/data_test/data')
        .then(response => response.json())
        .then(updatedData => {
            console.log(updatedData)
            
            createMouseoverAndMouseoutEventListener(db_icon, updatedData.server_status.service_status_db, 'Database')
            createMouseoverAndMouseoutEventListener(mqtt_icon, updatedData.server_status.service_status_mqtt, 'Mosquitto')
            if (updatedData.server_status.service_status_db) {
                db_icon.style.fill = 'green';
            } else {
                db_icon.style.fill = 'grey';
            }
            
            if (updatedData.server_status.service_status_mqtt) {
                mqtt_icon.style.fill = 'green';
            } else {
                mqtt_icon.style.fill = 'red';
            }
             
            mqtt_incoming_id = document.getElementById('mqtt-incoming-id');
            //// INCOMING MESSAGES ////
            if (Object.keys(updatedData.test.incomingMsg).length === 0) {
                clearDiv(mqtt_incoming_id);
                
                
                if (empty_body_div == null) {
                    console.log(`creating "${empty_body_string}"`);

                    createDivWithIdClassTextNode(empty_body_string, empty_body_string, mqtt_incoming_id, 'No messages yet');
                }
                
            } else {
                console.log(`empty_body_div is: ${empty_body_div}`);
                if (document.getElementById(empty_body_string) != null) {
                    document.getElementById(empty_body_string).remove();
                    console.log('removed "empty-incoming-msg-body"!');
                }
                
                console.log(incomingMsg_topic);
                if (isSettingUpIncoming) {
                    // Creating divs for the json values from backend
                    console.log('creating ', incomingMsg_topic_string);
                    createDivWithIdClassText(incomingMsg_topic, incomingMsg_topic_string, mqtt_incoming_id, '');

                    console.log('creating ', incomingMsg_message_string);
                    createDivWithIdClassText(incomingMsg_message, incomingMsg_message_string, mqtt_incoming_id, '');

                    console.log('creating header columns');
                    createHeaderRowAndTopicColumn(updatedData.test, 'incoming');

                    const keysArr = Object.getOwnPropertyNames(updatedData.test.incomingMsg.message);
                    // Create row with info from json
                    if(updatedData.test.incomingMsg.topic === 'weather/data') {
                        // Creating the inner div layout for the message property of the json
                        createMsgForWeatherData(updatedData, keysArr);                          
                    
                    } else if (updatedData.test.incomingMsg.topic === 'device/client_ip') { // to be updated!
                        incomingMsg_message_content_row = document.createElement('div');
                        incomingMsg_message_content_row.id = `${incomingMsg_message_content_row_id}-${0}`;
                        incomingMsg_message_content_row.className = incomingMsg_message_content_row_class;
                        incomingMsg_message_content.appendChild(incomingMsg_message_content_row);
                        incomingMsg_message_content_row.textContent = updatedData.test.incomingMsg.message;
                    }
                    
                    isSettingUpIncoming = false;
                    
                } else {
                    // Update the topic
                    incomingMsg_topic_content.textContent = updatedData.test.incomingMsg.topic;
                    // Update the Message
                    clearDiv(incomingMsg_message_content);
                    
                    const keysArr = Object.getOwnPropertyNames(updatedData.test.incomingMsg.message);
                    // Create row with info from json
                    if(updatedData.test.incomingMsg.topic === 'weather/data') {
                        // Update data in message column
                        createMsgForWeatherData(updatedData.test, keysArr);
                    } else if (updatedData.test.incomingMsg.topic === 'device/client_ip') { // to be updated!
                        incomingMsg_message_content_row = document.createElement('div');
                        incomingMsg_message_content_row.id = `${incomingMsg_message_content_row_id}-${0}`;
                        incomingMsg_message_content_row.className = incomingMsg_message_content_row_class;
                        incomingMsg_message_content.appendChild(incomingMsg_message_content_row);
                        incomingMsg_message_content_row.textContent = updatedData.test.incomingMsg.message;
                    }
                        
                }
                    
            }
            
            

            //// OUTGOING MESSAGES ////

            mqtt_outgoing_id = document.getElementById(mqtt_outoging_id_string);
            if (Object.keys(updatedData.test.outgoingMsg).length === 0) {
                clearDiv(mqtt_outgoing_id);
               
                if (empty_outgoing_body_div == null) {
                    console.log(`creating "${empty_outgoing_body_string}"`);
                    createDivWithIdClassTextNode(empty_outgoing_body_string, empty_outgoing_body_string, mqtt_outgoing_id, 'No messages yet');
                }
            } else {
                if (document.getElementById(empty_outgoing_body_string) != null) {
                    document.getElementById(empty_outgoing_body_string).remove();
                    console.log('removed "empty-outgoing-msg-body"!');
                }
                if (isSettingUpOutgoing) {
                    // Creating a table for the json values from backend
                    console.log('creating ', outgoingMsg_topic_string);
                    createDivWithIdClassText(outgoingMsg_topic, outgoingMsg_topic_string, mqtt_outgoing_id, '');

                    console.log('creating ', outgoingMsg_message_string);
                    createDivWithIdClassText(outgoingMsg_message, outgoingMsg_message_string, mqtt_outgoing_id, '');

                    console.log('creating header columns');
                    createHeaderRowAndTopicColumn(updatedData, 'outgoing');
                    const keysArr = Object.getOwnPropertyNames(updatedData.test.outgoingMsg.message);

                    //console.log('keysArr.length == ', keysArr.length);
                    // Create row with info from json
                    if(updatedData.test.outgoingMsg.topic === 'device/setup')  {
                        
                        createTableForDeviceSetup(updatedData.test, keysArr);
                        isSettingUpOutgoing = false
                    }
                } else {
                // Update the topic
                document.getElementById('outgoingMsg-topic-content').textContent = updatedData.test.outgoingMsg.topic;
                // Update the Message
                    while(document.getElementById('outgoingMsg-message-content').firstChild) {
                        document.getElementById('outgoingMsg-message-content').removeChild(document.getElementById('outgoingMsg-message-content').firstChild);
                    }
                    const keysArr = Object.getOwnPropertyNames(updatedData.test.outgoingMsg.message);
                    console.log('keysArr.length == ', keysArr.length);
                    // Create row with info from json
                    if(updatedData.test.outgoingMsg.topic === 'device/setup')  {
                        createTableForDeviceSetup(updatedData.test, keysArr);
                    }
            }
        }
    })
    
}

// fetches the topics list from the database
function grabTopicsListFromDB() {
    fetch('/api/data_test/topics')
        .then(response => response.json())
        .then(dataFromBackend => {
            console.log(dataFromBackend);
            // Creating the rows for the table
            mqtt_topics = document.getElementById(mqtt_topics_id_string);
            //console.log(mqtt_topics)

            createDivWithIdClassText(topics_header, topics_header_string, mqtt_topics, '');

            createDivWithIdClassText(topics_topic, topics_topic_string, topics_header, 'Topics');
            createDivWithIdClassText(topics_subscribe, topics_subscribe_string, topics_header, 'Subscribe');
            createDivWithIdClassText(topics_publish, topics_publish_string, topics_header, 'Publish');
            //createRowsForTableWithParams(dataFromBackend, 'topic-table', 'topic', 1, nodeArrTopics_incoming);
            // Setting the Headers for the columns
            
            createDivWithIdClassText(topics_data, topics_data_string, mqtt_topics, '');
            createDivWithIdClassText(topics_data_topic_column, topics_data_topic_column_string, topics_data, '');

            createDivWithIdClassText(topics_data_subscribe_column, topics_data_subscribe_column_string, topics_data, '');

            createDivWithIdClassText(topics_data_publish_column, topics_data_publish_column_string, topics_data, '');

            for (let i = 0; i < Object.getOwnPropertyNames(dataFromBackend).length; i++) {
                // topics column
                createDivWithIdClassTextNode(`topics-data-topic-column-row-${i}`, 'topics-data-topic-column-rows', topics_data_topic_column, dataFromBackend[i].topic);
                
                // subscribe column
                createDivWithIdClassTextNode(`topics-data-subscribe-column-row-${i}`, 'topics-data-subscribe-column-rows', topics_data_subscribe_column, dataFromBackend[i].subscribe);
                
                // publish column
                createDivWithIdClassTextNode(`topics-data-publish-column-row-${i}`, 'topics-data-publish-column-rows', topics_data_publish_column, dataFromBackend[i].publish);
        }
    })
}

// fetches the devices list from the database
function grabDeviceListFromDB() {
    fetch('/api/data_test/devices')
        .then(response => response.json())
        .then(dataFromBackend => {
           // Create header row
            createDivWithIdClassText(devices_header, devices_header_string, device_bar, '');
            createDivWithIdClassText(devices_clientID, devices_clientID_string, devices_header, 'Client ID');
            createDivWithIdClassText(devices_deviceID, devices_deviceID_string, devices_header, 'Device ID');


            // Create Data rows
            createDivWithIdClassText(devices_data, devices_data_string, device_bar, '');
            createDivWithIdClassText(devices_data_clientID, devices_data_clientID_string, devices_data, '');
            createDivWithIdClassText(devices_data_deviceID, devices_data_deviceID_string, devices_data, '');

            for (let i = 0; i < Object.getOwnPropertyNames(dataFromBackend).length; i++) {
                // client id column
                createDivWithIdClassTextNode(`devices-data-clientID-column-row-${i}`, 'devices-data-clientID-column-rows', devices_data_clientID, dataFromBackend[i].client_id);
                
                // device id column
                createDivWithIdClassTextNode(`devices-data-deviceID-column-row-${i}`, 'devices-data-deviceID-column-rows', devices_data_deviceID, dataFromBackend[i].device_id);  
            } 
        })
}

function grabDataForCharts() {
    fetch('/api/data_test/chart_data', {
        method: 'POST',
        body: JSON.stringify({
            title: 'Hello World',
            body: 'My POST request',
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
        .then(response => response.json())
        .then(dataFromBackend => {
            console.log(dataFromBackend);
        })
}

function grabWeatherDataForCharts(temp_chart) {
    if (isSettingUpDefaultChart) {
        fetch('/api/data_test/chart_data/defaultSettings')
            .then(response => response.json())
            .then(dataFromBackend => {

                const asArray = Object.entries(dataFromBackend.resultDone)
                
                //// Create variable names for the obj
                dataFromBackend.deviceArray.forEach(deviceID => {
                    //console.log(deviceID);
                    const deviceObj = new DeviceArray(deviceID);
                    deviceObjArr.push(deviceObj);
                });

                var counter = 0;                
                //// Getting each device object one by one
                deviceObjArr.forEach(device => {

                    //// Filtering out data from the backend to get only data for specific device
                    const device_data = asArray.filter(entry => entry[1].device_id === device.deviceID);

                    /// pushing data in object format to prepared arrays for the charts
                    device_data.forEach(data => {
                        device.tempArray.push({x: data[1].date, y: data[1].temperature});
                        device.humArray.push({x: data[1].date, y: data[1].humidity})
                    });

                    temperatureDataFromDB.push({
                        label: `Device ${device.deviceID}`, 
                        values: device.tempArray, 
                        fill: false, 
                        borderColor: color_pallette[counter], 
                        tension: 0.1
                    });

                    counter += 1;
                })

                //const temp_chart = drawTemperatureChart();

                console.log(temperatureDataFromDB);
                const temperatureDatasets = temperatureDataFromDB.map((data) => {
                    //console.log(data.values);
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

                //console.log(temp_chart.data.datasets);
                //temp_chart.data.datasets = temperatureDatasets;
                //hum_chart.data.datasets = humDatasets;

                //temp_chart.update();
                //hum_chart.update();
                
                isSettingUpDefaultChart = false;
            })
    }
}

function drawTemperatureChart() {
    const temp_chart = new Chart(ctx_temp, {
        type: 'line',
        data: {
            /*
            labels: [   '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
                        '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '24:00'],*/
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
                        source: 'datasets'
                    }
                },
                y: {
                }
            }
        }
    });
    return temp_chart;
}