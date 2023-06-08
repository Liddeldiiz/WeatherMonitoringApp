const express = require('express');
const app = express();

const { setup_devices } = require('./Init/setup');

const router_esp = require('./Routes/esp') ;
const router_workers = require('./Routes/workers');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(router_esp);
app.use(router_workers);

setup_devices();

app.get('/', (req, res) => {
    console.log('User hit index resource')
    res.status(200).send("Index Page")
    res.end()
});

app.listen(5000, () => {
    console.log('Server is listening on port 5000')
    
});