// const { Router } = require("express");
const RouterClass = require("../routes/RouterClass");

//hijo de RouterClass
class UserRouter extends RouterClass {
  init() {
    this.get("/", ["PUBLIC"], async (req, res) => {
      try {
        res.sendSuccess("Hola userRouter");
      } catch (error) {
        res.sendServerError(error);
      }
    });

    this.get("/current", ["ADMIN"], async (req, res) => {
      //el array con PUBLIC son las policies
      try {
        res.sendSuccess("Usuario validado");
      } catch (error) {
        res.sendServerError(error);
      }
    });
  }
}

module.exports = UserRouter;
