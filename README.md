# Núcleo Asesoría Financiera — sitio web

Sitio web estático (landing page) para una asesoría financiera independiente.
Sin dependencias, sin paso de compilación: se sirve tal cual.

## Estructura

```
.
├── index.html              Página completa (todas las secciones)
├── assets/
│   ├── css/styles.css      Estilos: tokens, componentes, secciones, responsive
│   ├── js/main.js          Tema, navegación, calculadora, validación, animaciones
│   └── img/                Imágenes (vacío por ahora; los iconos son SVG en línea)
└── README.md
```

## Secciones

| Sección       | Ancla          | Contenido                                                |
|---------------|----------------|----------------------------------------------------------|
| Hero          | `#inicio`      | Propuesta de valor, CTA y tarjeta ilustrativa con gráfico |
| Cifras        | —              | Contadores animados                                       |
| Servicios     | `#servicios`   | Seis áreas de asesoramiento                               |
| Proceso       | `#proceso`     | Cuatro pasos de trabajo                                   |
| Calculadora   | `#calculadora` | Interés compuesto interactivo                             |
| Nosotros      | `#nosotros`    | Posicionamiento *fee-only* y testimonio                   |
| Preguntas     | `#faq`         | Cinco preguntas frecuentes (`<details>`)                  |
| Contacto      | `#contacto`    | Datos de contacto y formulario validado                   |

## Ejecutar en local

Basta con abrir `index.html` en el navegador. Para servirlo por HTTP:

```bash
python3 -m http.server 8000
# http://localhost:8000
```

## Características

- **Responsive** de 320 px a escritorio, con menú hamburguesa por debajo de 820 px.
- **Tema claro/oscuro**: sigue la preferencia del sistema y permite forzarlo desde
  el botón de la cabecera (se guarda en `localStorage`).
- **Accesibilidad**: enlace de salto al contenido, HTML semántico, estados de foco
  visibles, `aria-*` en menú y formulario, y respeto por `prefers-reduced-motion`.
- **Sin dependencias externas**: tipografías del sistema e iconos SVG en línea, así
  que no hay peticiones a terceros ni cookies.

## Pendiente antes de publicar

1. **Conectar el formulario.** `assets/js/main.js` valida en cliente pero no envía
   nada; hay un `TODO` marcado donde va el `fetch()` al backend o al servicio de
   formularios (Formspree, Netlify Forms, etc.).
2. **Sustituir los datos de ejemplo**: nombre comercial, teléfono, correo,
   dirección, cifras de la franja, precios del FAQ y el testimonio.
3. **Páginas legales**: aviso legal, privacidad y cookies están enlazados como
   anclas (`#aviso-legal`, `#privacidad`, `#cookies`) y aún no existen. Obligatorio
   en España antes de recoger datos personales por el formulario.
4. **Registro regulatorio**: si la actividad requiere alta como asesor financiero,
   incluir los datos identificativos correspondientes en el pie y el aviso legal.
5. Añadir imagen `og:image` para las tarjetas de redes sociales.

## Despliegue

Al ser estático, sirve cualquier hosting:

- **GitHub Pages**: Settings → Pages → *Deploy from a branch* y elige la rama.
- **Netlify / Vercel / Cloudflare Pages**: sin comando de build, directorio raíz `.`.

## Aviso

Los contenidos, cifras y precios de la página son **ejemplos de maquetación**, no
información comercial real. La calculadora de interés compuesto es ilustrativa: no
descuenta inflación, comisiones ni impuestos.
