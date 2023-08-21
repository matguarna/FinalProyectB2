const mongoose = require("mongoose");
const { UserDaoMongo } = require("../src/Daos/mongo/user.mongo");
const chai = require("chai");

mongoose.connect("mongodb+srv://mguarna:pikachu1@cluster0.zbnzv1a.mongodb.net/DBpruebas?retryWrites=true&w=majority");

const expect = chai.expect;

describe("Testing de User Dao Mongo en Chai", () => {
  before(function () {
    this.userDaoMongo = new UserDaoMongo();
    mongoose.connection.collections.usuarios.drop(); //Elimina la coleccion antes de empezar el test completo
  });

  beforeEach(function () {
    // mongoose.connection.collections.usuarios.drop();
    this.timeout(2000);
  });
  it("El DAO debe poder obtener todos los usuarios en un array", async function () {
    const result = await this.userDaoMongo.getUsers();
    console.log(result);
    expect(result).to.be.deep.equal([]);
    expect(result).deep.equal([]);
    expect(Array.isArray(result)).to.be.ok;
    expect(Array.isArray(result)).to.be.equals(true); //Compara si array es true
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
    // console.log(user);
    expect(user).to.have.property("first_name", "Javier");
  }).timeout(5000);

  it("El dao debe modificar un usuario correctamente de la DB", async function () {
    const user = await this.userDaoMongo.getByEmail("j@gmail.com");
    // console.log("user sin modif: ", user);
    user.first_name = "Esteban";
    // console.log("user modif: ", user);
    await this.userDaoMongo.update(user._id, user);
    const usuario = await this.userDaoMongo.getById(user._id);
    // console.log("usuario: ", usuario);
    expect(usuario).to.have.property("first_name", "Esteban");
  }).timeout(5000);

  it("El dao debe eliminar un usuario correctamente de la DB", async function () {
    const user = await this.userDaoMongo.getByEmail("j@gmail.com");
    const result = await this.userDaoMongo.delete(user._id);
    // console.log("result delete: ", result);
    expect(result).to.deep.equal(user); //Compara si son iguales
  }).timeout(5000);
});
