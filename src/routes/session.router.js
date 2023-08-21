const { Router } = require("express");
const auth = require("../middlewares/autenticacion.middleware");
// const { userModel } = require("../models/user.model");
// const { createHash, isValidPassword } = require("../utils/bcryptHash");
const passport = require("passport");
// const { generateToken } = require("../utils/jwt");
const { passportCall } = require("../passport-jwt/passportCall");
const { authorization } = require("../passport-jwt/authorizationJwtRole");
require("dotenv").config();

const sessionRouter = Router();
const { SessionController } = require("./controllers/session.controller");
const sessionController = new SessionController();

//Render de login
sessionRouter.get("/", sessionController.base);

//Sessiones________ Datos del cliente que se guardan del lado del servidor
sessionRouter.get("/counter", sessionController.counter);

//Login con passport
sessionRouter.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: `http://localhost:${process.env.PORT}/api/session/faillogin`,
  }),
  sessionController.login
);

//Recupero de password
sessionRouter.post("/recupass", sessionController.recupass);

//Nueva password
sessionRouter.get("/nuevapass", sessionController.nuevapass);

//Nueva password2
sessionRouter.post("/nuevapass2", sessionController.nuevapass2);

//Register con pass hasheada
sessionRouter.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: `http://localhost:${process.env.PORT}/api/session/failregister`, //En caso de fallar, va a la ruta de escape especificada
  }),
  sessionController.register
);

//Ruta de logueo fallido
sessionRouter.get("/faillogin", sessionController.faillogin);

//Ruta de registro fallido
sessionRouter.get("/failregister", sessionController.failregister);

//Login con github
sessionRouter.get("/github", passport.authenticate("github", { scope: ["user: email"] }));

sessionRouter.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: `http://localhost:${process.env.PORT}/views/login` }),
  async (req, res) => {
    req.session.user = req.user;
    res.redirect(`http://localhost:${process.env.PORT}/api/productos`);
  }
);

//Logout: Elimina datos de session
sessionRouter.get("/logout", sessionController.logout);

//Ruta privada que solo ven los admin, usando el middleware de autenticacion
sessionRouter.get("/privada", auth, (req, res) => {
  res.send("Info que solo puede ver un admin");
});

//url de prueba passport jwt. recibe la estrategia de passportCall para validar si el token viene corrupto o no viene.
//Valida el rol del usuario con "authorization", si es usuario, tiene permisos.
sessionRouter.get("/current", passportCall("jwt"), authorization("usuario"), (req, res) => {
  res.send(req.user);
});

module.exports = sessionRouter;
