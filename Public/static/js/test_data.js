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

const db_icon = document.getElementById('svg-db');
const mqtt_icon = document.getElementById('svg-mqtt');

const mqtt_incoming_id_string = 'mqtt-incoming-id';
var mqtt_incoming_id = document.createElement('div');

const mqtt_outoging_id_string = 'mqtt-outgoing-id';
var mqtt_outgoing_id = document.createElement('div');

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
            
            createMouseoverAndMouseoutEventListener(db_icon, updatedData.service_status_db, 'Database')
            createMouseoverAndMouseoutEventListener(mqtt_icon, updatedData.service_status_mqtt, 'Mosquitto')
            if (updatedData.service_status_db) {
                db_icon.style.fill = 'green';
            } else {
                db_icon.style.fill = 'grey';
            }
            
            if (updatedData.service_status_mqtt) {
                mqtt_icon.style.fill = 'green';
            } else {
                mqtt_icon.style.fill = 'red';
            }
             
            mqtt_incoming_id = document.getElementById('mqtt-incoming-id');
            //// INCOMING MESSAGES ////
            if (Object.keys(updatedData.incomingMsg).length === 0) {
                clearDiv(mqtt_incoming_id);
                
                
                if (empty_body_div == null) {
                    console.log(`creating "${empty_body_string}"`);
                    let node = document.createElement('p');
                    let text_node = document.createTextNode('No messages yet');
                    node.appendChild(text_node);
                    node.id = empty_body_string;
                    node.className = empty_body_string;
                    mqtt_incoming_id.appendChild(node);
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
                    createHeaderRowAndTopicColumn(updatedData, 'incoming');

                    const keysArr = Object.getOwnPropertyNames(updatedData.incomingMsg.message);
                    // Create row with info from json
                    if(updatedData.incomingMsg.topic === 'weather/data') {
                        // Creating the inner div layout for the message property of the json
                        createMsgForWeatherData(updatedData, keysArr);                          
                    
                    } else if (updatedData.incomingMsg.topic === 'device/client_ip') {
                        incomingMsg_message_content_row = document.createElement('div');
                        incomingMsg_message_content_row.id = `${incomingMsg_message_content_row_id}-${0}`;
                        incomingMsg_message_content_row.className = incomingMsg_message_content_row_class;
                        incomingMsg_message_content.appendChild(incomingMsg_message_content_row);
                        incomingMsg_message_content_row.textContent = updatedData.incomingMsg.message;
                    }
                    
                    isSettingUpIncoming = false;
                    
                } else {
                    // Update the topic
                    incomingMsg_topic_content.textContent = updatedData.incomingMsg.topic;
                    // Update the Message
                    clearDiv(incomingMsg_message_content);
                    
                    const keysArr = Object.getOwnPropertyNames(updatedData.incomingMsg.message);
                    // Create row with info from json
                    if(updatedData.incomingMsg.topic === 'weather/data') {
                        // Update data in message column
                        createMsgForWeatherData(updatedData, keysArr);
                    } else if (updatedData.incomingMsg.topic === 'device/client_ip') {
                        incomingMsg_message_content_row = document.createElement('div');
                        incomingMsg_message_content_row.id = `${incomingMsg_message_content_row_id}-${0}`;
                        incomingMsg_message_content_row.className = incomingMsg_message_content_row_class;
                        incomingMsg_message_content.appendChild(incomingMsg_message_content_row);
                        incomingMsg_message_content_row.textContent = updatedData.incomingMsg.message;
                    }
                        
                }
                    
            }
            
            mqtt_outgoing_id = document.getElementById(mqtt_outoging_id_string);
            //// OUTGOING MESSAGES ////
            console.log('outgoingMsg length = ', Object.keys(updatedData.outgoingMsg).length)
            if (Object.keys(updatedData.outgoingMsg).length === 0) {
                clearDiv(mqtt_outgoing_id);
               
                if (empty_outgoing_body_div == null) {
                    console.log(`creating "${empty_outgoing_body_string}"`);
                    let node = document.createElement('p');
                    let text_node = document.createTextNode('No messages yet');
                    node.appendChild(text_node);
                    node.id = empty_outgoing_body_string;
                    node.className = empty_outgoing_body_string;
                    mqtt_outgoing_id.appendChild(node);
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
                    const keysArr = Object.getOwnPropertyNames(updatedData.outgoingMsg.message);

                    //console.log('keysArr.length == ', keysArr.length);
                    // Create row with info from json
                    if(updatedData.outgoingMsg.topic === 'device/setup')  {
                        
                        createTableForDeviceSetup(updatedData, keysArr);
                        isSettingUpOutgoing = false
                    }
                } else {
                // Update the topic
                document.getElementById('outgoingMsg-topic-content').textContent = updatedData.outgoingMsg.topic;
                // Update the Message
                    while(document.getElementById('outgoingMsg-message-content').firstChild) {
                        document.getElementById('outgoingMsg-message-content').removeChild(document.getElementById('outgoingMsg-message-content').firstChild);
                    }
                    const keysArr = Object.getOwnPropertyNames(updatedData.outgoingMsg.message);
                    console.log('keysArr.length == ', keysArr.length);
                    // Create row with info from json
                    if(updatedData.outgoingMsg.topic === 'device/setup')  {
                        createTableForDeviceSetup(updatedData, keysArr);
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
            // Creating the rows for the table
            createRowsForTableWithParams(dataFromBackend, 'topic-table', 'topic', 1, nodeArrTopics_incoming);
            // Setting the Headers for the columns
            createNodeWithParams('th', 'Topics', nodeArrTopics_incoming[0].id, 0);
            createNodeWithParams('th', 'Subscribe', nodeArrTopics_incoming[0].id, 0);
            createNodeWithParams('th', 'Publish', nodeArrTopics_incoming[0].id, 0);

            // Populating the table
            for(let i = 0; i < Object.getOwnPropertyNames(dataFromBackend).length; i++) {
                // Adding the first property of the json element
                createNodeWithParams('td', dataFromBackend[i].topic, nodeArrTopics_incoming[i+1].id, 0);
                // Adding the second property of the json element
                createNodeWithParams('td', dataFromBackend[i].subscribe, nodeArrTopics_incoming[i+1].id, 0);
                // Adding the third property of the json element
                createNodeWithParams('td', dataFromBackend[i].publish, nodeArrTopics_incoming[i+1].id, 0);
            }0
            
        })
}

// not used
function grabMqttMessages() {
    fetch('/api/data_test/msg')
        .then(response => response.json())
        .then(dataFromBackend => {
            console.log(dataFromBackend);
        })
}

// fetches the devices list from the database
function grabDeviceListFromDB() {
    fetch('/api/data_test/devices')
        .then(response => response.json())
        .then(dataFromBackend => {
            //const nodeArr = [];
            // If the device list is already displayed and new data needs to be added
            if (document.getElementById('device-table').rows.length != 0) {
                var table = document.getElementById('device-table');
                //console.log(table.children.length);
                var num_rows = table.rows.length - 1;
                if (num_rows < Object.getOwnPropertyNames(dataFromBackend).length) {
                    var diff = Object.getOwnPropertyNames(dataFromBackend).length - num_rows;
                    
                    createRowsForTableWithParams(Object.entries(dataFromBackend).slice(num_rows), 'device-table', 'device', 1, nodeArrDevices_incoming);
                    let counter = nodeArrDevices_incoming.length - 1;
                    for(let i = 0; i < diff; i++) {
                        // Adding the first property of the received json
                        createNodeWithParams('td', dataFromBackend[num_rows + i].client_id, nodeArrDevices_incoming[counter+i], 0);
                        // Adding the second property of the received json
                        createNodeWithParams('td', dataFromBackend[num_rows + i].device_id, nodeArrDevices_incoming[counter+i], 0);
                    }
                }
            } else {
                // Creating dynamically the number of rows needed for the table depending on the json received
                createRowsForTableWithParams(dataFromBackend, 'device-table', 'device', 1, nodeArrDevices_incoming);
                // Setting the Headers for the columns
                createNodeWithParams('th', 'Client ID', nodeArrDevices_incoming[0].id, 0);
                createNodeWithParams('th', 'Device ID', nodeArrDevices_incoming[0].id, 0); 
                                   
                for(let i = 0; i < Object.getOwnPropertyNames(dataFromBackend).length; i++) {
                    // Adding the first property of the received json
                    createNodeWithParams('td', dataFromBackend[i].client_id, nodeArrDevices_incoming[i+1].id, 0);
                    // Adding the second property of the received json
                    createNodeWithParams('td', dataFromBackend[i].device_id, nodeArrDevices_incoming[i+1].id, 0);
                }
            }
        })
}
