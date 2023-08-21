const cluster = require("cluster");
const { cpus } = require("os");
const { initServer } = require("./src/server");
const { logger } = require("./src/config/logger");

// logger.info(cluster.isPrimary);
const numerodeProcesadores = cpus().length;
logger.info(`Cantidad de hilos en ejecución: ${numerodeProcesadores}`);
// console.log(cpus());

// if (cluster.isPrimary) {
//   logger.info("Proceso primario generando proceso trabajador");
//   for (let i = 0; i < numerodeProcesadores; i++) {
//     cluster.fork();
//   }
//   cluster.on("message", (worker) => {
//     logger.info(`El worker ${worker.process.id} dice: ${worker.message}`);
//   });
// } else {
//   logger.info("Soy un proceso forkeado (worker), no soy proceso primario (false)");
//   initServer();
// }

initServer();
