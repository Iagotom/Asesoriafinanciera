# IT Asesor Financiero — web de servicios

Web estática de una página para presentar y **contratar servicios de asesoría
financiera**. Sin dependencias, sin build: HTML, CSS y JavaScript planos.

## Estructura

```
index.html                 Toda la página (hero, servicios, proceso, sobre mí, FAQ, contacto)
.github/workflows/         Publicación automática en GitHub Pages
assets/styles.css          Estilos y paleta de marca
assets/config.js           ← DATOS DE CONTACTO (edita solo esto)
assets/opiniones.js        ← OPINIONES DE CLIENTES (edita solo esto)
assets/img/                Fotografía del perfil
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

## Sección «Quién soy»: dos huecos por rellenar

En `index.html`, buscables con `grep -n "HUECO" index.html`:

- **HUECO 1 — Tu historia.** Dos párrafos: cómo llegaste a la asesoría financiera
  y a quién ayudas. El texto entre corchetes son indicaciones, no contenido:
  hay que sustituirlo.
- **HUECO 2 — Formación y trayectoria.** Cada `<div class="hito">` es un año más
  una línea. Añade o quita los que necesites.

### La fotografía

Ahora hay una imagen de relleno. Para poner la tuya:

1. Guarda tu foto en `assets/img/foto.jpg` (vertical, proporción 5:6, unos
   1000 × 1200 px va sobrado).
2. En `index.html`, cambia el `src` a `assets/img/foto.jpg`.
3. Ajusta el `alt` si quieres describirla mejor. El `alt` no es decorativo: es
   lo que oye quien no puede ver la imagen.

## Opiniones de clientes

Se publican editando **`assets/opiniones.js`**: añades un bloque con `texto`,
`nombre` y, si quieres, `detalle` y `fecha`. La sección aparece sola en la web
—y su enlace en el menú— cuando hay al menos una; con la lista vacía no se
muestra, para que no quede un apartado desierto.

El texto se inserta como texto, nunca como HTML, así que una opinión con
etiquetas dentro se muestra literal y no puede ejecutar nada.

**Antes de publicar cualquiera** (está también recordado dentro del archivo):

1. Consentimiento por escrito de esa persona, guardado.
2. Sin retocar el sentido de lo que escribió. Inventar opiniones es publicidad
   engañosa.
3. Sin cifras de rentabilidad ni promesas de resultados: en servicios
   financieros es justo lo que la normativa de comunicaciones comerciales no
   permite.
4. Sin datos que permitan identificar la situación patrimonial de nadie.

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
| `--brand-granate-light` | `#8C3A4F` | Acento |
| `--brand-beige` | `#E8DCC8` | Fondo general de la web |
| `--brand-beige-light` | `#F5EFE3` | Secciones alternas y paneles |
| `--brand-cream` | `#FBF8F2` | Campos de formulario, resplandor del hero |
| `--brand-gold` | `#B08B4F` | Detalles: etiquetas, filetes, comillas |

Cambiar cualquiera de estos valores actualiza toda la web.

## Accesibilidad

La web está preparada para lectores de pantalla y navegación por teclado, y
**supera la auditoría de axe-core sin incumplimientos** en WCAG 2.1 AA en cuatro
estados: página completa, política abierta, formulario con errores y móvil con el
menú desplegado.

Qué incluye concretamente:

- **Dos atajos de teclado** al principio: al contenido y directo al formulario.
- **Regiones con nombre** (`aria-labelledby`), para saltar entre secciones.
- **Un solo `h1`** y jerarquía de encabezados sin saltos, que es el índice por el
  que navega quien no ve la página.
- **`role="list"` en todas las listas**: al quitar los puntos con CSS, VoiceOver
  deja de anunciarlas como listas, y el role lo devuelve.
- **Botones con nombre propio**: los cuatro «Contratar» se anuncian como
  «Contratar: Plan financiero personal», etc., en lugar de cuatro nombres
  idénticos.
- **Formulario**: cada campo con etiqueta asociada, los obligatorios anunciados
  como tal (`aria-required` y texto audible), y cada mensaje de error vinculado a
  su campo (`aria-describedby`) y con `role="alert"` para que se lea al aparecer.
- **Al enviar vacío** se anuncia cuántos campos faltan y el foco salta al primero.
- **Al pulsar «Contratar»** se anuncia qué servicio se ha seleccionado, para que
  el salto de foco al formulario no resulte desconcertante.
- **La política** se abre en un `<dialog>` nativo: atrapa el foco, se cierra con
  Escape y devuelve el foco al botón que la abrió.
- **Contraste comprobado**: 12,5:1 en titulares y 6,4:1 en el cuerpo sobre el
  beige. El gris del texto pequeño se oscureció a `#6F5760` para superar el 4,5:1.

## Notas

- Diseño adaptable a móvil, tableta y escritorio.
- **Sin tema oscuro a propósito**: la web usa siempre la paleta de marca, porque
  el beige es parte de la identidad. `color-scheme: light` evita además que el
  navegador oscurezca por su cuenta los campos del formulario.
- Respeta `prefers-reduced-motion`.
- Los textos de servicios, precios («Sesión única», «Proyecto cerrado») y el
  horario de atención son propuestas: ajústalos a tu oferta real en `index.html`.
- El pie incluye un **aviso legal** y un botón que abre la política de
  tratamiento de datos completa. Conviene que un profesional los revise antes de
  publicar y añadir los datos fiscales que exija la normativa aplicable.
