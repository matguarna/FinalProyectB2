const mongoose = require("mongoose");
const { UserDaoMongo } = require("../src/Daos/mongo/user.mongo");
const chai = require("chai");
const { createHash, isValidPassword } = require("../src/utils/bcryptHash");
const { UserDto } = require("../src/dto/user.dto");

mongoose.connect("mongodb+srv://mguarna:pikachu1@cluster0.zbnzv1a.mongodb.net/DBpruebas?retryWrites=true&w=majority");

const expect = chai.expect;

describe("Testing de bcrypt", () => {
  it("El servicio debe devolver un hasheo de passwd", async () => {
    const password = "pass123";
    const hashedPassword = await createHash(password);
    console.log(hashedPassword);
    expect(hashedPassword).to.not.be.equal(password);
  });

  it("El servicio debe comparar una password hasheada", async () => {
    const password = "pass123";
    const hashedPassword = await createHash(password);
    const userDBmock = { password: hashedPassword };
    const isValidPass = await isValidPassword(password, userDBmock);
    console.log(hashedPassword);
    expect(isValidPass).to.be.true;
  });
});

describe("Testing de DTO", () => {
  it("El servicio debe devolver un usuario", async () => {
    let userMock = {
      first_name: "Javier",
      last_name: "Landradoy",
      email: "j@gmail.com",
      gender: "Hombre",
      password: "javier1",
      username: "javi",
      role: "usuario",
    };
    const userDTOresult = new UserDto(userMock);
    expect(userDTOresult).to.have.property("first_name", "Javier");
  });
});
