/* =========================================================
   Asesoría Financiera — comportamiento de la página
   ========================================================= */
(function () {
  "use strict";

  var CFG = window.SITE_CONFIG || {};

  /* ---------- Año en el pie ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- Política de tratamiento de datos (modal) ---------- */
  var policy = document.getElementById("policyModal");

  if (policy) {
    var ultimoFoco = null;

    var abrirPolitica = function () {
      ultimoFoco = document.activeElement;
      if (typeof policy.showModal === "function") {
        policy.showModal();
      } else {
        policy.setAttribute("open", "");
      }
      document.body.classList.add("modal-open");
      var cerrar = policy.querySelector("[data-close-policy]");
      if (cerrar) cerrar.focus();
    };

    var cerrarPolitica = function () {
      if (typeof policy.close === "function" && policy.open) {
        policy.close();
      } else {
        policy.removeAttribute("open");
      }
    };

    document.querySelectorAll("[data-open-policy]").forEach(function (btn) {
      btn.addEventListener("click", abrirPolitica);
    });

    policy.querySelectorAll("[data-close-policy]").forEach(function (btn) {
      btn.addEventListener("click", cerrarPolitica);
    });

    /* Clic en el fondo oscuro: cerrar. */
    policy.addEventListener("click", function (e) {
      if (e.target === policy) cerrarPolitica();
    });

    policy.addEventListener("close", function () {
      document.body.classList.remove("modal-open");
      if (ultimoFoco && typeof ultimoFoco.focus === "function") ultimoFoco.focus();
    });
  }

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

      /* Trampa antispam: los robots rellenan todos los campos, incluidos los
         que una persona no llega a ver. Si viene con contenido, fingimos que
         todo ha ido bien y no enviamos nada. */
      var trampa = document.getElementById("_honey");
      if (trampa && trampa.value) {
        setStatus("¡Solicitud enviada! Te responderé en menos de 24 h laborables.", "ok");
        form.reset();
        return;
      }

      var datos = {
        nombre: document.getElementById("nombre").value.trim(),
        email: document.getElementById("email").value.trim(),
        telefono: document.getElementById("telefono").value.trim() || "No indicado",
        servicio: document.getElementById("servicio").value,
        preferencia: document.getElementById("contacto-pref").value,
        origen: document.getElementById("origen").value || "No indicado",
        mensaje: document.getElementById("mensaje").value.trim()
      };

      var asunto = "Nueva solicitud: " + datos.servicio + " — " + datos.nombre;

      /* Sin endpoint configurado: abrimos el cliente de correo del visitante. */
      if (!CFG.formEndpoint) {
        var cuerpo =
          "Nombre: " + datos.nombre + "\n" +
          "Email: " + datos.email + "\n" +
          "Teléfono: " + datos.telefono + "\n" +
          "Servicio de interés: " + datos.servicio + "\n" +
          "Prefiere contacto por: " + datos.preferencia + "\n" +
          "Cómo conoció los servicios: " + datos.origen + "\n\n" +
          "Mensaje:\n" + datos.mensaje;

        window.location.href = "mailto:" + (CFG.email || "") +
          "?subject=" + encodeURIComponent(asunto) +
          "&body=" + encodeURIComponent(cuerpo);

        setStatus("Se abrirá tu programa de correo con la solicitud lista para enviar. " +
                  "Si no ocurre nada, escríbeme directamente a " + (CFG.email || "") + ".", "ok");
        return;
      }

      /* Con endpoint configurado: envío en segundo plano. Las claves van con
         nombre legible porque son las etiquetas que se verán en el email. */
      var carga = {
        "Nombre": datos.nombre,
        "Email": datos.email,
        "Teléfono": datos.telefono,
        "Servicio de interés": datos.servicio,
        "Prefiere contacto por": datos.preferencia,
        "Cómo conoció los servicios": datos.origen,
        "Mensaje": datos.mensaje
      };

      /* Campos de control propios de FormSubmit; otros proveedores los ignoran. */
      if (/formsubmit\.co/.test(CFG.formEndpoint)) {
        carga._subject = asunto;
        carga._template = "table";
        carga._captcha = "false";
        carga._replyto = datos.email;
      }

      submitBtn.disabled = true;
      var textoOriginal = submitBtn.textContent;
      submitBtn.textContent = "Enviando…";
      setStatus("Enviando tu solicitud…");

      /* Si el envío no sale (sin cobertura, servicio caído o una política de
         seguridad que bloquea la petición), ofrecemos la misma solicitud como
         borrador de correo para que el visitante no pierda lo que ha escrito. */
      var fallo = function (motivo) {
        if (window.console && console.warn) console.warn("Envío fallido:", motivo);

        setStatus("No he podido enviar el formulario desde aquí. Puedes " +
                  "enviármelo por correo con un clic:", "error");

        if (!status) return;

        var enlace = document.createElement("a");
        enlace.className = "form-fallback";
        enlace.textContent = "Enviar por correo";
        enlace.href = "mailto:" + (CFG.email || "") +
          "?subject=" + encodeURIComponent(asunto) +
          "&body=" + encodeURIComponent(
            "Nombre: " + datos.nombre + "\n" +
            "Email: " + datos.email + "\n" +
            "Teléfono: " + datos.telefono + "\n" +
            "Servicio de interés: " + datos.servicio + "\n" +
            "Prefiere contacto por: " + datos.preferencia + "\n" +
            "Cómo conoció los servicios: " + datos.origen + "\n\n" +
            "Mensaje:\n" + datos.mensaje);

        status.appendChild(document.createElement("br"));
        status.appendChild(enlace);
      };

      /* Cortamos a los 15 s para no dejar el botón bloqueado si no hay respuesta. */
      var control = typeof AbortController === "function" ? new AbortController() : null;
      var reloj = window.setTimeout(function () {
        if (control) control.abort();
      }, 15000);

      var opciones = {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(carga)
      };
      if (control) opciones.signal = control.signal;

      fetch(CFG.formEndpoint, opciones)
        .then(function (res) {
          return res.text().then(function (texto) {
            var cuerpo = {};
            try { cuerpo = JSON.parse(texto); } catch (err) { cuerpo = {}; }
            return { ok: res.ok, status: res.status, cuerpo: cuerpo, texto: texto };
          });
        })
        .then(function (res) {
          /* FormSubmit responde 200 con success:"false" mientras la dirección
             de destino no está confirmada: no es un envío entregado. */
          var entregado = res.ok &&
            (res.cuerpo.success === undefined ||
             String(res.cuerpo.success) === "true");

          if (!entregado) {
            fallo("HTTP " + res.status + " — " + (res.cuerpo.message || res.texto).slice(0, 200));
            return;
          }

          form.reset();
          campos.forEach(function (campo) { mostrarError(campo, ""); });
          setStatus("¡Solicitud enviada! Te responderé en menos de 24 h laborables.", "ok");
        })
        .catch(function (err) {
          fallo(err && err.name === "AbortError" ? "tiempo de espera agotado" : err);
        })
        .then(function () {
          window.clearTimeout(reloj);
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
