const express = require('express');
const app = express();

const dotenv = require('dotenv');
dotenv.config()

const mqtt = require('mqtt')
var client; 

const router_esp = require('./Routes/esp') 

const _topic = '/'

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(router_esp)

app.get('/', (req, res) => {
    console.log('User hit index resource')
    res.status(200).send("Index Page")
    res.end()
})
/*
app.post('/api/publish/esp', (req, res) => {
    publishToTopic(req, res)
})  

app.get('/api/subscribe/esp', (req, res) => {
    //const topic = `/${req.params.topic}` // accessing the :topic element
    subscribeToTopic(req, res)
})*/

app.listen(5000, () => {
    console.log('Server is listening on port 5000')
    
})