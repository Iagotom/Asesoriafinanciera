/* =========================================================
   Asesoría Financiera — comportamiento de la página
   ========================================================= */
(function () {
  "use strict";

  var CFG = window.SITE_CONFIG || {};

  /* ---------- Año en el pie ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- Datos de contacto ---------- */
  var emailLink = document.getElementById("contactEmail");
  if (emailLink && CFG.email) {
    emailLink.textContent = CFG.email;
    emailLink.href = "mailto:" + CFG.email;
  }

  var phoneLink = document.getElementById("contactPhone");
  if (phoneLink && CFG.telefono) {
    phoneLink.textContent = CFG.telefono;
    phoneLink.href = "tel:" + (CFG.telefonoLink || CFG.telefono).replace(/\s/g, "");
  }

  /* ---------- Enlaces de WhatsApp ---------- */
  function whatsappUrl(mensaje) {
    return "https://wa.me/" + (CFG.whatsapp || "") +
           "?text=" + encodeURIComponent(mensaje || "");
  }

  document.querySelectorAll("[data-whatsapp]").forEach(function (el) {
    el.href = whatsappUrl(el.getAttribute("data-whatsapp"));
    el.target = "_blank";
    el.rel = "noopener noreferrer";
  });

  /* ---------- Menú móvil ---------- */
  var nav = document.getElementById("nav");
  var navToggle = document.getElementById("navToggle");

  if (nav && navToggle) {
    navToggle.addEventListener("click", function () {
      var abierto = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(abierto));
      navToggle.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
    });

    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        nav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.focus();
      }
    });
  }

  /* ---------- Sombra del header al hacer scroll ---------- */
  var header = document.getElementById("header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Botones "Contratar": preseleccionan el servicio ---------- */
  var servicioSelect = document.getElementById("servicio");

  document.querySelectorAll("[data-service]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var servicio = btn.getAttribute("data-service");

      if (servicioSelect) {
        var encontrado = Array.prototype.some.call(servicioSelect.options, function (opt) {
          if (opt.text === servicio) {
            servicioSelect.value = opt.value || opt.text;
            return true;
          }
          return false;
        });
        if (!encontrado) servicioSelect.selectedIndex = 0;
      }

      var destino = document.getElementById("contacto");
      if (destino) destino.scrollIntoView({ behavior: "smooth", block: "start" });

      var mensaje = document.getElementById("mensaje");
      if (mensaje && !mensaje.value.trim()) {
        mensaje.placeholder = "Me interesa el servicio de " + servicio +
          ". Te cuento brevemente mi situación…";
      }

      window.setTimeout(function () {
        var nombre = document.getElementById("nombre");
        if (nombre) nombre.focus({ preventScroll: true });
      }, 600);
    });
  });

  /* ---------- Validación y envío del formulario ---------- */
  var form = document.getElementById("contactForm");
  var status = document.getElementById("formStatus");
  var submitBtn = document.getElementById("submitBtn");

  var MENSAJES = {
    nombre: "Indícame tu nombre para poder dirigirme a ti.",
    email: "Necesito un email válido para responderte.",
    telefono: "Revisa el teléfono: solo números, espacios y el prefijo +.",
    servicio: "Selecciona el servicio que te interesa.",
    mensaje: "Cuéntame brevemente tu situación (al menos 10 caracteres).",
    privacidad: "Debes aceptar el tratamiento de tus datos para continuar."
  };

  function mostrarError(campo, texto) {
    var aviso = form.querySelector('[data-error-for="' + campo.id + '"]');
    if (aviso) aviso.textContent = texto || "";
    if (texto) {
      campo.setAttribute("aria-invalid", "true");
    } else {
      campo.removeAttribute("aria-invalid");
    }
  }

  function validarCampo(campo) {
    var valor = (campo.value || "").trim();
    var error = "";

    switch (campo.id) {
      case "nombre":
        if (valor.length < 2) error = MENSAJES.nombre;
        break;
      case "email":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor)) error = MENSAJES.email;
        break;
      case "telefono":
        if (valor && !/^\+?[\d\s().-]{6,20}$/.test(valor)) error = MENSAJES.telefono;
        break;
      case "servicio":
        if (!valor) error = MENSAJES.servicio;
        break;
      case "mensaje":
        if (valor.length < 10) error = MENSAJES.mensaje;
        break;
      case "privacidad":
        if (!campo.checked) error = MENSAJES.privacidad;
        break;
    }

    mostrarError(campo, error);
    return !error;
  }

  function setStatus(texto, tipo) {
    if (!status) return;
    status.textContent = texto;
    status.className = "form-note" + (tipo ? " is-" + tipo : "");
  }

  if (form) {
    var campos = ["nombre", "email", "telefono", "servicio", "mensaje", "privacidad"]
      .map(function (id) { return document.getElementById(id); })
      .filter(Boolean);

    /* Si el aviso de error general ya no aplica, lo retiramos. */
    function limpiarAvisoGeneral() {
      if (!status || !status.classList.contains("is-error")) return;
      var quedanErrores = form.querySelectorAll('[aria-invalid="true"]').length > 0;
      if (!quedanErrores) setStatus("");
    }

    campos.forEach(function (campo) {
      var evento = campo.type === "checkbox" || campo.tagName === "SELECT" ? "change" : "blur";
      campo.addEventListener(evento, function () {
        validarCampo(campo);
        limpiarAvisoGeneral();
      });
      campo.addEventListener("input", function () {
        if (campo.getAttribute("aria-invalid") === "true") {
          validarCampo(campo);
          limpiarAvisoGeneral();
        }
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var primerError = null;
      campos.forEach(function (campo) {
        if (!validarCampo(campo) && !primerError) primerError = campo;
      });

      if (primerError) {
        setStatus("Revisa los campos marcados antes de enviar.", "error");
        primerError.focus();
        return;
      }

      var datos = {
        nombre: document.getElementById("nombre").value.trim(),
        email: document.getElementById("email").value.trim(),
        telefono: document.getElementById("telefono").value.trim() || "No indicado",
        servicio: document.getElementById("servicio").value,
        preferencia: document.getElementById("contacto-pref").value,
        mensaje: document.getElementById("mensaje").value.trim()
      };

      /* Sin endpoint configurado: abrimos el cliente de correo del visitante. */
      if (!CFG.formEndpoint) {
        var cuerpo =
          "Nombre: " + datos.nombre + "\n" +
          "Email: " + datos.email + "\n" +
          "Teléfono: " + datos.telefono + "\n" +
          "Servicio de interés: " + datos.servicio + "\n" +
          "Prefiere contacto por: " + datos.preferencia + "\n\n" +
          "Mensaje:\n" + datos.mensaje;

        var asunto = "Solicitud de " + datos.servicio + " — " + datos.nombre;

        window.location.href = "mailto:" + (CFG.email || "") +
          "?subject=" + encodeURIComponent(asunto) +
          "&body=" + encodeURIComponent(cuerpo);

        setStatus("Se abrirá tu programa de correo con la solicitud lista para enviar. " +
                  "Si no ocurre nada, escríbeme a " + (CFG.email || "") + ".", "ok");
        return;
      }

      /* Con endpoint configurado: envío por AJAX. */
      submitBtn.disabled = true;
      var textoOriginal = submitBtn.textContent;
      submitBtn.textContent = "Enviando…";
      setStatus("Enviando tu solicitud…");

      fetch(CFG.formEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(datos)
      })
        .then(function (res) {
          if (!res.ok) throw new Error("HTTP " + res.status);
          form.reset();
          campos.forEach(function (campo) { mostrarError(campo, ""); });
          setStatus("¡Solicitud enviada! Te responderé en menos de 24 h laborables.", "ok");
        })
        .catch(function () {
          setStatus("No he podido enviar el formulario. Escríbeme directamente a " +
                    (CFG.email || "") + " o por WhatsApp.", "error");
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = textoOriginal;
        });
    });
  }

  /* ---------- Aparición progresiva al hacer scroll ---------- */
  var reveals = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });

    reveals.forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 70 + "ms";
      observer.observe(el);
    });
  }
})();
