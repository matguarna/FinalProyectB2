const { Schema, model } = require("mongoose");

const collection = "tickets";

const ticketSchema = new Schema({
  code: { type: String, required: true, unique: true },
  purchase_datatime: { type: String, required: true },
  amount: { type: Number, required: true },
  purchaser: { type: String, required: true },
});

const ticketModel = model(collection, ticketSchema);

module.exports = {
  ticketModel,
};
