require('dotenv').config({ path: '/.env' })
const express = require('express');
const app = express();

const cors = require('cors');

const {morgan , winstonLogger} = require('./Logger/loggers.js');
const api = require('./Routes/routes.js');

const port =  process.env.PORT || 3002 ;

app.use(cors()) ;

app.use(morgan('dev')) ;

app.use((req, res, next) => { 
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST, PUT, GET , DELETE , OPTIONS"); 
    res.header("Access-Control-Allow-Headers", "Origin , X-Requested-With, Content , Content-Type, Accept, Authorization"); 
    req.setTimeout(0); 
    next();
   });
   
   
app.use(express.json()) ;// for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static('public')); //to serve the form located in public/index.html

app.use(api);

//start the app server on defined port 
app.listen(port , () => {

    console.log('app is listening on port %s' , port);

});
