
const morgan  = require('morgan');
const winston = require('winston');
const path = require('path');

let winstonLogger = winston.createLogger({
 
    transports: [
      new (winston.transports.Console)({ level:'debug' }),
      new (winston.transports.File)({ level:'debug', filename: path.join( process.cwd() ,  'LogFiles/enzoVault.log') })
    ]
  });


  
  module.exports = {
        morgan,
        winstonLogger
  } ;