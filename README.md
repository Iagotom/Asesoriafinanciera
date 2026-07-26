# IT Asesor Financiero — web de servicios

Web estática de una página para presentar y **contratar servicios de asesoría
financiera**. Sin dependencias, sin build: HTML, CSS y JavaScript planos.

## Estructura

```
index.html                 Toda la página (hero, servicios, proceso, sobre mí, FAQ, contacto)
.github/workflows/         Publicación automática en GitHub Pages
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

Ya está conectado a **[FormSubmit](https://formsubmit.co)**, que no necesita
registro ni servidor: los envíos llegan a `contactoiagotomassi@gmail.com`.

**Queda un paso, que sólo puedes dar tú.** La primera vez que se envíe el
formulario desde la web publicada, FormSubmit manda un correo de confirmación a
esa dirección. Hasta que pulses su enlace, los envíos no se entregan y el
visitante ve el aviso de que no ha podido enviarse. Es una única vez.

Después conviene **ocultar la dirección**: FormSubmit te da un alias con forma de
token al activarla, y basta con sustituir el email en `formEndpoint`:

```js
formEndpoint: "https://formsubmit.co/ajax/a1b2c3d4e5f6..."
```

Si algún día quieres cambiar de proveedor, el código es agnóstico: pega el
endpoint de Formspree, Getform o Basin y funcionará igual.

**Si el envío falla** —sin cobertura, servicio caído o una política de seguridad
que bloquee la petición— la web no pierde lo escrito: muestra un botón «Enviar
por correo» que abre el borrador con toda la solicitud ya redactada.

El formulario incluye una **trampa antispam** (un campo invisible que sólo
rellenan los robots); si viene con contenido, el envío se descarta en silencio.

## Publicación

El repositorio trae un flujo de trabajo que publica la web en **GitHub Pages**
en cada cambio de la rama principal (`.github/workflows/pages.yml`).

Para activarlo, una sola vez: **Settings → Pages → Build and deployment →
Source: GitHub Actions**. El repositorio es público, así que Pages funciona sin
coste. La web quedará en:

```
https://iagotom.github.io/Asesoriafinanciera/
```

A partir de ahí, cada push a la rama por defecto la vuelve a publicar.

> El formulario necesita estar en un dominio real para poder contactar con
> FormSubmit. Los visores de vista previa suelen bloquear las peticiones a
> servicios externos por política de seguridad, y ahí sólo funcionará el botón
> de respaldo por correo.

## Paleta de marca

Definida como variables CSS al inicio de `assets/styles.css`:

| Variable | Color | Uso |
| --- | --- | --- |
| `--brand-granate-deep` | `#4A1825` | Fondos oscuros, pie de página |
| `--brand-granate` | `#6D2235` | Color principal, botones |
| `--brand-granate-light` | `#8C3A4F` | Acento, modo oscuro |
| `--brand-beige` | `#E8DCC8` | Fondo general de la web |
| `--brand-beige-light` | `#F5EFE3` | Secciones alternas y paneles |
| `--brand-cream` | `#FBF8F2` | Campos de formulario, resplandor del hero |
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
