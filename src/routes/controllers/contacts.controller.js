const { contactService } = require("../../services");

class ContactController {
  getContacts = async (req, res) => {
    // let resultado = await
    res.send({
      status: "success",
      payload: "contactos get",
    });
  };

  createContact = async (req, res) => {
    let { name, last_name, phone } = req.body;
    let result = await contactService.create({ name, last_name, phone });
    res.send({
      status: "success",
      payload: result,
    });
  };
}

module.exports = new ContactController();
