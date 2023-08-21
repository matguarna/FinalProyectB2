const { contactModel } = require("../../models/contact.model");

class ContactDaoMongo {
  constructor() {
    this.contactModel = contactModel;
  }

  async get() {
    return this.contactModel.find({});
  }

  async create(newContact) {
    return this.contactModel.create(newContact);
  }
}

module.exports = { ContactDaoMongo };
