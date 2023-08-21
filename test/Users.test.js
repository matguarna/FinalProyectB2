//DAO de usuarios
const mongoose = require("mongoose");
const Assert = require("assert");
const { UserDaoMongo } = require("../src/Daos/mongo/user.mongo");

mongoose.connect("mongodb+srv://mguarna:pikachu1@cluster0.zbnzv1a.mongodb.net/DBpruebas?retryWrites=true&w=majority");

//mongodb://localhost:27017/test39

//mongodb+srv://mguarna:pikachu1@cluster0.zbnzv1a.mongodb.net/DBpruebas?retryWrites=true&w=majority

const assert = Assert.strict; //Compara de manera estricta

describe("Testing de User Dao Mongo", () => {
  before(function () {
    this.userDaoMongo = new UserDaoMongo();
    mongoose.connection.collections.usuarios.drop(); //Elimina la coleccion antes de empezar el test completo
  });

  beforeEach(function () {
    //antes de cada it
    this.timeout(2000);
  });

  it("El dao debe traer los usuarios correctamente de la DB", async function () {
    const result = await this.userDaoMongo.getUsers();
    assert.strictEqual(Array.isArray(result), true);
  }).timeout(5000);

  it("El dao debe crear un usuario correctamente de la DB", async function () {
    let userMock = {
      first_name: "Javier",
      last_name: "Landradoy",
      email: "j@gmail.com",
      gender: "Hombre",
      password: "javier1",
      username: "javi",
      role: "usuario",
    };
    const result = await this.userDaoMongo.create(userMock);
    const user = await this.userDaoMongo.getById(result._id);
    assert.strictEqual(typeof user, "object");
  }).timeout(5000);

  it("El dao debe modificar un usuario correctamente de la DB", async function () {
    const user = await this.userDaoMongo.getByEmail("j@gmail.com");
    // console.log("user sin modif: ", user);
    user.first_name = "Esteban";
    // console.log("user modif: ", user);
    await this.userDaoMongo.update(user._id, user);
    const usuario = await this.userDaoMongo.getById(user._id);
    // console.log("usuario: ", usuario);
    assert.strictEqual(usuario.first_name, user.first_name);
  }).timeout(5000);

  it("El dao debe eliminar un usuario correctamente de la DB", async function () {
    const user = await this.userDaoMongo.getByEmail("j@gmail.com");
    const result = await this.userDaoMongo.delete(user._id);
    // console.log("result delete: ", result);
    assert.strictEqual(typeof result, "object");
  }).timeout(5000);
});
