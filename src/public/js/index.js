console.log("Este es el index.js");
// const CartManagerMongo = require("../../managerDaos/mongo/cart.mongo");
// import CartManagerMongo from "../../managerDaos/mongo/cart.mongo";
// const cmm = new CartManagerMongo();

// const agregarAlCart = async () => {
//   try {
//     console.log("asdddd");
//     let inputId = document.getElementById("inputId");
//     let cid = inputId.value;
//     let botonAgregar = document.getElementById("botonAgregar");
//     let pid = botonAgregar.value;
//     let quantity = 1;

//     console.log(pid);
//     console.log(cid);

//     cmm.updateProduct(cid, pid, quantity);
//     console.log("Producto agregado al carrito");
//   } catch (error) {
//     console.log("agregarAlCart ERROR", error);
//   }
// };

//___________________________________________________________________________
//Cambia el fetch para recibir el token desde el login
const formLogin = document.querySelector("#loginForm");
formLogin.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = new FormData(formLogin);
  const obj = {};
  data.forEach((value, key) => (obj[key] = value));

  fetch("/api/session/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(obj),
  })
    .then((respuesta) => respuesta.json())
    .then((respuesta) => {
      console.log(respuesta);
      //almacena el localStorage del navegador el key-value indicado
      localStorage.setItem("token", respuesta.access_token);
    });
});

//Recu password
const recuPassForm = document.querySelector("#RecupassForm");
recuPassForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = new FormData(recuPassForm);
  const obj = {};
  console.log(data);
  data.forEach((value, key) => (obj[key] = value));

  fetch("/api/session/recupass", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(obj),
  })
    .then((respuesta) => respuesta.json())
    .then((respuesta) => {
      console.log(respuesta);
    });
});

//Nueva password
const nuevaPassForm = document.querySelector("#nuevaPassForm");
nuevaPassForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(nuevaPassForm);
  const obj = {};
  console.log(data);
  data.forEach((value, key) => (obj[key] = value));

  fetch("/api/session/nuevapass", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(obj),
  })
    .then((respuesta) => respuesta.json())
    .then((respuesta) => {
      console.log(respuesta);
    });
});
