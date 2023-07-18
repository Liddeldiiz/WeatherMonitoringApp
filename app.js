const express = require('express');
const app = express();
const path = require('path');

const router_esp = require('./Backend/Routes/esp') ;
const router_workers = require('./Backend/Routes/workers');
const router_dom = require('./Backend/Routes/dashboard');
const router_test = require('./Backend/Routes/test');
const router_settings = require('./Backend/Routes/settings');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'Public')));

app.set('Views', path.join(__dirname, 'Public/Views'));
app.set('view engine', 'ejs');

app.use(router_esp);
app.use(router_workers);
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

app.listen(5000, () => {
    console.log('Server is listening on port 5000')
});

