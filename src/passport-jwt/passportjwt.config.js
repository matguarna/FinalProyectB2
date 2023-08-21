const passport = require("passport");
const jwt = require("passport-jwt");
const objectConfig = require("../config/objectConfig");

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["appCookieToken"]; //Guarda el token en la cookie appCookieToken
  }
  return token;
};

const initPassport = () => {
  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]), //Trae el token desde las cookies
        secretOrKey: objectConfig.jwt_secret_key, //Trae la palabra secreta
      },
      async (jwt_payload, done) => {
        try {
          //Valida user
          //done(null, false, { messages: "No hay usuarios" });
          return done(null, jwt_payload); //jwt_payload es la info desencriptada
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};

module.exports = { initPassport };
