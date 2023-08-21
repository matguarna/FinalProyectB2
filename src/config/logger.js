const winston = require("winston");
require("dotenv").config();

//Configuracion de logger con los niveles predeterminados de la libreria
// const logger = winston.createLogger({
//   transports: [
//     new winston.transports.Console({ level: "http" }), //http es el nivel a partir del cual genera logs
//     new winston.transports.File({ filename: "./errors.log", level: "warn" }),
//   ],
// });

//Configuracion de niveles customizados
const customLevelOptions = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: "red",
    error: "red",
    warning: "yellow",
    info: "blue",
    debug: "white",
  },
};

const logger = winston.createLogger({
  levels: customLevelOptions.levels,
  transports: [
    new winston.transports.Console({
      level: "info",
      format: winston.format.combine(winston.format.colorize({ colors: customLevelOptions.colors }), winston.format.simple()),
    }),
    new winston.transports.File({
      filename: "./errors.log",
      level: "warning",
      format: winston.format.simple(),
    }),
  ],
});

const loggerTest = winston.createLogger({
  levels: customLevelOptions.levels,
  transports: [
    new winston.transports.Console({
      level: process.env.LOGGER_LEVEL,
      format: winston.format.combine(winston.format.colorize({ colors: customLevelOptions.colors }), winston.format.simple()),
    }),
  ],
});

//middleware
const addLogger = (req, res, next) => {
  req.logger = loggerTest;
  req.logger.info(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`);
  next();
};

module.exports = {
  logger,
  addLogger,
};
