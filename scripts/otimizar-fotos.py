"""Deixa as fotos do PET Computação leves para o site (rode depois de `npm run fotos`).

As imagens do site oficial do grupo vêm em tamanho original (até 4000 px e 3 MB), e as
"ilustrações" das frentes são SVGs com fotos de vários MB embutidas. Este script:

1. reduz cada foto para no máximo 1600 px no lado maior (fotos de membros: 480 px),
   mantendo o nome e o formato do arquivo; as fotos dos campi (public/fotos) ficam com
   1920 px e só são recomprimidas;
2. converte frentes/*.svg em frentes/*.webp, desenhando o SVG no Chrome sem janela
   (headless), e apaga o .svg.

Uso:  npm run fotos:otimizar
Precisa de: Python 3 com Pillow (`pip install pillow`) e Google Chrome ou Chromium.
"""

import shutil
import subprocess
import tempfile
from pathlib import Path

from PIL import Image

PUBLIC = Path(__file__).resolve().parent.parent / "public"
PASTA = PUBLIC / "pets" / "computacao"
PASTA_CAMPI = PUBLIC / "fotos"  # fotos do Commons: mantêm os 1920 px, só são recomprimidas
LADO_MAXIMO = 1600
LADO_MAXIMO_MEMBROS = 480


def reduzir(arquivo: Path, lado_maximo: int) -> None:
    imagem = Image.open(arquivo)
    if max(imagem.size) <= lado_maximo and arquivo.stat().st_size < 400_000:
        return  # já está leve
    imagem.thumbnail((lado_maximo, lado_maximo))
    formato = imagem.format or Image.open(arquivo).format
    if formato == "JPEG":
        imagem.convert("RGB").save(arquivo, "JPEG", quality=85, optimize=True, progressive=True)
    elif formato == "WEBP":
        imagem.save(arquivo, "WEBP", quality=85)
    else:
        imagem.save(arquivo, optimize=True)
    print(f"  reduzida: {arquivo.relative_to(PUBLIC)} {imagem.size}")


def achar_chrome() -> str:
    for nome in ("google-chrome", "chromium", "chromium-browser"):
        if shutil.which(nome):
            return nome
    raise SystemExit("Chrome/Chromium não encontrado: instale um deles para converter os SVGs.")


def svg_para_webp(svg: Path) -> None:
    # Lê o tamanho do SVG (atributos width e height da tag <svg>)
    inicio = svg.read_text(errors="ignore")[:600]
    largura = int(float(inicio.split('width="')[1].split('"')[0]))
    altura = int(float(inicio.split(' height="')[1].split('"')[0]))

    with tempfile.TemporaryDirectory() as tmp:
        png = Path(tmp) / "saida.png"
        subprocess.run(
            [
                achar_chrome(),
                "--headless=new",
                "--hide-scrollbars",
                "--force-device-scale-factor=2",  # o dobro do tamanho, para ficar nítido
                f"--window-size={largura},{altura}",
                f"--screenshot={png}",
                svg.as_uri(),
            ],
            check=True,
            capture_output=True,
        )
        Image.open(png).convert("RGB").save(svg.with_suffix(".webp"), "WEBP", quality=85)
    svg.unlink()
    print(f"  convertida: {svg.relative_to(PASTA)} -> .webp ({largura}x{altura})")


def main() -> None:
    print("== Fotos")
    for arquivo in sorted(PASTA.rglob("*")):
        if arquivo.suffix.lower() in (".jpg", ".jpeg", ".png", ".webp") and arquivo.name != "logo.png":
            limite = LADO_MAXIMO_MEMBROS if arquivo.parent.name == "membros" else LADO_MAXIMO
            reduzir(arquivo, limite)

    for arquivo in sorted(PASTA_CAMPI.glob("*.jpg")):
        reduzir(arquivo, 1920)

    print("== Ilustrações das frentes (SVG -> WebP)")
    for svg in sorted((PASTA / "frentes").glob("*.svg")):
        svg_para_webp(svg)


if __name__ == "__main__":
    main()
