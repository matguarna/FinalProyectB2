//const { userModel } = require("../../models/user.model");
const { logger } = require("../../config/logger");
const { userService } = require("../../services");
const { createHash, isValidPassword } = require("../../utils/bcryptHash");
const { generateToken } = require("../../utils/jwt");
const { sendMail } = require("../../utils/sendmail");

class SessionController {
  base = (req, res) => {
    res.render("login", {});
  };

  counter = (req, res) => {
    if (req.session.counter) {
      req.session.counter++;
      res.send(`Se ha visitado el sitio ${req.session.counter} veces.`);
    } else {
      req.session.counter = 1;
      res.send("Bienvenido");
    }
  };

  login = async (req, res) => {
    const { email, password } = req.body;

    const userDB = await userService.loginSession(email);
    logger.info("userDB del /login: ", userDB);

    //Validar passwd hasheada
    if (isValidPassword(password, userDB) == false) {
      return res.status(401).send({ status: "Error", message: "Usuario o contraseña incorrecta" });
    }

    if (!userDB) {
      return res.send({ status: "error", message: "Logueo incorrecto" });
    }

    //Guarda los datos en la sesion
    req.session.user = {
      first_name: userDB.first_name,
      last_name: userDB.last_name,
      email: userDB.email,
      username: userDB.username,
      role: userDB.role,
    };

    //Variable sin la password de userDB, para generar el access token
    let userDBsinpass = userDB;
    delete userDBsinpass.password;

    const access_token = generateToken(userDBsinpass);
    // res.redirect(`http://localhost:${process.env.PORT}/api/productos/paginate`);
    res
      .cookie("appCookieToken", access_token, {
        maxAge: 60 * 60 * 100,
        httpOnly: true, //Solo puede ser accedida en consulta http. (Seguridad)
      })
      .send({ status: "success", message: "Login success" });
  };

  recupass = async (req, res) => {
    try {
      const { email } = req.body;
      const userDB = await userService.loginSession(email);
      logger.info("userDB del /recupass: ", userDB);
      let mensaje;
      if (!userDB) {
        mensaje = "No existe un usuario registrado con ese email en la DB";
      } else {
        mensaje = "Se ha enviado un email con las instrucciones para recuperar la contraseña";
        let destino = email;
        let asunto = `E-commerce: Recupero de contraseña`;
        let html = `<div>
          <h1>Recu pass</h1>
          <p>Para recuperar la contraseña ingrese al siguiente link e ingrese la nueva contraseña. La contraseña no debe ser igual a la anterior. El link expirará en 1 hora</p>
          <p>http://localhost:${process.env.PORT}/api/session/nuevapass</p>
          </div>`;
        await sendMail(destino, asunto, html);
      }

      res.send({ status: "success", message: mensaje });
    } catch (error) {
      logger.error("Recu pass ERROR", error);
    }
  };

  nuevapass = async (req, res) => {
    res.render("recupass.handlebars", {});
  };

  nuevapass2 = async (req, res) => {
    let { email, password } = req.body;
    let userDB = await userService.loginSession(email);
    // console.log("userDB de nuevapass2: ", userDB);
    let mensaje;
    let estado;
    if (isValidPassword(password, userDB) == true) {
      mensaje = "Contraseña incorrecta, debe elegir otra contraseña";
      estado = "Error";
    } else {
      //Cambio de password
      password = createHash(password);
      userDB.password = password;
      await userService.update(userDB._id, userDB);
      mensaje = "La contraseña fue cambiada con éxito";
      estado = "Success";
    }

    res.status(200).send({ status: estado, message: mensaje });
  };

  register = async (req, res) => {
    try {
      res.send({
        status: "success",
        message: "User registered",
      });
    } catch (error) {
      console.log("Register POST session error", error);
    }
  };

  logout = (req, res) => {
    req.session.destroy((error) => {
      if (error) {
        return res.send({ status: "Error", error: error });
      } else {
        res.redirect(`http://localhost:${process.env.PORT}/views/login`);
      }
    });
  };

  faillogin = async (req, res) => {
    req.logger.error("Falló la estrategia de login");
    res.send({ status: "error", error: "Falló el login" });
  };

  failregister = async (req, res) => {
    req.logger.error("Falló la estrategia de registro");
    res.send({ status: "error", error: "Falló la autenticación" });
  };
}

module.exports = { SessionController };
