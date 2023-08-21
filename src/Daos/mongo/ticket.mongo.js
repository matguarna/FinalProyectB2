const { ticketModel } = require("../../models/ticket.model");

class TicketDaoMongo {
  constructor() {
    this.ticketModel = ticketModel;
  }

  async generarTicket(ticket) {
    return await this.ticketModel.create(ticket);
  }

  async traerTickets() {
    return await this.ticketModel.find({});
  }
}

module.exports = { TicketDaoMongo };
