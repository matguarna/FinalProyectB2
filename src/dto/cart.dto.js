class CartDto {
  constructor(cart) {
    this.products = cart.products;
    this.email = cart.email;
  }
}

module.exports = {
  CartDto,
};
