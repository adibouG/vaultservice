const morgan  = require('morgan');
const winston = require('winston');
const path = require('path');

const { splat, combine, timestamp, printf } = winston.format;
const myFormat = printf(({ timestamp, level, message }) => (level, `${timestamp}::${level}::${message}`));
const winstonLogger = winston.createLogger({
    transports: [
      new (winston.transports.Console)({ level:'debug' }),
      new (winston.transports.File)({ 
        level:'debug',
        format: combine(
          timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          splat(),
          myFormat
        ),
        filename: path.join( process.cwd(), 'LogFiles/enzoVault.log') 
      })
    ]
  });

  module.exports = {
        morgan,
        winstonLogger
  } 