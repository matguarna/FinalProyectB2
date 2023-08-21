//Archivo donde estan las rutas del server (app.js)
const { Router } = require("express");
const UserRouter = require("./newUser.router"); //reemp users por newUser
const fileProductRouter = require("./fileRoutes/fileproducts.router");
const fileCartRouter = require("./fileRoutes/filecarts.router");
const productRouterMongo = require("./products.router");
const cartRouterMongo = require("./carts.router");
const viewsRouter = require("./views.router");
const { uploader } = require("../utils/multer");
const sessionRouter = require("./session.router");
const userRouter = require("../routes/users.router");
const contactsRouter = require("./contacts.router.js");
const { errorHandler } = require("../middlewares/error.middleware");
const pruebasRouter = require("./pruebas.router");
const routerApp = Router();

const newUserRouter = new UserRouter(); //instancia de newUserRouter

routerApp.use("/pruebas", pruebasRouter);
routerApp.use("/file/carts", fileCartRouter);
routerApp.use("/file/products", fileProductRouter);
routerApp.use("/api/newusuarios", newUserRouter.getRouter()); //newUser
routerApp.use("/api/usuarios", userRouter); //userRouter
routerApp.use("/api/productos", productRouterMongo);
routerApp.use("/api/carts", cartRouterMongo);
routerApp.use("/views", viewsRouter);
routerApp.use("/api/session", sessionRouter);
routerApp.use("/api/contacts", contactsRouter); //DTO

routerApp.use((req, res, next) => {
  console.log("Middleware app - time: ", Date.now());
  next();
});

routerApp.post("/upload", uploader.single("myFile"), (req, res) => {
  res.send({
    status: "success",
    mensaje: "Archivo subido OK",
  });
});

//Middleware por si se rompe algo
// routerApp.use((err, req, res, next) => {
//   console.log(err);
//   res.status(500).send("Todo roto");
// });

routerApp.use(errorHandler);

module.exports = routerApp;
