const { connect } = require("mongoose");
const { logger } = require("../config/logger");
//Singleton evita que se cree mas de una instancia de conexion con la DB y solo trae la instancia conectada

class MongoSingleton {
  static #instance; //estatico y oculto
  constructor() {
    connect(process.env.MONGO_URL_TEST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
  static getInstance() {
    if (this.#instance) {
      logger.info("getInstance: Base de datos ya esta creada");
      return this.#instance;
    }
    this.#instance = new MongoSingleton();
    logger.info("Singleton: Base de datos creada");
    return this.#instance;
  }
}

module.exports = { MongoSingleton };
