const { Router } = require("express");
const jwt = require("jsonwebtoken");

class RouterClass {
  constructor() {
    this.router = Router();
    this.init(); //al instanciar la clase, se ejecutan las rutas
  }

  getRouter() {
    return this.router;
  }

  init() {}

  //callbacks es un array de middlewares
  //[(req, res, next)=>{}] queda en la posicion 0 de callbacks
  applyCallbacks(callbacks) {
    return callbacks.map((callback) => async (...params) => {
      try {
        await callback.apply(this, params);
        //apply ejecutará la funcion callback apuntando directamente a una instancia de la clase, por ello, colocamos this para que utilice solo el contexto de ESTE router, los parametros son internos de cada callback, sabemos que los params de una callback corresponden a req, res, next
      } catch (error) {
        console.log("applyCallbacks error", error);
        params[1].status(500).send(error);
      }
    });
  }

  //middleware de respuestas
  generateCustomResponse = (req, res, next) => {
    res.sendSuccess = (payload) => res.send({ status: "success", payload });
    res.sendServerError = (error) => res.send({ status: "error", error });
    res.sendUserError = (error) => res.send({ status: "User error", error });
    next();
  };

  //funcion que maneja las jerarquias de usuarios
  handlePolicies = (policies) => (req, res, next) => {
    if (policies[0] == "PUBLIC") return next();
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.send({ status: "error", error: "handlePolicies: No esta el token" });
    //authorization: Bearer 55token55
    const token = authHeader.split(" ")[1];
    const user = jwt.verify(token, "palabraJwtSecreta"); //palabra secreta de jwt.js
    if (!policies.includes(user.role.toUpperCase()))
      return res.status(403).send({ status: "error", error: "handlePolicies: No tiene permisos" });
    req.user = user;
    next();
  };

  //el spread genera un array de callbacks
  //Se instancia la clase (x ej UserRouter), y automaticamente se ejecuta init(), se pasa por parametros el controlador (req, res), y se ejecuta.
  get(path, policies, ...callbacks) {
    this.router.get(path, this.handlePolicies(policies), this.generateCustomResponse, this.applyCallbacks(callbacks));
  }

  post(path, policies, ...callbacks) {
    this.router.get(path, this.handlePolicies(policies), this.generateCustomResponse, this.applyCallbacks(callbacks));
  }

  put(path, policies, ...callbacks) {
    this.router.get(path, this.handlePolicies(policies), this.generateCustomResponse, this.applyCallbacks(callbacks));
  }

  delete(path, policies, ...callbacks) {
    this.router.get(path, this.handlePolicies(policies), this.generateCustomResponse, this.applyCallbacks(callbacks));
  }
}

module.exports = RouterClass;
