const express = require('express');
const app = express();

const router_esp = require('./Routes/esp') 

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(router_esp)

app.get('/', (req, res) => {
    console.log('User hit index resource')
    res.status(200).send("Index Page")
    res.end()
})

app.listen(5000, () => {
    console.log('Server is listening on port 5000')
    
})