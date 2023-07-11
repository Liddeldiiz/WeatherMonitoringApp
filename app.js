const express = require('express');
const app = express();
const path = require('path');

const { setup } = require('./Backend/Init/setup_async');
const { setup_experiment } = require('./Backend/Init/setup_experiment');

const router_esp = require('./Backend/Routes/esp') ;
const router_workers = require('./Backend/Routes/workers');
const router_dom = require('./Backend/Routes/dashboard');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('Public'));

app.set('Views', path.join(__dirname, 'Public/Views'));
app.set('view engine', 'ejs');


app.use(router_esp);
app.use(router_workers);
app.use(router_dom);

setup();
//setup_experiment();
/*
app.get('/', (req, res) => {
    console.log('User hit index resource')
    res.status(200).send("Index Page")
    res.end()
});*/

app.listen(5000, () => {
    console.log('Server is listening on port 5000')
    
});

//