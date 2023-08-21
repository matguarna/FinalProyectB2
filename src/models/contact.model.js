const { Schema, model } = require("mongoose");

const collection = "contacts";

const contactSchema = new Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  active: Boolean,
  phone: String,
});

const contactModel = model(collection, contactSchema);

module.exports = {
  contactModel,
};
