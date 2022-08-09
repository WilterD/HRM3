const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

const db = require('./Config/DatabaseConfig');
const etl = require('./Helpers/ETL');
const app = express();


const cors = require('cors');

app.use(cors());

// settings
app.set('port', process.env.PORT || 3000);

//GoogleApis Auth

const KEYFILEPATH = 'credentials.json';
const SCOPES = ['https://www.googleapis.com/auth/drive',
                'https://www.googleapis.com/auth/spreadsheets'];

const auth = new google.auth.GoogleAuth({
    keyFile: KEYFILEPATH,
    scopes: SCOPES
});

// middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// routes
app.use('/workers', require('./Routes/Worker'));
app.use('/salaryChanges', require('./Routes/SalaryChange'));
app.use('/workRestLeave', require('./Routes/WorkRestLeave'));
app.use('/workRestLeaveContinuos', require('./Routes/WorkRestLeaveContinuos'));
app.use('/workerRelative', require('./Routes/WorkerRelative'));
app.use('/retiredWorker', require('./Routes/RetiredWorkers'));
app.use('/newWorker', require('./Routes/NewWorker'));
app.use('/stadistics', require('./Routes/Statistics'));
app.use('/users', require('./Routes/users'));
app.use('/notification', require('./Routes/notifications'));


// starting the server
app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
    etl.insertDataInDatabaseFromSpreedsheets(auth);
});