require('dotenv').config();
const express = require('express');
const fs = require('fs') // this engine requires the fs module
const app = express();
const cors = require('cors');
const {morgan, winstonLogger} = require('./Logger/loggers.js');
const api = require('./Routes/routes.js');

const port =  process.env.PORT ;
const host = process.env.HOST ;
const scheme = process.env.SCHEME ;

app.use(cors()) ;
app.use(morgan('dev')) ;
const myStream = {
  write: (text) => {
    winstonLogger.info(text)
  }
};
app.use(morgan('combined', { stream: myStream }));
// setup the logger
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
app.engine('ntl', (filePath, options, callback) => { // define a template engine to update the form submit to the correct host 
  fs.readFile(filePath, (err, content) => {
    if (err) { 
      winstonLogger.log('error', JSON.stringify(err));
      return callback(err);
    }
    // this is an extremely simple template engine
    let rendered = content.toString()
                    .replace('#scheme#', scheme)
                    .replace('#host#', host)
                    .replace('#port#', port)
    return callback(null, rendered);
  });
});
app.set('views', './Views') // specify the views directory
app.set('view engine', 'ntl') // register the template engine
app.use(api);
//start the app server on defined port 
app.listen(port, host, () => {
  
    winstonLogger.log('info' , 'enzovault app is running at ' + scheme +  host + port);
    console.log('enzovault app is running at %s://%s:%s', scheme, host, port);
});
