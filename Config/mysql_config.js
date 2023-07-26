const mysql = require('mysql');

const dotenv = require('dotenv');
dotenv.config();

const connectToDB = () => {
    try {
        console.log('trying to connect...')
        const mysqlClient = mysql.createConnection({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD_2,
            database: process.env.MYSQL_DATABASE
        })
        
        //setServiceStatusDB(true);
        //rerenderDashboard(res);
        return mysqlClient;
    } catch (err) {
        console.log('connection failed: ', err);
        //setServiceStatusDB(false);
        //setTimeout(connectToDB, 5000);
    }
}

///////////////////////////////////////////////////////////////// NOT USED ///////////////////////////////////////////////////////////////// 

const connectToDBPromise = () => {
    return new Promise((resolve, reject) => {
        try {
            console.log('trying to connect...')
            const mysqlClient = mysql.createConnection({
                host: process.env.MYSQL_HOST,
                user: process.env.MYSQL_USER,
                password: process.env.MYSQL_PASSWORD_2,
                database: process.env.MYSQL_DATABASE
            })
            
            resolve(mysqlClient)
        } catch (err) {
            console.log('connection failed: ', err);
            reject(err);
        }
    })
}


const runDBConfig = async () => {
    const connectToDBPromise = connectToDBPromise();
    const mySQLClient = await connectToDBPromise;

    mySQLClient.connect((err) => {
        if (err) {
            console.error('Error connecting to MySQL server: ', err);
            delay(5000, () => {
                runDBConfig();
            })
            
        } else {
            console.log('MySQL Client connected')
        }
        
    })

    mySQLClient.on('error', (err) => {
        if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNREFUSED') {
            console.error('MySQL connection lost. Reconnecting...');
            delay(5000, () => {
                runDBConfig();
            })
        }
    })
    
    return mySQLClient;
}

module.exports = {
    runDBConfig,
    connectToDB
};

