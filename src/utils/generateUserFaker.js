const { faker } = require("@faker-js/faker");

const generateProduct = () => {
  return {
    title: faker.commerce.productName(),
    price: faker.commerce.price(),
    department: faker.commerce.department(),
    stock: faker.string.numeric(),
    description: faker.commerce.productDescription(),
    id: faker.database.mongodbObjectId(),
    image: faker.image.url(),
  };
};

exports.generateUser = () => {
  let numOfProductos = parseInt(faker.string.numeric(1, { bannedDigits: ["0"] }));
  let products = [];
  for (let i = 0; i < numOfProductos; i++) {
    products.push(generateProduct());
  }
  return {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    sex: faker.person.sex(),
    birthDate: faker.date.birthdate(),
    phone: faker.phone.number(),
    image: faker.image.avatar(),
    id: faker.database.mongodbObjectId(),
    email: faker.internet.email(),
    products,
  };
};
