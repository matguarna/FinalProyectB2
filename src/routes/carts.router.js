const { Router } = require("express");
const cartRouterMongo = Router();
const { CartController } = require("./controllers/carts.controller");
const cartController = new CartController();

cartRouterMongo.get("/createcart", cartController.createCart);

//Finalizar compra
cartRouterMongo.get("/:cid/purchase", cartController.endPurchase);

//Agrega un producto o actualiza cantidad
cartRouterMongo.put("/:cid/products/:pid", cartController.updateCart);

//Mostrar productos
cartRouterMongo.get("/:cid", cartController.verProdCart);

//Agrega producto al carrito
cartRouterMongo.get("/:cid/:pid", cartController.addToCart);

//Elimina un producto
cartRouterMongo.delete("/:cid/products/:pid", cartController.deleteCartProd);

//Vacia cart completo
cartRouterMongo.delete("/:cid", cartController.vaciarCart);

module.exports = cartRouterMongo;
