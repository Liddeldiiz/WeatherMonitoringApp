const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config();

const connectToDB = () => {
    return new Promise((resolve, reject) => {
        try {
            const mysqlClient = mysql.createConnection({
                host: process.env.MYSQL_HOST,
                user: process.env.MYSQL_USER,
                password: process.env.MYSQL_PASSWORD_2,
                database: process.env.MYSQL_DATABASE
            })
            console.log('MySQL Client connected')
            resolve(mysqlClient)
        } catch (err) {
            reject(err);
        }
    })
}

const runDBConfig = async () => {
    const connectToDBPromise = connectToDB();
    const mySQLClient = await connectToDBPromise;

    //console.log(`db_status: ${db_status}`);
    mySQLClient.connect((err) => {
        if (err) throw err;
        console.log('MySQL Client connected!');
        
        //console.log(`db_status: ${db_status}`);
        return mySQLClient;
    })
    
    
}

module.exports = {
    runDBConfig,
    connectToDB
};

