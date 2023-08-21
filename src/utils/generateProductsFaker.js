const { faker } = require("@faker-js/faker");

exports.generateProductsFaker = () => {
  return {
    _id: faker.database.mongodbObjectId(),
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: faker.commerce.price(),
    stock: faker.string.numeric(),
    image: faker.image.url(),
    category: faker.commerce.productMaterial(),
    code: faker.string.alphanumeric(4),
  };
};
