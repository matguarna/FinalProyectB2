const { ContactDto } = require("../dto/contact.dto");

class ContactRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getContacts = async () => {
    let result = await this.dao.get();
    return result;
  };
  createContact = async (newContact) => {
    let contactToInsert = new ContactDto(newContact); //Retorna el newContact con formato de ContactDto
    let result = await this.dao.create(contactToInsert);
    return result;
  };
}

module.exports = {
  ContactRepository,
};
