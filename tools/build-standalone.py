#!/usr/bin/env python3
"""Genera una versión de la web en un único archivo HTML.

Incrusta la hoja de estilos, la configuración y el script dentro del propio
HTML, de modo que la página funcione sin carpeta `assets/`. Sirve para
compartirla por un enlace, enviarla por email o abrirla desde el móvil.

Uso:
    python3 tools/build-standalone.py            # → dist/index.html
    python3 tools/build-standalone.py --fragment # → sin <html>/<head>/<body>

La opción --fragment produce sólo el contenido (título, estilos, marcado y
script), para incrustarlo en plataformas que aportan su propio esqueleto HTML.
"""

import argparse
import base64
import pathlib
import re
import sys

RAIZ = pathlib.Path(__file__).resolve().parent.parent


def leer(ruta: str) -> str:
    return (RAIZ / ruta).read_text(encoding="utf-8")


def extraer(patron: str, texto: str, que: str) -> str:
    encontrado = re.search(patron, texto, re.S | re.I)
    if not encontrado:
        sys.exit(f"No se ha encontrado {que} en index.html")
    return encontrado.group(1)


TIPOS = {
    ".svg": "image/svg+xml",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".avif": "image/avif",
    ".gif": "image/gif",
}


def a_data_uri(ruta_relativa: str) -> str:
    """Convierte un archivo de assets/ en data URI, para no depender de él."""
    archivo = RAIZ / ruta_relativa
    if not archivo.exists():
        sys.exit(f"No existe el archivo referenciado: {ruta_relativa}")
    tipo = TIPOS.get(archivo.suffix.lower())
    if not tipo:
        sys.exit(f"Tipo de imagen no soportado: {ruta_relativa}")
    datos = base64.b64encode(archivo.read_bytes()).decode("ascii")
    return f"data:{tipo};base64,{datos}"


def incrustar_imagenes(marcado: str) -> str:
    """Sustituye los src="assets/..." de las imágenes por su data URI."""
    def reemplazo(m):
        return m.group(1) + a_data_uri(m.group(2)) + m.group(3)

    return re.sub(r'(src=")(assets/[^"]+)(")', reemplazo, marcado)


def construir(fragmento: bool) -> str:
    html = leer("index.html")
    css = leer("assets/styles.css")
    config = leer("assets/config.js")
    opiniones = leer("assets/opiniones.js")
    script = leer("assets/script.js")

    titulo = extraer(r"<title>(.*?)</title>", html, "el título")
    descripcion = extraer(
        r'<meta name="description" content="(.*?)"', html, "la descripción"
    )
    cuerpo = extraer(r"<body[^>]*>(.*)</body>", html, "el cuerpo")

    # El favicon se incrusta como data URI para no depender de assets/.
    favicon = base64.b64encode(
        (RAIZ / "assets/favicon.svg").read_bytes()
    ).decode("ascii")

    cabecera = "\n".join([
        f"<title>{titulo}</title>",
        f'<meta name="description" content="{descripcion}">',
        f'<link rel="icon" href="data:image/svg+xml;base64,{favicon}">',
        '<script>document.documentElement.classList.add("js");</script>',
        f"<style>\n{css}\n</style>",
    ])

    marcado = cuerpo
    for etiqueta in ("config.js", "opiniones.js", "script.js"):
        marcado = marcado.replace(f'<script src="assets/{etiqueta}"></script>', "")
    marcado = incrustar_imagenes(marcado).strip()

    codigo = f"<script>\n{config}\n{opiniones}\n{script}\n</script>"

    if fragmento:
        return f"{cabecera}\n{marcado}\n{codigo}\n"

    return (
        '<!DOCTYPE html>\n<html lang="es">\n<head>\n'
        '<meta charset="UTF-8">\n'
        '<meta name="viewport" content="width=device-width, initial-scale=1">\n'
        '<meta name="theme-color" content="#6D2235">\n'
        f"{cabecera}\n"
        f"</head>\n<body>\n{marcado}\n{codigo}\n</body>\n</html>\n"
    )


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--fragment", action="store_true",
                        help="genera sólo el contenido, sin esqueleto HTML")
    parser.add_argument("-o", "--salida", default=None,
                        help="ruta del archivo de salida")
    args = parser.parse_args()

    salida = pathlib.Path(
        args.salida or (RAIZ / "dist" / ("fragmento.html" if args.fragment
                                         else "index.html"))
    )
    salida.parent.mkdir(parents=True, exist_ok=True)
    salida.write_text(construir(args.fragment), encoding="utf-8")
    print(f"Generado {salida} ({salida.stat().st_size / 1024:.1f} KB)")


if __name__ == "__main__":
    main()
