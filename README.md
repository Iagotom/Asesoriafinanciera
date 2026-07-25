# IT Asesor Financiero — web de servicios

Web estática de una página para presentar y **contratar servicios de asesoría
financiera**. Sin dependencias, sin build: HTML, CSS y JavaScript planos.

## Estructura

```
index.html                 Toda la página (hero, servicios, proceso, sobre mí, FAQ, contacto)
assets/styles.css          Estilos y paleta de marca
assets/config.js           ← DATOS DE CONTACTO (edita solo esto)
assets/script.js           Menú, modal de la política, validación del formulario
assets/favicon.svg         Icono de pestaña
tools/build-standalone.py  Genera la web en un único archivo (dist/index.html)
```

## Versión en un solo archivo

Para compartir la web por un enlace o abrirla sin la carpeta `assets/`:

```bash
python3 tools/build-standalone.py     # → dist/index.html, autocontenido
```

Incrusta estilos, configuración, script y favicon en un único HTML. Vuelve a
ejecutarlo cada vez que cambies algo en `index.html` o en `assets/`.

## Puesta en marcha

Abre `index.html` en el navegador. Para servirla en local:

```bash
python3 -m http.server 8000   # → http://localhost:8000
```

## Datos ya configurados

- **Responsable del tratamiento:** Iago Nicolás Tomassi, NIE Z4517048Z. Aparece
  en la política de tratamiento de datos, dentro de `<dialog id="policyModal">`
  en `index.html`.
- **Email:** `contactoiagotomassi@gmail.com`. Está en `assets/config.js` como
  destinatario del formulario y en la política como dirección para ejercer los
  derechos de protección de datos, donde el RGPD obliga a publicarla.

**El formulario es la única vía de contacto de la web**: no hay WhatsApp, ni
teléfono, ni el email a la vista fuera de la política.

### Formulario de contacto

Funciona de dos maneras, según `formEndpoint` en `config.js`:

- **Vacío (por defecto)** — al enviar se abre el programa de correo del visitante
  con la solicitud ya redactada hacia tu email. No necesita servidor, pero falla
  en móviles sin cliente de correo configurado.
- **Con endpoint** — pega una URL de [Formspree](https://formspree.io),
  Getform o Basin y los envíos llegarán a tu email por AJAX, sin salir de la web.
  Es la opción recomendada en producción, porque `mailto:` falla en móviles
  sin cliente de correo configurado.

## Paleta de marca

Definida como variables CSS al inicio de `assets/styles.css`:

| Variable | Color | Uso |
| --- | --- | --- |
| `--brand-granate-deep` | `#4A1825` | Fondos oscuros, pie de página |
| `--brand-granate` | `#6D2235` | Color principal, botones |
| `--brand-granate-light` | `#8C3A4F` | Acento, modo oscuro |
| `--brand-beige` | `#E8DCC8` | Beige cálido, degradados |
| `--brand-beige-light` | `#F5EFE3` | Fondos de sección |
| `--brand-cream` | `#FBF8F2` | Fondo general |
| `--brand-gold` | `#B08B4F` | Detalles: etiquetas, filetes, comillas |

Cambiar cualquiera de estos valores actualiza toda la web.

## Notas

- Responsive, accesible (navegación por teclado, `aria-*`, texto alternativo) y
  con **modo oscuro automático** según las preferencias del sistema.
- Respeta `prefers-reduced-motion`.
- Los textos de servicios, precios («Sesión única», «Proyecto cerrado») y el
  horario de atención son propuestas: ajústalos a tu oferta real en `index.html`.
- El tema oscuro se resuelve **solo con variables CSS**, por lo que respeta tanto
  la preferencia del sistema como un `data-theme="dark"` o `"light"` explícito en
  la etiqueta raíz.
- El pie incluye un **aviso legal** y un botón que abre la política de
  tratamiento de datos completa. Conviene que un profesional los revise antes de
  publicar y añadir los datos fiscales que exija la normativa aplicable.
