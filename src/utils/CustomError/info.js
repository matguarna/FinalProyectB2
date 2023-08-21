exports.generateUserErrorInfo = (user) => {
  return `Una o mas propiedades estan incompletas o invalidas.
  Listado de requerimientos de propiedades del user: 
  *first_name: necesita un String, recibió ${user.first_name}.
  *last_name: necesita un String, recibió ${user.last_name}.
  *username: necesita un String, recibió ${user.bodyUsername}.
  *email: necesita un String, recibió ${user.bodyMail}.`;
};

exports.addProductErrorInfo = (newProduct) => {
  return `Una o mas propiedades estan incompletas o invalidas.
  Listado de requerimientos de propiedades del nuevo producto: 
  *title: necesita un String, recibió ${newProduct.title}.
  *descripcion necesita un String, recibió ${newProduct.descripcion}.
  *thumbnail: necesita un String, recibió ${newProduct.thumbnail}.
  *price: necesita un Number, recibió ${newProduct.price}.
  *stock: necesita un Number, recibió ${newProduct.stock}.
  *category: necesita un String, recibió ${newProduct.category}.
  *code: necesita un String, recibió ${newProduct.code}.`;
};

exports.updateCartErrorInfo = (quantity) => {
  return `La quantity debe ser 1 o mayor. Se recibió quantity: ${quantity}`;
};
