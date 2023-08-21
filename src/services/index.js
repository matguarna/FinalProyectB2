// //traer una instancia de los DAOs (manager)
// const { ProductDaoMongo } = require("../Daos/mongo/product.mongo");
// const { UserDaoMongo } = require("../Daos/mongo/user.mongo");
// const { CartDaoMongo } = require("../Daos/mongo/cart.mongo");
// const { ContactDaoMongo } = require("../Daos/mongo/contact.mongo");

// const { ProductDaoFile } = require("../Daos/fileSystem/fileProductManager");

// // const productService = new ProductDaoFile();

// const userService = new UserDaoMongo();
// const productService = new ProductDaoMongo();
// const cartService = new CartDaoMongo();
// const contactService = new ContactDaoMongo();

// module.exports = {
//   userService,
//   productService,
//   cartService,
//   contactService,
// };

//Usando el factory
const { UserDao, CartDao, ProductDao, ContactDao, TicketDao } = require("../Daos/factory");
const { CartRepository } = require("../repositories/carts.repository");
const { ContactRepository } = require("../repositories/contacts.repository");
const { ProductRepository } = require("../repositories/products.repository");
const { UserRepository } = require("../repositories/users.repository");
const { TicketRepository } = require("../repositories/ticket.repository");

const productService = new ProductRepository(ProductDao);
const userService = new UserRepository(UserDao);
const cartService = new CartRepository(CartDao);
const contactService = new ContactRepository(ContactDao);
const ticketService = new TicketRepository(TicketDao);

module.exports = {
  userService,
  productService,
  cartService,
  contactService,
  ticketService,
};
