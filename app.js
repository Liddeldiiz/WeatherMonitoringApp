const express = require('express');
const app = express();
const path = require('path');

const router_dom = require('./Routes/dashboard');
const router_test = require('./Routes/test');
const router_settings = require('./Routes/settings');

const mqttController = require('./Controllers/mqtt_controller');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'Public')));

app.set('Views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(router_dom);
app.use(router_test);
app.use(router_settings);

app.use((req, res, next) => {
    if (req.url.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript');
    } 
    if (req.url.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css');
    }
    next();
})

// initiating mqtt client
mqttController.start();

app.listen(5000, () => {
    console.log('Server is listening on port 5000')
});

