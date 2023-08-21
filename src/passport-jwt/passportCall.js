//Archivo para redefinir mensajes de passport. Encapsula la config de passport.authenticate y se le agrega mensajes
const passport = require("passport");

const passportCall = (strategy) => {
  //Retorna el middleware
  return async (req, res, next) => {
    try {
      passport.authenticate(strategy, function (error, user, info) {
        if (error) return next(error);
        if (!user) return res.status(401).send({ status: "error", error: info.messages ? info.messages : info.toString() });
        //Se guarda el user desencriptado del jwt en la req para que cuando pase el middleware ya tenga los datos del usuario
        req.user = user;
        next();
      })(req, res, next); //se autoejecuta cuando sea llamado passportCall
    } catch (error) {
      console.log("PassportCall error", error);
    }
  };
};

module.exports = {
  passportCall,
};
