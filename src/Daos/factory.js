const config = require("../config/objectConfig");

let UserDao;
let ProductDao;
let CartDao;
let ContactDao;
let TicketDao;

switch (config.persistence) {
  case "MONGO":
    //
    config.connectDB();
    const { ProductDaoMongo } = require("../Daos/mongo/product.mongo");
    const { UserDaoMongo } = require("../Daos/mongo/user.mongo");
    const { ContactDaoMongo } = require("../Daos/mongo/contact.mongo");
    const { CartDaoMongo } = require("../Daos/mongo/cart.mongo");
    const { TicketDaoMongo } = require("./mongo/ticket.mongo");

    ProductDao = new ProductDaoMongo();
    UserDao = new UserDaoMongo();
    CartDao = new CartDaoMongo();
    ContactDao = new ContactDaoMongo();
    TicketDao = new TicketDaoMongo();
    break;
  case "FILE":
    //
    config.connectDB(); //Tambien conecta a la db de mongo
    const { ProductDaoFile } = require("../Daos/fileSystem/fileProductManager");
    const { CartDaoFile } = require("../Daos/fileSystem/fileCartManager");

    ProductDao = new ProductDaoFile();
    CartDao = new CartDaoFile();
    break;
  case "MEMORY":
    //
    // ProductDao =
    // CartDao =
    break;

  default:
    break;
}

module.exports = {
  UserDao,
  ProductDao,
  CartDao,
  ContactDao,
  TicketDao,
};
