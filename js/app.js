/* ******* Inicio: Programa */
//import Swal from 'sweetalert2'

//debugger;
//console.log("001a************************* Inicio de Programa.");


//console.log("002a*********************** Creamos variables y objetos.");
let pedido = new Pedido();
//let pedido = {};
//console.log("003b********************* Crear array articulos.");
let articulos = [];
let productoscarrito;

// Checkbox para Modo Oscuro
let checkbox = document.querySelector('input[type="checkbox"]');
let checkboxtxt = document.querySelector('.texto');

// Verifica si hay alguna preferencia guardada en localStorage 'mode'
if(localStorage.getItem('mode') === 'dark') {
  document.body.classList.add('dark-mode');
  checkbox.checked = true;
  checkboxtxt.textContent = 'Modo Claro';
} else {
  document.body.classList.add('light-mode');
  checkbox.checked = false;
  checkboxtxt.textContent = 'Modo Oscuro';
}


// Se agrega un event listener para el evento 'change'
checkbox.addEventListener('change', function() {
  // Cuando el checkbox cambia, alterna entre las clases 'dark-mode' y 'light-mode' en el body
  if(this.checked) {
    document.body.classList.add('dark-mode');
    document.body.classList.remove('light-mode');
    localStorage.setItem('mode', 'dark');
    checkboxtxt.textContent = 'Modo Claro';
  } else {
    document.body.classList.add('light-mode');
    document.body.classList.remove('dark-mode');
    localStorage.setItem('mode', 'light');
    checkboxtxt.textContent = 'Modo Noche';
  }
});

//console.log("004a******************* Cargamos DB desde archivo externo .json.");
$.ajax({
  url: "./js/datos.json",
  dataType: "json",
  success: (response) => {
//    console.log("004b******************* Cargamos productos desde archivo externo .json.");
    cargarDatos(response, articulos);
//    console.log("009a***************** Usamos jquery.");
  },
});

//console.log("005a***************** para validaciones.");
$("#cantidad").keypress(soloNumeros);
$("#validar-edad").keypress(soloNumeros);
$("#pedidos").on("click", function () {
  let posicion = $("#customer").offset().top;
  $("html, body").animate({ scrollTop: posicion }, 2000);
});

$(document).ready(() => {
  //console.log("010a***************** Pagina cargada Completamente.");
  //  preguntarEdad();
});

//console.log("006a*************** Detectar LocalStorage 'carrito'.");
if (localStorage.getItem("carrito") === null) {
//console.log("006b*************** No se Detecto LocalStorage 'carrito'.");
}
else {
//  console.log("006b**************** Si se Detecto LocalStorage 'carrito'.");
//alert("Puedes agregar productos en el carrito y agregar mas o finalizar la compra mas tarde.");
/*   Swal.fire({
    title: 'Informacion',
    text:'Dispones de productos en el carrito, cuando accedas a este, se mostraran todos',
    icon: 'error',
    confirmButtonText:'Cool'}) */

  //pedido = JSON.parse(localStorage.getItem('carrito'))
  //console.log("006c***************** Cargar items de carrito (LocalStorage) en carrito de 'pedido' y Diseñar pedido.");
  //dibujarPedido();

}

if ("carrito" in localStorage) {
  //alert('yes');
  //console.log(localStorage.getItem("carrito"))
} else {
  //alert('no');
}
/* ******* Fin: Programa */




// ******* Inicio: Funciones
function Pedido() {
  //console.log("003a********************* Crear Carrito de Pedido.");
  //debugger;
  this.cliente = "";
  this.items = [];
  this.total = 0;

  let fecha = new Date();
  fecha = fecha.getDate() + "/" + fecha.getMonth() + "/" + fecha.getFullYear();
  this.fecha = fecha;
}

function soloNumeros(event) {
  //debugger;
  //console.log("020******** Validamos");
  let key = event.keyCode;
  if (key < 48 || key > 57) {
    event.preventDefault();
  }
  else {
    calcularSubtotal();
  }
}

function cargarDatos(productos, articulos) {
  //debugger;
  //console.log("007a************** Cargar Datos de productos.");
  productos.forEach((producto, indice) => {
    let articulo = new Articulo(
      producto.id,
      producto.nombre,
      producto.precio,
      producto.destacado,
      producto.imagen
    );
    articulos.push(articulo);

    if (articulo.destacado) {
      //console.log("007c************** Si Producto, es destacado, creamos su tarjeta html: " + articulo.destacado);
      generarHtmlProducto(articulo);
    }
    else {
      //console.log("007c************** Si Producto, NO es destacado, solo lo podemos seleccionar desde combobox: " + articulo.destacado);
    }
    cargarSelect(articulo);
    if (indice == 0) {
      $("#precio").val(articulo.precio);
    }
  });
}


function Articulo(id, nombre, precio, destacado, imagen) {
  //console.log("007b************ Crear Producto: " + nombre);
  //debugger;
  this.id = id;
  this.nombre = nombre;
  this.precio = precio;
  this.destacado = destacado;
  this.imagen = imagen;
}

function generarHtmlProducto(producto) {
  //debugger;
  //console.log("007d********* Crear HMTL para cada Producto: " + producto.nombre);
  let html = `<div class="col-sm col-md-6 col-xl-3 bot1">
    <img src="${producto.imagen}">
    <div class="description">
      <div class="product-name">
      ${producto.nombre}
      </div>
      <div class="price">
      $${producto.precio}
      </div>
      <button class="shop btn-principal" onclick="seleccionarProducto(${producto.id})">Agregar producto a Carrito</button>
    </div>
  </div>`;
  $("#prodlact").append(html);
}


function cargarSelect(producto) {
  //debugger;
  //console.log("008a******** Carga en Combobox/Select el Producto: " + producto.nombre);
  let option = `<option value="${producto.id}">${producto.nombre}</option>`;
  $("#prodlacteos").append(option);
}

function seleccionarProducto(productoId) {
  //debugger;
  //console.log("011a******* Clic en Boton de Agregar producto");
  let posicion = $("#customer").offset().top;
  $("html, body").animate({ scrollTop: posicion }, 1000);
  $("#prodlacteos").val(productoId).change();
}

function agregarPrecio() {
  //debugger;
  //console.log("012a******* Agregar precio y cantidad");
  $("#error").html("");
  let valor = $("#prodlacteos option:selected").val();
  let encontrado = articulos.find((articulo) => {
    return articulo.id == valor;
  });
  $("#precio").val(encontrado.precio);
  $("#cantidad").val("1");
  calcularSubtotal();
  //$("#subtotal").val("");
}

function calcularSubtotal() {
  //debugger;
  //console.log("012b******* Calcular subtotal");
  let cantidad = $("#cantidad").val();
  if (cantidad > 0) {
    $("#error").html("");
    let precio = $("#precio").val();
    let subtotal = parseInt(cantidad) * parseFloat(precio);
    $("#subtotal").val(subtotal);
  } else {
    $("#error").html("Debe ingresar cantidad");
    $("#subtotal").val("");
  }
}

function agregarProducto() {
  //console.log("013a******* Agregar Producto");
  //debugger;
  let cantidad = parseInt($("#cantidad").val());
  if (cantidad > 0) {
    $("#error").html("");
    let itemId = parseInt($("#prodlacteos").val());

    let indiceYaExiste = pedido.items.findIndex((item) => {
      return item.itemId == itemId;
    });
    if (indiceYaExiste == -1) {
      pedido.items.push({ itemId, cantidad });
    } else {
      pedido.items[indiceYaExiste].cantidad += cantidad;
    }
    $("#cantidad").val("");
    $("#subtotal").val("");
    dibujarPedido();
  } else {
    $("#error").html("Debe ingresar cantidad");
  }
}



function dibujarPedido() {
  //console.log("014a*************** Diseñar Pedido.");
  //debugger;
  let tablaHeader = `<table class="table table-hover table-dark finalizar-pedido">
  <thead>
    <tr class="items">
      <th scope="col">#</th>
      <th scope="col">Producto</th>
      <th scope="col">Cantidad</th>
      <th scope="col">Precio</th>
      <th scope="col">Subtotal</th>
      <th scope="col"></th>
    </tr>
  </thead>
  <tbody>`;
  let tablaBody = "";
  let total = 0;

  let iconoEliminar = `<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
    <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
  </svg>`;

  let iconoEliminarTodo = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash2-fill" viewBox="0 0 16 16">
  <path d="M2.037 3.225A.7.7 0 0 1 2 3c0-1.105 2.686-2 6-2s6 .895 6 2a.7.7 0 0 1-.037.225l-1.684 10.104A2 2 0 0 1 10.305 15H5.694a2 2 0 0 1-1.973-1.671zm9.89-.69C10.966 2.214 9.578 2 8 2c-1.58 0-2.968.215-3.926.534-.477.16-.795.327-.975.466.18.14.498.307.975.466C5.032 3.786 6.42 4 8 4s2.967-.215 3.926-.534c.477-.16.795-.327.975-.466-.18-.14-.498-.307-.975-.466z"/>
</svg>`;

  pedido.items.forEach((item, indice) => {
    let articulo = articulos.find((articulo) => {
      return item.itemId == articulo.id;
    });
   
    tablaBody += `<tr>
      <th scope="row">${indice + 1}</th>
      <td>${articulo.nombre}</td>
      <td>${item.cantidad}</td>
      <td>$${articulo.precio}</td>
      <td>$${parseInt(item.cantidad) * parseFloat(articulo.precio)}</td>
      <td>Eliminar Producto<span class="icono-eliminar" onclick="eliminarItem(${indice})">${iconoEliminar}</span></td>
    </tr>`;
    total += parseInt(item.cantidad) * parseFloat(articulo.precio);
  });
  let tablaFooter = `<tr>
    <td colspan="3">Vaciar Carrito <span class="icono-eliminartodo" onclick="vaciarCarrito()">${iconoEliminarTodo}</span></td>
    <td class="total">TOTAL</td>
    <td class="monto">$${total}</td>
    <td></td>
  </tr>
  </tbody>
  </table>`;
  let formCliente = `<div class="row">
      <div class="col-sm column-1">
        Nombre y Apellido:
      </div>
      <div class="col-sm column-2">
        <input class="field" type="text" name="name" id="name">
      </div>
    </div>
    <div class="row">
      <div class="col-sm column-1">
        Telefono:
      </div>
      <div class="col-sm column-2">
        <input class="field" type="text" name="phone" id="phone" >
      </div>
    </div>
    <div class="row">
      <div class="col-sm column-1">
        Dirección:
      </div>
      <div class="col-sm column-2">
        <input class="field" type="text" name="adress" id="adress">
      </div>
    </div>
    <div class="row" >
      <div class="col-sm column-1">
      </div>
      <div class="col-sm column-2">
        <div class="error" id="error-cliente"></div>
        <button class="finalizar" onclick="finalizarPedido()">FINALIZAR PEDIDO</button>
      </div>
    </div>`;
  if (pedido.items.length) {
    $("#pedido-final").html(tablaHeader + tablaBody + tablaFooter);
    if ($("#form-cliente").html() === "") {
      $("#form-cliente").html(formCliente);
    }
  } else {
    $("#pedido-final").html("");
    $("#form-cliente").html("");
  }
  localStorage.setItem('carrito', JSON.stringify(pedido));
  productoscarrito = pedido.items.length;
}

function eliminarItem(indice) {
  //debugger;
  //console.log("015a ******* Eliminacion de item");
  pedido.items.splice(indice, 1);
  dibujarPedido();
}

function vaciarCarrito() {
  //debugger;
  //console.log("016a ******* Eliminacion de Carrito");
  pedido.items.splice(0, productoscarrito);
  dibujarPedido();
  storage.clear();
}

function finalizarPedido() {
  //debugger;
  //console.log("Concluir con pedido");
  if ($("#name").val().trim() === "") {
    $("#error-cliente").html("Debe ingresar un nombre");
    return;
  }
  if ($("#phone").val().trim() === "") {
    $("#error-cliente").html("Debe ingresar un teléfono");
    return;
  }
  if ($("#adress").val().trim() === "") {
    $("#error-cliente").html("Debe ingresar una dirección");
    return;
  }
  $("#error-cliente").html("");
  let mensaje = `Muchas gracias por tu compra ${$(
    "#name"
  ).val()}, estaremos enviando tu pedido a ${$(
    "#adress"
  ).val()} en los proximos minutos`;
  $("#detalle-pedido").html(mensaje);
  $("#modal-pedido").modal();
  $("#pedido-final").html("");
  $("#form-cliente").html("");
}

function Cliente(nombre, telefono, direccion) {
  console.log("Crear Cliente");
  this.nombre = nombre;
  this.telefono = telefono;
  this.direccion = direccion;
}



// Para pago electronico
function preguntarEdad() {
  let edad = localStorage.getItem("edad");
  if (edad == null) {
    $("#modal-edad").modal("show");
  } else {
    validarEdad(edad);
  }
}

function validarEdad(edad) {
  if (edad < 18) {
    $("#modal-menor").modal("show");
    let formulario = document.getElementById("customer");
    formulario.parentNode.removeChild(formulario);
    $("#prodlact").hide();
    $("#pedidos").hide();
  }
}

function guardarEdad() {
  const edad = $("#validar-edad").val();
  if (edad.trim() != "") {
    localStorage.setItem("edad", edad);
    $("#modal-edad").modal("hide");
    validarEdad(edad);
  }
}

// ******* Fin: Funciones

