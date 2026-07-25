# Asesoría Financiera — web de servicios

Web estática de una página para presentar y **contratar servicios de asesoría
financiera**. Sin dependencias, sin build: HTML, CSS y JavaScript planos.

## Estructura

```
index.html            Toda la página (hero, servicios, proceso, sobre mí, FAQ, contacto)
assets/styles.css     Estilos y paleta de marca
assets/config.js      ← DATOS DE CONTACTO (edita solo esto)
assets/script.js      Menú, validación del formulario, WhatsApp, animaciones
assets/favicon.svg    Icono de pestaña
```

## Puesta en marcha

Abre `index.html` en el navegador. Para servirla en local:

```bash
python3 -m http.server 8000   # → http://localhost:8000
```

## Antes de publicar: 3 cosas que debes rellenar

Todo está en **`assets/config.js`**:

| Campo | Qué poner |
| --- | --- |
| `email` | Tu email de contacto real |
| `telefono` / `telefonoLink` | Tu teléfono (visible / para el enlace de llamada) |
| `whatsapp` | Tu número internacional **sin** `+`, espacios ni guiones (ej. `34600123456`) |

Los valores actuales de teléfono y WhatsApp son **de ejemplo** (`+34 600 000 000`)
y hay que sustituirlos.

### Formulario de contacto

Funciona de dos maneras, según `formEndpoint` en `config.js`:

- **Vacío (por defecto)** — al enviar se abre el programa de correo del visitante
  con la solicitud ya redactada hacia tu email. No necesita servidor.
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
- El pie incluye un **aviso legal** y una nota de protección de datos genéricos.
  Revísalos con un profesional antes de publicar, y añade los datos fiscales que
  te exija la normativa aplicable.
