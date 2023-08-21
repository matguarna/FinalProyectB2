//Clase para normalizar los datos del nuevo contacto, para que sean aceptados por el ContactModel
class ContactDto {
  constructor(contact) {
    this.first_name = contact.name;
    this.last_name = contact.last_name;
    this.active = true;
    this.phone = contact.phone ? contact.phone.split("-").join("") : "";
    //Si el phone tiene un guion, lo quita
  }
}

module.exports = {
  ContactDto,
};
