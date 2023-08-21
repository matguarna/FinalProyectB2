const { Router } = require("express");
const contactRouter = Router();
const contactController = require("../routes/controllers/contacts.controller"); //Ya esta instanciado

contactRouter.get("/", contactController.getContacts);

contactRouter.post("/", contactController.createContact);

module.exports = contactRouter;
