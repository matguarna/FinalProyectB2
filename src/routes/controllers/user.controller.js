const { logger } = require("../../config/logger");
const { userService } = require("../../services/index");

class UserController {
  getUsers = async (req, res) => {
    try {
      let users = await userService.getUsers();
      console.log(users);
      res.send({
        status: "success",
        payload: users,
      });
    } catch (error) {
      console.log("get userModel ERROR");
    }
  };

  getById = async (req, res) => {
    let { uid } = req.params;
    let user = await userService.getById(uid);
    res.send({ status: "success", payload: user });
  };

  getPaginate = async (req, res) => {
    try {
      //page 1 es por defecto, si no recibe la page
      let { page } = req.query;
      let pagina;
      if (!page) {
        pagina = 1;
      } else {
        pagina = page;
      }

      console.log("Log getPaginate");
      console.log(req.query);
      console.log(pagina);
      // let users = await userModel.paginate({}, { limit: 10, page: pagina, lean: true });
      let users = await userService.usersPaginate(pagina);
      console.log("users getPAGINATE");
      console.log(users);

      //la funcion paginate crea un array llamado docs (users.docs)
      const { docs, hasPrevPage, hasNextPage, prevPage, nextPage } = users;
      res.render("users.handlebars", {
        status: "success",
        users: docs,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage,
      });
    } catch (error) {
      console.log("get userModel ERROR", error);
    }
  };

  createUser = async (req, res) => {
    try {
      let user = req.body; //En el body viene la informacion. Se envia el mensaje en formato JSON dentro del Body y modo "raw".
      if (!user.first_name || !user.last_name || !user.email)
        return res.status(404).send({ status: "Error", mensaje: "Debe completar nombre y apellido en JSON" });

      //userModel necesita que le pasen los parametros especificados en el Schema, con el mismo nombre (o sea, first_name, last_name, email)
      const newUser = {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        password: user.password,
        username: user.username,
        gender: user.gender,
        role: "usuario",
      };
      let result = await userService.create(newUser);
      res.status(200).send({ status: "success", message: "Usuario creado correctamente", payload: result });
    } catch (error) {
      console.log("userRouter POST: error", error);
    }
  };

  // updateUser = async (req, res) => {
  //   try {
  //     const { uid } = req.params;
  //     const user = req.body;
  //     if (!uid) return res.send({ status: "Error", message: "No existe el uid" });
  //     if (!user.first_name || !user.last_name || !user.email)
  //       return res.status(200).send({ status: "Error", mensaje: "Debe completar nombre y apellido en JSON" });

  //     let userToReplace = {
  //       first_name: user.first_name,
  //       last_name: user.last_name,
  //       email: user.email,
  //     };

  //     let result = await userService.update(uid, userToReplace);

  //     res.status(200).send({ status: "success", payload: result });
  //   } catch (error) {
  //     console.log("userRouter PUT: error", error);
  //   }
  // };

  updateUser = async (req, res) => {
    try {
      const { uid } = req.params;

      let userToReplace = await userService.getById(uid);
      if (!userToReplace) return res.send({ status: "Error", message: "No existe el usuario" });

      console.log(req.body);

      let result = await userService.update(uid, userToReplace);

      res.status(200).send({ status: "success", payload: result });
    } catch (error) {
      console.log("userRouter PUT: error", error);
    }
  };

  updateUserRol = async (req, res) => {
    try {
      const { uid } = req.params;
      let mensaje;
      let userToReplace = await userService.getById(uid);

      if (!userToReplace) return res.send({ status: "Error", message: "No existe el usuario" });

      if (userToReplace.role == "usuario") {
        userToReplace.role = "premium";
        mensaje = "El rol del usuario cambió de -usuario- a -premium-";
      } else if (userToReplace.role == "premium") {
        userToReplace.role = "usuario";
        mensaje = "El rol del usuario cambió de -premium- a -usuario-";
      } else if (userToReplace.role == "admin") {
        mensaje = "El rol del usuario es admin, no puede cambiarse por este método";
      }
      logger.info(userToReplace);
      let result = await userService.update(uid, userToReplace);

      res.status(200).send({ status: "success", message: mensaje, payload: result });
    } catch (error) {
      console.log("userRouter PUT: error", error);
    }
  };

  deleteUser = async (req, res) => {
    try {
      let { uid } = req.params;
      let result = await userService.delete(uid);
      res.status(200).send({ status: "success", payload: result });
    } catch (error) {
      console.log("userRouter DELETE: error", error);
    }
  };
}

module.exports = { UserController };
