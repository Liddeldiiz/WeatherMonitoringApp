const fs = require('fs');

var data;

const displayDashboard = (req, res) => {
    //console.log('Current directory: ', __dirname);
    //console.log("inside while loop");
    fs.readFile(`${__dirname}/../Frontend/Views/Dashboard.html`, 'utf-8', (err, data) => {
        if (err) return console.log("Error: ", err); 
        res.send(data);
        res.end();
    })
}

module.exports = {
    displayDashboard
}