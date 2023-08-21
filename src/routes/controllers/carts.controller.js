const { cartService, ticketService, productService } = require("../../services/index");
const { Errors } = require("../../utils/CustomError/Errors");
const { CustomError } = require("../../utils/CustomError/customError");
const { updateCartErrorInfo } = require("../../utils/CustomError/info");
const { sendMail } = require("../../utils/sendmail");
const moment = require("moment");

class CartController {
  createCart = async (req, res) => {
    try {
      //const newProduct = req.body;
      let result = await cartService.addCart();
      res.status(200).send({ status: "success", payload: result });
    } catch (error) {
      console.log("cartRouterMongo get: Error", error);
    }
  };

  getCartByEmail = async (req, res) => {
    try {
      let result = await cartService.getCartByEmail(email);
      res.status(200).send({ status: "success", payload: result });
    } catch (error) {
      console.log("cartRouterMongo get: Error", error);
    }
  };

  verProdCart = async (req, res) => {
    try {
      const { cid } = req.params;
      const cart = await cartService.getCartById(cid);
      let { products } = cart;

      res.render("cart.handlebars", {
        status: "success",
        payload: products,
      });
    } catch (error) {
      console.log(error);
    }
  };

  addToCart = async (req, res) => {
    try {
      // const { cid } = req.params;
      // const { pid } = req.params;
      let { cid } = req.body;
      let { pid } = req.body;
      let mensaje;
      let estado;
      let cart;
      let producto = await productService.getProductById(pid);
      let carrito = await cartService.getCartById(cid);
      if (producto.owner != carrito.email) {
        estado = "success";
        mensaje = "Producto agregado al cart";
        cart = await cartService.addProductToCart(cid, pid);
      } else {
        mensaje = "No puede agregar al carrito un producto propio";
        estado = "Error";
      }
      res.status(200).send({ status: estado, message: mensaje, payload: cart });
    } catch (error) {
      console.log(error);
    }
  };

  updateCart = async (req, res) => {
    try {
      let { cid, pid } = req.params;
      let { quantity } = req.body;

      if (!quantity) {
        CustomError.createError({
          name: "updateCart Error",
          cause: updateCartErrorInfo(quantity),
          message: "Error en la cantidad indicada",
          code: Errors.INVALID_TYPE_ERROR,
        });
      }

      await cartService.updateProduct(cid, pid, quantity);

      res.status(200).send({ status: "success", payload: `Cart ${cid} actualizado` });
    } catch (error) {
      console.log(error);
    }
  };

  deleteCartProd = async (req, res) => {
    try {
      const { cid, pid } = req.params;

      let realizado = await cartService.deleteProduct(cid, pid);
      if (realizado) {
        res.status(200).send({ status: "success", payload: `Producto ${pid} eliminado del Cart ${cid}` });
      }
    } catch (error) {
      console.log("updateCart error", error);
    }
  };

  vaciarCart = async (req, res) => {
    try {
      const { cid } = req.params;
      let realizado = await cartService.deleteAllProducts(cid);
      if (realizado) {
        res.status(200).send({ status: "success", payload: `Cart ${cid} vaciado` });
      }
    } catch (error) {
      console.log("updateCart error", error);
    }
  };

  endPurchase = async (req, res) => {
    try {
      const { cid } = req.params;
      const cart = await cartService.getCartById(cid);
      let { products } = cart;

      //Verifica stock en la db y lo actualiza
      let prodSinStock = [];
      let prodConStock = [];
      for (let producto of products) {
        let stock = producto.product.stock;
        let pid = producto.product._id;
        if (stock >= producto.quantity) {
          producto.product.stock -= producto.quantity;
          prodConStock.push(producto);
          await productService.updateProduct(pid, producto.product);
        } else {
          prodSinStock.push(producto);
        }
      }

      //Nombre y Id productos sin stock
      let titlesSinStock = [];
      let titlesId = [];
      for (let producto of prodSinStock) {
        titlesSinStock.push(producto.product.title);
        titlesId.push(producto.product._id);
      }

      //Total a pagar
      const preciosCart = prodConStock.map((producto) => producto.product.price * producto.quantity);
      let totalAmount = 0;
      for (let monto of preciosCart) totalAmount += monto;

      //Trae la cantidad de tickets para generar un nuevo code y crea el ticket
      const arrayTickets = await ticketService.traerTickets();
      let codeTicket = arrayTickets.length + 1;
      const ticket = {
        code: codeTicket,
        purchase_datatime: moment().format("MMMM Do YYYY, h:mm:ss a"),
        amount: totalAmount,
        purchaser: cart.email,
      };

      let ticketCreado = await ticketService.generarTicket(ticket);

      //Si crea el ticket, envia un mail al usuario con los datos del ticket
      if (ticketCreado) {
        let destino = "gedesaurio@gmail.com"; //cart.email
        let asunto = `Compra E-commerce: Ticket Nro: ${codeTicket}`;
        let html = `<div>
      <h1>Gracias por tu compra</h1>
      <p>Abonado en el ticket: $${totalAmount}</p>
      </div>`;
        await sendMail(destino, asunto, html);
      }

      res.status(200).send({
        status: "success",
        message: `El total cobrado en el ticket es $${totalAmount}. Productos sin stock : ${titlesSinStock}. Ids: ${titlesId}`,
      });
    } catch (error) {
      console.log("endPurchase ERROR: ", error);
    }
  };
}

module.exports = {
  CartController,
};
