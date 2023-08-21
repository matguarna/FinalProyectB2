const { Router } = require("express");
const productRouterMongo = Router();

const passport = require("passport");
const { passportCall } = require("../passport-jwt/passportCall");
const { authorization, authorization2 } = require("../passport-jwt/authorizationJwtRole");

const { ProductController } = require("./controllers/products.controller");
const productController = new ProductController();

//getProducts - passport jwt
productRouterMongo.get(
  "/",
  // passport.authenticate("jwt", { session: false }),
  productController.getProducts
);

//Mocks
productRouterMongo.get("/mockingproducts", productController.mockingProducts);

//stages
productRouterMongo.get("/stages", productController.getStages);

//mongoosePaginate
productRouterMongo.get("/paginate", passportCall("jwt"), productController.productPaginate);

//getProductById
productRouterMongo.get("/:pid", productController.getProductById);

//addProduct
productRouterMongo.post("/", passportCall("jwt"), authorization2("admin", "premium"), productController.addProduct);

//updateProduct
productRouterMongo.put("/:pid", passportCall("jwt"), authorization("admin"), productController.updateProduct);

//deleteProduct
productRouterMongo.delete("/:pid", passportCall("jwt"), authorization2("admin", "premium"), productController.deleteProduct);

//http://localhost:8080/api/productos/:pid?pid=64cecdded48c2e1c4fdd3fa6

module.exports = productRouterMongo;
