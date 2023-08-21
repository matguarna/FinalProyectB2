const passport = require("passport");
const passportlocal = require("passport-local");
const { userModel } = require("../models/user.model");
const { createHash, isValidPassword } = require("../utils/bcryptHash");
const GithubStrategy = require("passport-github2");
const { cartModel } = require("../models/cart.model");
const { CustomError } = require("../utils/CustomError/customError");
const { generateUserErrorInfo } = require("../utils/CustomError/info");
const { Errors } = require("../utils/CustomError/Errors");
const LocalStrategy = passportlocal.Strategy;
require("dotenv").config(); //Importamos dotenv para usar el archivo .env

const initPassportLogin = () => {
  //es un middleware. configuracion del registro
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email", //disfraza el campo obligatorio "username" por "email"
      },
      async (req, username, password, done) => {
        try {
          const { first_name, last_name } = req.body;
          //username es el email
          let bodyUsername = req.body.username;
          let bodyMail = req.body.email;

          let errorsito;
          if (!first_name || !last_name || !bodyUsername || !bodyMail) {
            errorsito = CustomError.createError({
              name: "User creation error",
              cause: generateUserErrorInfo({
                first_name,
                last_name,
                bodyUsername,
                bodyMail,
              }),
              message: "Error intentando crear un usuario",
              code: Errors.INVALID_TYPE_ERROR,
            });
          }

          let userDB = await userModel.findOne({ email: username });

          if (userDB) return done(null, false);

          const newUser = {
            first_name,
            last_name,
            username: req.body.username,
            email: username,
            password: createHash(password),
            gender: "null",
            role: "usuario",
          };
          let result = await userModel.create(newUser);
          await cartModel.create({
            email: newUser.email,
            products: [],
          });

          return done(null, result);
        } catch (errorsito) {
          return done(errorsito);
          // return done("Error al obtener el usuario", error);
        }
      }
    )
  );
};

//Para guardar el ID de la sesion del usuario
passport.serializeUser((user, done) => {
  done(null, user._id);
});

//Trae el id del usuario
passport.deserializeUser(async (id, done) => {
  let user = await userModel.findOne({ _id: id });
  done(null, user);
});

passport.use(
  "login",
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async (username, password, done) => {
      try {
        const userDB = await userModel.findOne({ email: username }).lean();

        if (!userDB) return done(null, false);

        if (!isValidPassword(password, userDB)) return done(null, false);

        return done(null, userDB);
      } catch (error) {
        return done(error);
      }
    }
  )
);

const initPassportGithub = () => {
  passport.use(
    "github",
    new GithubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID, //"Iv1.3d5fae0b836c63e2", //
        clientSecret: process.env.GITHUB_CLIENT_SECRET, //"bafb8d940aacac768f2e7dc23e99277ef9c44c50", //
        callbackURL: process.env.GITHUB_CALLBACK_URL, //"http://localhost:8080/api/session/githubcallback", //
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log("Profile:", profile);
        try {
          let userDB = await userModel.findOne({ email: profile._json.email });
          //if (userDB)

          if (!userDB) {
            const newUser = {
              first_name: profile.username,
              last_name: profile.username,
              username: profile.username,
              email: "pruebamail@gmail.com", //profile._json.email,
              password: "123",
            };
            let result = await userModel.create(newUser);
            return done(null, result);
          }
          return done(null, userDB);
        } catch (error) {
          console.log("Github strategy Error", error);
        }
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await userModel.findOne({ _id: id });
    done(null, user);
  });
};

module.exports = {
  initPassportLogin,
  initPassportGithub,
};
