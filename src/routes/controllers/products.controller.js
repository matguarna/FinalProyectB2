const { logger } = require("../../config/logger");
const { productService, cartService } = require("../../services/index");
const { Errors } = require("../../utils/CustomError/Errors");
const { CustomError } = require("../../utils/CustomError/customError");
const { addProductErrorInfo } = require("../../utils/CustomError/info");
const { generateProductsFaker } = require("../../utils/generateProductsFaker");

class ProductController {
  getProducts = async (req, res) => {
    try {
      const products = await productService.getProducts();
      res.status(200).send({ status: "success", payload: products });
    } catch (error) {
      logger.error(error);
    }
  };

  getStages = async (req, res) => {
    try {
      const products = await productService.stagesProduct();
      res.status(200).send({ status: "success", payload: products });
    } catch (error) {
      logger.error(error);
    }
  };

  productPaginate = async (req, res) => {
    try {
      //Limit
      let { limit } = req.query;
      let limite;
      if (!limit) {
        limite = 10;
      } else {
        limite = limit;
      }

      //Page
      let { pagina } = req.query;
      let pag;
      if (!pagina) {
        pag = 1;
      } else {
        pag = pagina;
      }

      //Query
      let { query } = req.query;
      let filtro;
      if (!query) {
        filtro = {};
      } else {
        if (query) {
          filtro = { category: query };
        }
      }

      logger.info("LOGS PAGINATE");
      const userLogueado = req.session.user;
      console.log(userLogueado);
      let carrito = await cartService.getCartByEmail(userLogueado.email);
      let idCarrito = carrito._id;

      //Varible con los productos
      let productosPaginate = await productService.paginateProduct(filtro, limite, pag);

      let { docs, hasPrevPage, hasNextPage, prevPage, nextPage, totalPages, page } = productosPaginate;

      //Sort
      let { sort } = req.query;
      //PROBLEMA: primero limita los prod de la db y luego hace el sort
      if (sort) {
        //deberia: traer todo sin limite, ordenarlos, limitarlos, mostrarlos
        //let todosProd = await productManagerMongo.getProducts();
        // console.log(todosProd);
        if (sort == "asc") {
          docs = docs.sort((a, b) => {
            if (a.price > b.price) {
              return 1;
            }
            if (a.price < b.price) {
              return -1;
            }
            return 0;
          });
        } else if (sort == "desc") {
          docs = docs.sort((a, b) => {
            if (a.price < b.price) {
              return 1;
            }
            if (a.price > b.price) {
              return -1;
            }
            return 0;
          });
        }
      }

      //PROBLEMA CON LA URL: Cada peticion hace una nueva lista desordenada, las querys no se aplican al cambiar de pagina

      //console.log(req.url);
      //console.log(productosPaginate);

      res.render("products.handlebars", {
        status: "success",
        payload: docs,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage,
        page,
        totalPages,
        userLogueado,
        idCarrito,
      });
    } catch (error) {
      logger.error("get Paginate ERROR", error);
    }
  };

  getProductById = async (req, res) => {
    try {
      const { pid } = req.params;

      const product = await productService.getProductById(pid);
      if (product) {
        res.status(200).send({ status: "success", payload: product });
      } else {
        res.status(200).send({ status: "No se encontró el producto" });
      }
    } catch (error) {
      logger.error(error);
    }
  };

  addProduct = async (req, res) => {
    try {
      let newProduct = req.body;
      if (
        !newProduct.title ||
        !newProduct.descripcion ||
        !newProduct.thumbnail ||
        !newProduct.price ||
        !newProduct.stock ||
        !newProduct.category ||
        !newProduct.code
      ) {
        CustomError.createError({
          name: "addProduct Error",
          cause: addProductErrorInfo(newProduct),
          message: "Error agregando nuevo producto a la DB. Verificar campos inválidos o vacíos",
          code: Errors.DATABASE_ERROR,
        });
      }

      newProduct.owner = req.user.email;
      if (!req.user.email) newProduct.owner = "admin";

      console.log("REQ.USER > ", req.user);

      let result = await productService.addProduct(newProduct);

      res.status(200).send({ status: "success", message: "Producto agregado", payload: result });
    } catch (error) {
      logger.error(error);
    }
  };

  updateProduct = async (req, res) => {
    try {
      const { pid } = req.params;
      const product = await productService.updateProduct(pid, updateProduct);
      res.status(200).send({ status: "success", payload: product });
    } catch (error) {
      logger.error("productRouterMongo Update Error", error);
    }
  };

  deleteProduct = async (req, res) => {
    try {
      // let { pid } = req.params;
      let { pid } = req.body;
      console.log("REQ.BODY : ", req.body);
      console.log("PID :", pid);

      let userEmail = req.user.email;
      let result;

      let producto = await productService.getProductById(pid);

      if (producto.owner == userEmail) {
        result = await productService.deleteProduct(pid);
      } else if (producto.owner == "admin") {
        result = await productService.deleteProduct(pid);
      } else {
        result = "El producto no le pertenece o el rol no es admin ";
      }

      res.status(200).send({ status: "success", message: "Producto agregado", payload: result });
    } catch (error) {
      logger.error("productRouterMongo Delete Error", error);
    }
  };

  mockingProducts = async (req, res) => {
    try {
      let mockproducts = [];
      for (let i = 0; i < 100; i++) {
        mockproducts.push(generateProductsFaker());
      }
      res.send({ status: "success", payload: mockproducts });
    } catch (error) {
      logger.error("mockingProducts Error", error);
    }
  };
}

module.exports = { ProductController };
