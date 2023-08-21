const authorization = (role) => {
  return async (req, res, next) => {
    try {
      if (!req.user) return res.status(401).send({ status: "Error", error: "JwtRole: Unauthorized" });
      //Si el rol es distinto a "role" del parametro, retorna error
      if (req.user.role != role)
        return res.status(403).send({ status: "Error", error: "JwtRole: Not permissions. No tiene el rol necesario" });
      next();
    } catch (error) {
      console.log("AuthorizationJwtRole error", error);
    }
  };
};

const authorization2 = (role1, role2) => {
  return async (req, res, next) => {
    try {
      if (!req.user) return res.status(401).send({ status: "Error", error: "JwtRole: Unauthorized" });
      //Si el rol es distinto a "role" del parametro, retorna error ||
      if (req.user.role != role1 && req.user.role != role2)
        return res.status(403).send({ status: "Error", error: "JwtRole: Not permissions. No tiene el rol necesario" });
      next();
    } catch (error) {
      console.log("AuthorizationJwtRole error", error);
    }
  };
};

module.exports = {
  authorization,
  authorization2,
};
