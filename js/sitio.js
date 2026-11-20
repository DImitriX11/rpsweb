(function () {
  "use strict";

  /* Menú del celular */
  var burger = document.getElementById("burger");
  var menu = document.getElementById("menu");
  function cerrar() {
    menu.classList.remove("abierto");
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Abrir menú");
  }
  if (burger && menu) {
    burger.addEventListener("click", function () {
      var abierto = menu.classList.toggle("abierto");
      burger.setAttribute("aria-expanded", abierto ? "true" : "false");
      burger.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
    });
    menu.addEventListener("click", function (e) { if (e.target.closest("a")) cerrar(); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("abierto")) { cerrar(); burger.focus(); }
    });
  }

  /* Los enlaces "Cotizar ..." dejan elegido el servicio en el formulario */
  var servicio = document.getElementById("cf-servicio");
  document.addEventListener("click", function (e) {
    var a = e.target.closest("[data-servicio]");
    if (!a || !servicio) return;
    for (var i = 0; i < servicio.options.length; i++) {
      if (servicio.options[i].text === a.getAttribute("data-servicio")) { servicio.selectedIndex = i; break; }
    }
  });

  /* Formulario de cotización -> WhatsApp (sitio estático, sin servidor). Mismo mecanismo de antes. */
  var form = document.getElementById("cotizarForm");
  var estado = document.getElementById("estado");
  if (!form) return;
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var v = function (id) { var el = document.getElementById(id); return el ? el.value.trim() : ""; };
    var nombre = v("cf-nombre"), empresa = v("cf-empresa"), telefono = v("cf-telefono"),
        email = v("cf-email"), ciudad = v("cf-ciudad"), serv = v("cf-servicio"), mensaje = v("cf-mensaje");

    if (!nombre || !telefono || !serv) {
      var faltan = [];
      if (!nombre) faltan.push("su nombre");
      if (!telefono) faltan.push("su teléfono");
      if (!serv) faltan.push("el servicio");
      estado.textContent = "Falta " + faltan.join(", ") + ".";
      var primero = !nombre ? "cf-nombre" : (!telefono ? "cf-telefono" : "cf-servicio");
      document.getElementById(primero).focus();
      return;
    }

    var lineas = [
      "Hola, quiero solicitar una cotización de seguridad.",
      "Nombre: " + nombre,
      empresa ? "Empresa: " + empresa : null,
      "Teléfono: " + telefono,
      email ? "Correo: " + email : null,
      ciudad ? "Ciudad: " + ciudad : null,
      "Servicio: " + serv,
      mensaje ? "Mensaje: " + mensaje : null
    ].filter(Boolean).join("\n");

    var url = "https://wa.me/593963720346?text=" + encodeURIComponent(lineas);
    estado.textContent = "Abriendo WhatsApp con su solicitud…";
    var w = window.open(url, "_blank", "noopener");
    if (!w) window.location.href = url; /* si el navegador bloquea la ventana */
  });
})();
