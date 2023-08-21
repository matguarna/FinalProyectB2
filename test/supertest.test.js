const chai = require("chai");
const supertest = require("supertest");

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe("Testing de users", () => {
  describe("Test de usuarios", () => {
    it("El endpoint de Post /api/usuarios debe crear un usuario correctamente", async () => {
      let userMock = {
        first_name: "Prueba2",
        last_name: "Test2",
        email: "t2@gmail.com",
        gender: "Hombre",
        password: "test2",
        username: "test2",
        role: "usuario",
      };
      const { statusCode, _body, ok } = await requester.post("/api/usuarios").send(userMock);
      console.log(statusCode, _body, ok);
    }).timeout(5000);

    it("El endpoint de GET /api/usuarios debe traer los usuarios correctamente", async () => {
      const { statusCode, _body, ok } = await requester.get("/api/usuarios");
      expect(statusCode).to.be.equal(200);
    });

    it("El endpoint de GET /api/usuarios/:uid debe el usuario correctamente", async () => {
      let uid = "64dc2f555a81fe7f72443936";
      const { statusCode, _body, ok } = await requester.get(`/api/usuarios/${uid}`);
      expect(_body.payload).to.be.property("_id");
    });
  });

  describe("Test de Session", () => {
    let cookie;
    let cookieResult;
    it("Debe registrar un usuario correctamente", async () => {
      //Borrar user de la DB antes de correr test
      let userMock = {
        first_name: "Session",
        last_name: "Test",
        email: "session@gmail.com",
        gender: "Hombre",
        password: "session1",
        username: "session",
        role: "usuario",
      };
      const { statusCode } = await requester.post(`/api/session/register`).send(userMock);
      expect(statusCode).to.be.ok;
    }).timeout(5000);

    it("El servicio debe loguear un usuario correctamente", async () => {
      let userMock = {
        email: "session@gmail.com",
        password: "session1",
      };
      const result = await requester.post("/api/session/login").send(userMock);
      cookieResult = result.headers["set-cookie"][0];
      // console.log(cookieResult);
      expect(cookieResult).to.be.ok;
      cookie = {
        name: cookieResult.split("=")[0],
        value: cookieResult.split("=")[1],
      };
      // console.log(cookie);
      expect(cookie.name).to.be.ok.and.eql("appCookieToken");
      expect(cookie.value).to.be.ok;
    }).timeout(5000);

    it("Debe enviar el jwt del user y consultar la ruta current", async () => {
      const { _body } = await requester.get("/api/session/current").set("Cookie", [`${cookie.name}=${cookie.value}`]);
      console.log(_body);
      console.log(cookie.name);
    }).timeout(5000);
  });
});
