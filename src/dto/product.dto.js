class ProductDto {
  constructor(product) {
    this.title = product.title;
    this.descripcion = product.descripcion;
    this.price = product.price;
    this.thumbnail = product.thumbnail;
    this.stock = product.stock;
    this.category = product.category;
    this.code = product.code;
    this.owner = product.owner
  }
}

module.exports = {
  ProductDto,
};
