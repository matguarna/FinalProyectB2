const { cartModel } = require("../../models/cart.model");

class CartDaoMongo {
  async addCart() {
    try {
      return await cartModel.create({
        products: [],
      });
    } catch (error) {
      console.log("addCart Error: ", error);
    }
  }

  async getCartByEmail(email) {
    try {
      return await cartModel.findOne({ email: email });
    } catch (error) {
      console.log("getCartByEmail Mongo", error);
    }
  }

  async getCartById(cid) {
    try {
      return await cartModel.findOne({ _id: cid }).lean();
    } catch (error) {
      console.log("getCartById Mongo", error);
    }
  }

  async addProductToCart(cid, pid) {
    try {
      const cart = await cartModel.findOne({ _id: cid });
      cart.products.push({ product: pid, quantity: 1 });
      let resp = await cartModel.findByIdAndUpdate({ _id: cid }, cart);
      console.log(JSON.stringify(cart, null, 2));
      return resp;
    } catch (error) {
      console.log("add Prod Cart Mongo", error);
    }
  }

  async updateProduct(cid, pid, quantity) {
    try {
      //Si existeel product en el carrito, le incrementa la quantity
      const respUpdate = await cartModel.findOneAndUpdate(
        { _id: cid, "products.product": pid }, //busca el producto en el carrito
        { $inc: { "products.$.quantity": quantity } }, //incrementa la quantity
        { new: true }
      );

      if (!respUpdate) {
        //Agrega el producto al carrito, si no puede incrementar la quantity
        return await cartModel.findByIdAndUpdate(
          { _id: cid },
          { $push: { products: { product: pid, quantity } } },
          { new: true, upsert: true }
        );
      }
    } catch (error) {
      console.log("UpdateProduct Mongo ERROR", error);
    }
  }

  async deleteProduct(cid, pid) {
    try {
      let realizado = await cartModel.findOneAndUpdate({ _id: cid }, { $pull: { products: { product: pid } } }, { new: true });
      if (realizado) {
        console.log(`Producto ${pid} eliminado`);
      }
    } catch (error) {
      console.log("deleteProduct", error);
    }
  }

  async deleteAllProducts(cid) {
    try {
      await cartModel.findOneAndUpdate({ _id: cid }, { $set: { products: [] } }, { new: true });
    } catch (error) {
      console.log("deleteAllProducts", error);
    }
  }
}

module.exports = { CartDaoMongo };
