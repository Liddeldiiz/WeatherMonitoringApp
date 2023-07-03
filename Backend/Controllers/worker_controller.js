const { Worker } = require('worker_threads');

///////////// SUBSCRIBING TO TOPIC /////////////
const deployWorkerSubscribe = (req, res, topic) => {
    const { subscribe } = req.body.data;
    const { topics } = req.body.data;
    
    for (i in topics) {
        const worker = new Worker('./Workers/worker.js', { workerData: topics[i] });
        
        worker.on('message', (data) => {
            console.log(`data from worker: ${worker.threadId}`)
            console.log(data);
        })

        worker.on('error', (err) => {
            res.status(500)
            console.log(`An error has occured: ${err}`)
        })


    }
    
}

module.exports = {
    deployWorkerSubscribe
}