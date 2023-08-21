const { ProductDto } = require("../dto/product.dto");

class ProductRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async getProducts() {
    return await this.dao.getProducts();
  }

  async getProductById(pid) {
    return await this.dao.getProductById(pid);
  }

  async addProduct(newProduct) {
    let productToCreate = new ProductDto(newProduct);
    return await this.dao.addProduct(productToCreate);
  }

  async updateProduct(pid, updateProduct) {
    return await this.dao.updateProduct(pid, updateProduct);
  }

  async deleteProduct(pid) {
    return await this.dao.deleteProduct(pid);
  }

  async stagesProduct() {
    return await this.dao.stagesProduct();
  }

  async paginateProduct(filtro, limite, pag) {
    return await this.dao.paginateProduct(filtro, limite, pag);
  }
}

module.exports = {
  ProductRepository,
};
