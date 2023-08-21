const { Router } = require("express");
const { fork } = require("child_process"); //Importamos fork de child process
const { sendMail } = require("../utils/sendmail");
const { sendSms, sendWhatsapp } = require("../utils/sendsms");
const { generateUser } = require("../utils/generateUserFaker");
const compression = require("express-compression"); //Imp compression
const { faker } = require("@faker-js/faker");

const pruebasRouter = Router();

//GZIP
// pruebasRouter.use(compression());

//Brotli
pruebasRouter.use(
  compression({
    brotli: {
      enabled: true,
      zlib: {},
    },
  })
);

//prueba GZIP-Brotli
pruebasRouter.get("/stringmuylargo", (req, res) => {
  let string = `Hola pruebita`;
  for (let i = 0; i <= 5e4; i++) {
    string += `Hola pruebita, soy un string larguisimo `;
  }
  res.send(string);
});

//Logger
pruebasRouter.get("/logger", (req, res) => {
  // console.log(req.logger);
  req.logger.info("info");
  req.logger.warning("warning");
  req.logger.error("error");
  res.send({ message: "Prueba de logger" });
});

pruebasRouter.get("/loggerTest", (req, res) => {
  // console.log(req.logger);
  req.logger.fatal("fatal");
  req.logger.error("error");
  req.logger.warning("warning");
  req.logger.info("info");
  req.logger.http("http");
  req.logger.debug("debug");
  res.send({ message: "Prueba de loggerTest" });
});

//Artillery
pruebasRouter.get("/simple", (req, res) => {
  let suma = 0;
  for (let i = 0; i < 1000000; i++) {
    suma += i;
  }
  res.send({ status: "success", message: `El worker ${process.id} ha atendido esta peticion. Resultado: ${suma}` });
});

//artillery quick --count 40 --num 50 "http://localhost:8080/pruebas/simple" -o simple.json

pruebasRouter.get("/compleja", (req, res) => {
  let suma = 0;
  for (let i = 0; i < 5e8; i++) {
    suma += i;
  }
  res.send({ status: "success", message: `El worker ${process.id} ha atendido esta peticion. Resultado: ${suma}` });
});

pruebasRouter.get("/testuser", (req, res) => {
  let persona = {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };

  res.send({ status: "success", payload: persona });
});

//Faker
pruebasRouter.get("/mocks", (req, res) => {
  let users = [];
  for (let i = 0; i < 10; i++) {
    users.push(generateUser());
  }
  res.send({ status: "success", payload: users });
});

//Pruebas de mail
pruebasRouter.get("/mail", async (req, res) => {
  //console.log(__dirname);
  let destino = "gedesaurio@gmail.com";
  let asunto = "Mail de prueba";
  let html = `<div>
  <h1>Esto es un mail test</h1>
  </div>`;
  let result = await sendMail(destino, asunto, html);
  res.send("Email enviado");
});

//Prueba de sms
pruebasRouter.get("/sms", async (req, res) => {
  await sendSms();
  res.send("Sms enviado");
});

//Prueba de wasap
pruebasRouter.get("/wsp", async (req, res) => {
  await sendWhatsapp();
  res.send("Whatsapp enviado");
});

//Pruebas de peticion bloqueante / no bloqueante
function operacionCompleja() {
  let result = 0;
  for (let i = 0; i < 9e9; i++) {
    result += i;
  }
  return result;
}

pruebasRouter.get("/sumablock", (req, res) => {
  //funcion en /utils
  const result = operacionCompleja();
  res.send(`El resultado de la op es: ${result}`);
});

//Ejecuta el resultado de la funcion operacionCompleja() sin bloquear las demas peticiones. Desde utils/operacioncompleja escucha al process.on("message")
pruebasRouter.get("/sumanoblock", (req, res) => {
  const child = fork("./src/utils/operacioncompleja"); //crea un Proceso hijo
  child.send("Inicia el proceso de calculo"); //Envia mensaje al process.on de operacioncompleja.js
  child.on("message", (result) => {
    res.send(`El resultado de la op es: ${result}`);
  }); //captura el resultado del proceso padre
});

//Pruebas de middleware con palabra
const nombres = ["fede", "juan", "pedro"];
//middleware con palabra
pruebasRouter.param("nombre", (req, res, next, nombre) => {
  if (!nombres.includes(nombre)) {
    req.nombre = null;
    res.send("No existe el parametro");
  } else {
    req.nombre = nombre;
  }
  next();
});

//minusculas y mayusculas = ([a-zA-Z]+)
//á = %C3%A1
//é = %C3%A9
//í = %C3%AD
//ó = %C3%B3
//ú = %C3%BA
//ü = %C3%BC
//0 a 9 = 0-9

//Se da por parametros las condiciones del string
pruebasRouter.get("/nombre/:palabra([a-zA-Z%C3%A1%C3%A9%C3%AD%C3%B3%C3%BA%C3%BC0-9]+)", (req, res) => {
  const { nombre } = req.nombre;
  console.log(nombre);
  res.send({
    message: req.params.nombre,
  });
});

pruebasRouter.put("/params/:nombre([a-zA-Z%C3%A1%C3%A9%C3%AD%C3%B3%C3%BA%C3%BC0-9]+)", (req, res) => {
  const { nombre } = req.nombre;
  console.log(nombre);
  res.send({
    message: req.params.nombre,
  });
});

pruebasRouter.delete("/nombre/:palabra([a-zA-Z%C3%A1%C3%A9%C3%AD%C3%B3%C3%BA%C3%BC0-9]+)", (req, res) => {
  const { nombre } = req.nombre;
  console.log(nombre);
  res.send({
    message: req.params.nombre,
  });
});

//Ruta de escape para cualquier ruta que no exista
pruebasRouter.get("*", async (req, res) => {
  res.status(404).send("404 Not found");
});

module.exports = pruebasRouter;
