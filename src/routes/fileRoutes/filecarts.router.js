const { Router } = require("express");
const { CartDaoFile } = require("../../Daos/fileSystem/fileCartManager");

const fileCartRouter = Router();
const cartDaoFile = new CartDaoFile();

// POST. Crea un nuevo carrito
fileCartRouter.post("/", async (req, res) => {
  const idCart = await cartDaoFile.addCart();
  res.send({ status: "success", payload: `Se creó el carrito con ID: ${idCart}` });
});

//GET . Trae los productos del carrito
fileCartRouter.get("/:cid", async (req, res) => {
  let { cid } = req.params;
  const products = await cartDaoFile.getCart(cid);
  res.send({ status: "success", payload: `Los productos del carrito son: ${products}` });
});

// POST. Agrega un producto a un carrito
fileCartRouter.post("/:cid/product/:pid", async (req, res) => {
  let { cid } = req.params;
  let { pid } = req.params;
  await cartDaoFile.addProductCart(cid, pid);
  res.send({ status: "success", payload: `Se agregó al carrito el ID: ${pid}` });
});

module.exports = fileCartRouter;
