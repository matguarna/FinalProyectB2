console.log("index del front");

//Solicita o envia datos. Es get por defecto
fetch("http://localhost:8080/api/productos/", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
  //   body: {
  //     "nombre": "asdsa"
  //   }
})
  .then((respuesta) => respuesta.json())
  .then((respuesta) => {
    console.log(respuesta.payload);
    //const productospayload = respuesta.payload;
    let html = ` `;
    const listaproductos = document.querySelector("#productList");
    respuesta.payload.map((producto) => {
      return (html += `<div class="card w-25">
        <div class="card-header">
        ${producto.title}</div>
        <div class="card-body">
        Precio: ${producto.price}</div>
        <div class="card-footer">
          <button class="btn btn-outline-primary">Detalle</button>
        </div>
      </div>`);
    });
    listaproductos.innerHTML = html;
  })
  .catch((error) => console.log(error));
