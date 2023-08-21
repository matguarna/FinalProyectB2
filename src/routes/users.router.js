const { Router } = require("express");
const auth = require("../middlewares/autenticacion.middleware");
const { UserController } = require("./controllers/user.controller");

const userController = new UserController();
const userRouter = Router();

//GET
userRouter.get("/", userController.getUsers);

//GET by id
userRouter.get("/:uid", userController.getById);

//mongoosePaginate
userRouter.get("/paginate", userController.getPaginate);

//POST
userRouter.post("/", userController.createUser);

//Premium
userRouter.put("/premium/:uid", userController.updateUserRol);

//PUT
userRouter.put("/:uid", userController.updateUser);

//DELETE
userRouter.delete("/:uid", userController.deleteUser);

//{"first_name":"matho","last_name":"barracchia","email":"matho@gmail.com"}

module.exports = userRouter;
