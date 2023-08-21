//Archivo donde se configura mongoose
const { connect } = require("mongoose");
const dotenv = require("dotenv");
const { commander } = require("../utils/commander");
const { MongoSingleton } = require("../utils/singleton");
const { logger } = require("./logger");
const { mode } = commander.opts();
//Configuracion de dotenv
dotenv.config({
  path: mode == "development" ? "./.env.development" : "./.env.production",
});

//const mongoSingleton = new MongoSingleton()

//en la url, luego del ".net./" ponemos el nombre de la base de datos, sino crea por defecto "test"
let urlDB = process.env.MONGO_URL_TEST; //"mongodb+srv://mguarna:pikachu1@cluster0.zbnzv1a.mongodb.net/DBpruebas?retryWrites=true&w=majority"; //

module.exports = {
  persistence: process.env.PERSISTENCE,
  port: process.env.PORT,
  jwt_secret_key: process.env.JWT_SECRET_KEY, //"palabraJwtSecreta",
  gmail_user_app: process.env.GMAIL_USER_APP,
  gmail_pass_app: process.env.GMAIL_PASS_APP,
  twilio_sid: process.env.TWILIO_SID,
  twilio_auth_token: process.env.TWILIO_AUTH_TOKEN,
  twilio_phone_number: process.env.TWILIO_PHONE_NUMBER,
  my_phone_number: process.env.MY_PHONE_NUMBER,
  // connectDB: () => {
  //   connect(urlDB);
  //   console.log("Base de datos conectada");
  // },
  connectDB: async () => {
    try {
      await MongoSingleton.getInstance();
    } catch (error) {
      logger.error("connectDB Singleton ERROR", error);
    }
  },
};
