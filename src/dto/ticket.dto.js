class TicketDto {
  constructor(ticket) {
    this.code = ticket.code;
    this.purchase_datatime = ticket.purchase_datatime;
    this.amount = ticket.amount;
    this.purchaser = ticket.purchaser;
  }
}

module.exports = {
  TicketDto,
};
