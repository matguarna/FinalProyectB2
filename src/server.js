const express = require("express");
const session = require("express-session");
const FileStore = require("session-file-store");
const { create } = require("connect-mongo");
const cookieParser = require("cookie-parser");
const objectConfig = require("./config/objectConfig");
const { uploader } = require("./utils/multer");
const handlebars = require("express-handlebars");
const { Server: ServerHTTP } = require("http");
const { Server: ServerIO } = require("socket.io");
const routerApp = require("./routes/routerApp"); //Agrupador de rutas
const cookiesRouter = require("./routes/cookies.router"); //Cookies
const { initPassportGithub, initPassportLogin } = require("./config/passport.config");
const passport = require("passport");
const { initPassport } = require("./passport-jwt/passportjwt.config");
const dotenv = require("dotenv");
const cors = require("cors"); //Cors: acepta peticiones extrañas
const { addLogger, logger } = require("./config/logger");
const { socketMessage } = require("./utils/socketMessage");
const swaggerJsDocs = require("swagger-jsdoc");
const swaggerUiExpress = require("swagger-ui-express");

//dotenv_________________________________
dotenv.config();
// const { config } = dotenv;
// console.log(config());

// const io = new Server(httpServer);

//MONGOOSE : Se conecta a la DB
// objectConfig.connectDB(); //Una instancia de la db
// objectConfig.connectDB(); //Otra instancia de la db

//__________________________________________________________________
const app = express();
const serverHttp = new ServerHTTP(app);
const io = new ServerIO(serverHttp);
const PORT = process.env.PORT; //|| 8080;

serverHttp.listen(PORT, () => {
  logger.info(`Escuchando puerto ${PORT}`);
});

//Funcion exportada para iniciar desde el server desde app.js
// exports.initServer = () => {
//   serverHttp.listen(PORT, () => {
//     logger.info(`Escuchando puerto ${PORT}`);
//   });
// };

//__________________________________________________________________
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

//handlebars_______________________________________________
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

//express______________________________________________
app.use("/static", express.static(__dirname + "/public"));

//file-session-store________________ (se le suma la config de express-session)
const fileStore = FileStore(session);

//Crea una carpeta y guarda las sessiones dentro
// app.use(
//   session({
//     store: new fileStore({
//       ttl: 100000 * 60, //tiempo de vida de la sesion
//       path: __dirname + "/session", //ruta para que se guarde el archivo que se genera con las sesiones
//       retries: 0, //tiempo que va a intentar reconectarse si pasa algo
//     }),
//     secret: "palabraSecreta", //Para firmar las sesiones
//     resave: true, //Permite tener una sesion activa
//     saveUninitialized: true, //Permite guardar cualquier tipo de sesion
//   })
// );

//Session y connect-mongo_________________________
// app.use(
//   session({
//     store: create({
//       mongoUrl: process.env.MONGO_URL_TEST, //"mongodb+srv://mguarna:pikachu1@cluster0.zbnzv1a.mongodb.net/DBpruebas?retryWrites=true&w=majority", //link de la DB.
//       mongoOptions: {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//       },
//       ttl: 100000 * 10, //tiempo de vida de la sesion
//     }),
//     secret: "palabraSecreta", //Para firmar las sesiones
//     resave: false,
//     saveUninitialized: false,
//   })
// );

//express-session_______________________________
app.use(
  session({
    secret: "palabraSecreta", //Para firmar las sesiones
    resave: true, //Permite tener una sesion activa
    saveUninitialized: true, //Permite guardar cualquier tipo de sesion
  })
);

//cookieparser______________________________________________
app.use(cookieParser("3NCR1PT4D4")); //3NCR1PT4D4 = Firma de la cookie
app.use("/cookies", cookiesRouter);

//multer______________________________________________
app.post("/single", uploader.single("myFile"), (req, res) => {
  res.status(200).send({
    status: "success",
    message: "El archivo se subió correctamente",
  });
});

//socket.io____________________________________
socketMessage(io);

//passport_____________________________________
// initPassport(); //config del middleware
initPassportLogin(); //Passport del login y register. sino no funcan las estrategias
initPassportGithub();
passport.use(passport.initialize());
// passport.use(passport.session());
initPassport(); //config de passport jwt

//Swagger__________________________________________________
const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Documentacion de ecommerce",
      description: "Esta es la docu piola del ecommerce",
    },
  },
  apis: [`${__dirname}/docs/**/*.yaml`],
};

const specs = swaggerJsDocs(swaggerOptions);
app.use("/docs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

//Logger_____________________________________
app.use(addLogger);

app.use(routerApp);
