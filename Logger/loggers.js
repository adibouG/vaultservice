
const morgan  = require('morgan');
const winston = require('winston');
const path = require('path');

let winstonLogger = winston.createLogger({
    transports: [
      new (winston.transports.Console)(),
      new (winston.transports.File)({ filename: path.join( process.cwd() ,  'LogFiles/enzoVault.log') })
    ]
  });


  
  module.exports = {
        morgan,
        winstonLogger
  } ;