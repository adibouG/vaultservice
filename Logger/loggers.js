const morgan  = require('morgan');
const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

const { splat, combine, timestamp, printf } = winston.format;
const myFormat = printf(({ timestamp, level, message }) => (level, `${timestamp}::${level}::${message}`));
const winstonLogger = winston.createLogger({
  
        level:'debug',
        format: combine(
          timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          splat(),
          myFormat
        ),
        transports: [
          new DailyRotateFile({
            filename: `EnzoVault-${process.env.HOST}-%DATE%.log`,
            dirname:  process.env.LOG_DIR || `${process.cwd()}/LogFiles`,
            level: process.env.LOGGER_LEVEL || 'raw' ,
            handleExceptions: true,
            colorize: true,
            json: false,
            zippedArchive: true,
            maxFiles: '100d'
          })
        ]
  });

  module.exports = {
        morgan,
        winstonLogger
  } 