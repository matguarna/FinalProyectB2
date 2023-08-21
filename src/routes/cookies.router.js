const { Router } = require("express");

const cookiesRouter = Router();

//Cookies_____________ Datos que se guardan del lado del cliente
cookiesRouter.get("/", (req, res) => {
  res.render("cookies", {});
});

//Seteo de la cookie
cookiesRouter.get("/setcookie", (req, res) => {
  //Da nombre de la cookie y valor. maxAge es el tiempo de vida en milisegundos
  res.cookie("CookiePiola", "Esta es una cookie piola", { maxAge: 1000000 }).send("Cookie seteada");
});

//Lee las cookies
cookiesRouter.get("/getcookie", (req, res) => {
  res.send(req.cookies);
});

//Borra una cookie
cookiesRouter.get("/deletecookie", (req, res) => {
  //Se da el nombre de la cookie a borrar
  res.clearCookie("CookiePiola").send("Cookie borrada");
});

//Firma cookie para agregar seguridad. Desde app.use(cookieParser)
cookiesRouter.get("/setcookiefirmada", (req, res) => {
  //con signed: true se firma la cookie
  res.cookie("CookieFirmada", "Esta es una cookie firmada", { maxAge: 1000000, signed: true }).send("Cookie firmada");
});

//Lee las cookies firmadas
cookiesRouter.get("/getcookiefirmada", (req, res) => {
  res.send(req.signedCookies);
});

//Seteo de cookie de user firmada
cookiesRouter.post("/setcookieuser", (req, res) => {
  const { username, email } = req.body;
  res.cookie(username, email, { maxAge: 1000000, signed: true }).send({ mensaje: "Cookie user seteada" });
});

module.exports = cookiesRouter;
