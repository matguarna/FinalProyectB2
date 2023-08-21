const { Router } = require("express");
const { passportCall } = require("../passport-jwt/passportCall");
const { authorization } = require("../passport-jwt/authorizationJwtRole");

const viewsRouter = Router();

viewsRouter.get("/login", (req, res) => {
  res.render("login", {
    style: "index.css",
  });
});

viewsRouter.get("/register", (req, res) => {
  res.render("registerForm", {
    style: "index.css",
  });
});

viewsRouter.post("/register", (req, res) => {
  //Mismos nombres que los input
  //const { name, email, password } = req.body;
  const user = req.body;
  res.send({
    user,
    mensaje: "Registrado con éxito",
  });
});

//agregar producto
viewsRouter.get("/addproduct", (req, res) => {
  res.render("addProduct");
});

viewsRouter.post("/addproduct", (req, res) => {
  //Mismos nombres que los input
  //const { name, email, password } = req.body;
  res.send({
    mensaje: "Agregado con éxito",
  });
});

//Eliminar producto
viewsRouter.get("/deleteproduct", (req, res) => {
  // let { pid } = req.body;
  console.log("ASD1");
  res.render("deleteProduct");
});

viewsRouter.delete("/deleteproduct", (req, res) => {
  //Mismos nombres que los input
  //const { name, email, password } = req.body;
  let { pid } = req.body;
  console.log("ASD2");
  res.send({
    mensaje: "Eliminado con éxito",
  });
});

//RUTA Y DATOS PARA HANDLEBARS_____________________________
const usersArray = [
  {
    name: "Juan",
    lastname: "Gonzalez",
    edad: 25,
    mail: "jgonz@gmail.com",
    telefono: "123-123-1",
  },
  {
    name: "Pedro",
    lastname: "Falopa",
    edad: 31,
    mail: "pfalopa@gmail.com",
    telefono: "784-213-6",
    role: "admin",
  },
  {
    name: "Francisco",
    lastname: "Narvo",
    edad: 19,
    mail: "fnarvo@gmail.com",
    telefono: "146-733-1",
    role: "user",
  },
  {
    name: "Susana",
    lastname: "Ortiz",
    edad: 28,
    mail: "sortiz@gmail.com",
    telefono: "145-465-2",
    role: "admin",
  },
];

let food = [
  {
    name: "Hamburguesa",
    price: 750,
  },
  {
    name: "Coca feca",
    price: 1000,
  },
  {
    name: "Papitas",
    price: 500,
  },
];

//Defino una ruta
viewsRouter.get("/", (req, res) => {
  //Elegir un user random
  let userhbs = usersArray[Math.floor(Math.random() * usersArray.length)];
  let testUser2 = {
    title: "E-commerce",
    userhbs,
    isAdmin: userhbs.role == "admin",
    food,
    style: "index.css",
  };

  //Brindamos los datos a renderizar
  // let testUser = {
  //   name: "Matias",
  //   lastname: "Guarna",
  //   title: "E-commerce",
  // };

  res.render("index.handlebars", testUser2);
});

viewsRouter.get("/chat", passportCall("jwt"), authorization("usuario"), async (req, res) => {
  console.log("Chat req.user : ", req.user);
  res.render("chat.handlebars", { status: "success", payload: req.user });
});

module.exports = viewsRouter;
