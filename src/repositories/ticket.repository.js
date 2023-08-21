const { TicketDto } = require("../dto/ticket.dto");

class TicketRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async generarTicket(ticket) {
    let ticketToInsert = new TicketDto(ticket);
    let result = await this.dao.generarTicket(ticketToInsert);
    return result;
  }

  async traerTickets() {
    let result = await this.dao.traerTickets();
    return result;
  }
}

module.exports = {
  TicketRepository,
};
