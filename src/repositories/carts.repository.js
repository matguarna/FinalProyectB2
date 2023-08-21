const { CartDto } = require("../dto/cart.dto");

class CartRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async addCart() {
    // let cartToCreate = new CartDto(email);
    return await this.dao.addCart();
  }

  async getCartById(cid) {
    return await this.dao.getCartById(cid);
  }

  async getCartByEmail(email) {
    return await this.dao.getCartByEmail(email);
  }

  async addProductToCart(cid, pid) {
    return await this.dao.addProductToCart(cid, pid);
  }

  async updateProduct(cid, pid, quantity) {
    return await this.dao.updateProduct(cid, pid, quantity);
  }

  async deleteProduct(cid, pid) {
    return await this.dao.deleteProduct(cid, pid);
  }

  async deleteAllProducts(cid) {
    return await this.dao.deleteAllProducts(cid);
  }
}

module.exports = {
  CartRepository,
};
