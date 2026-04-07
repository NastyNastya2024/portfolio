#!/usr/bin/env python3
"""
Build English case pages under en/ from Russian root HTML.
Requires: pip install beautifulsoup4 deep-translator --target ../.pip_lang
Run from repo root: PYTHONPATH=.pip_lang python3 tools/build_en_case_pages.py
"""
from __future__ import annotations

import re
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PIP = ROOT / ".pip_lang"
if PIP.is_dir():
    sys.path.insert(0, str(PIP))

from bs4 import BeautifulSoup, NavigableString  # noqa: E402
from deep_translator import GoogleTranslator  # noqa: E402

# Import English legal footer block
_tools_dir = Path(__file__).resolve().parent
if str(_tools_dir) not in sys.path:
    sys.path.insert(0, str(_tools_dir))
from inject_legal_footer import EN_INSERT  # noqa: E402

EN_LEGAL_BLOCK = EN_INSERT.replace("<dt>ИНН</dt>", "<dt>TIN</dt>", 1)

CASE_FILES = [
    "CTF.html",
    "FL.html",
    "VoiceBot1.html",
    "VoiceBot2.html",
    "VoiceBot3.html",
    "ht.html",
    "case6.html",
    "case7.html",
    "case8.html",
    "case9.html",
    "case10.html",
    "case11.html",
    "case12.html",
    "case13.html",
    "case14.html",
    "case15.html",
    "case16.html",
    "case17.html",
    "case18.html",
    "case-pixel-game.html",
    "ai_shniza.html",
    "instar.html",
]

CYR = re.compile(r"[\u0400-\u04FF]")
SKIP_PARENTS = frozenset({"script", "style", "noscript"})

translator = GoogleTranslator(source="ru", target="en")
_cache: dict[str, str] = {}


def translate_text(s: str) -> str:
    raw = s
    if not CYR.search(raw):
        return raw
    if raw in _cache:
        return _cache[raw]
    chunk_size = 4500
    if len(raw) <= chunk_size:
        try:
            out = translator.translate(raw)
            time.sleep(0.06)
        except Exception as e:
            print("translate error:", e, raw[:80], file=sys.stderr)
            return raw
        _cache[raw] = out
        return out
    parts = []
    for i in range(0, len(raw), chunk_size):
        part = raw[i : i + chunk_size]
        try:
            parts.append(translator.translate(part))
            time.sleep(0.08)
        except Exception as e:
            print("translate chunk error:", e, file=sys.stderr)
            parts.append(part)
    out = "".join(parts)
    _cache[raw] = out
    return out


def strip_replace_footer(soup: BeautifulSoup) -> None:
    for tag in soup.select("footer.site-footer, #legal-modal"):
        tag.decompose()


def translate_soup(soup: BeautifulSoup) -> None:
    to_replace = [
        node
        for node in soup.descendants
        if isinstance(node, NavigableString)
        and node.parent
        and node.parent.name not in SKIP_PARENTS
        and CYR.search(str(node))
    ]
    for node in to_replace:
        node.replace_with(translate_text(str(node)))

    for tag in soup.find_all(True):
        for attr in ("alt", "title", "aria-label", "placeholder"):
            if attr not in tag.attrs:
                continue
            val = tag.attrs[attr]
            if isinstance(val, list):
                val = val[0]
            if isinstance(val, str) and CYR.search(val):
                tag.attrs[attr] = translate_text(val)


def fix_paths_for_en(soup: BeautifulSoup) -> None:
    for tag in soup.find_all(True):
        if tag.name == "link":
            href = tag.get("href")
            if href in ("styles.css", "./styles.css"):
                tag["href"] = "../styles.css"
            continue
        for attr in ("href", "src", "poster"):
            if attr not in tag.attrs:
                continue
            val = tag.attrs[attr]
            if not isinstance(val, str):
                continue
            v = val.strip()
            if not v or v.startswith(("#", "mailto:", "tel:", "javascript:")):
                continue
            if v.startswith(("http://", "https://", "//")):
                continue
            if v.startswith("../"):
                continue

            if v in ("styles.css", "./styles.css"):
                tag[attr] = "../styles.css"
            elif v in ("script.js", "./script.js"):
                tag[attr] = "../script.js"
            elif v.startswith("img/") or v.startswith("./img/"):
                tag[attr] = "../" + v.lstrip("./")
            elif v.startswith("video/") or v.startswith("./video/"):
                tag[attr] = "../" + v.lstrip("./")
            elif v.startswith("fonts/") or v.startswith("./fonts/"):
                tag[attr] = "../" + v.lstrip("./")
            elif v.endswith(".html") or "/." in v:
                # keep same basename for intra-site links
                if v.startswith("/"):
                    tag[attr] = v
                else:
                    pass  # case6.html, index.html — already correct for en/
            else:
                if not v.startswith("/"):
                    tag[attr] = "../" + v.lstrip("./")


def patch_header_en(soup: BeautifulSoup, basename: str) -> None:
    header = soup.find("header")
    if not header:
        return

    ls = header.select_one(".lang-switch")
    if ls:
        new_ls = BeautifulSoup(
            f"""<div class="lang-switch" role="navigation" aria-label="Language">
                    <a href="../{basename}" class="lang-switch__link" hreflang="ru" lang="ru">RU</a>
                    <span class="lang-switch__sep" aria-hidden="true">·</span>
                    <span class="lang-switch__current" aria-current="true">EN</span>
                </div>""",
            "html.parser",
        )
        replacement = new_ls.find("div")
        if replacement:
            ls.replace_with(replacement)


def insert_legal_before_script(soup: BeautifulSoup) -> None:
    script = soup.find("script", src=lambda s: s and s.endswith("script.js"))
    if not script:
        return
    frag = BeautifulSoup(EN_LEGAL_BLOCK.strip(), "html.parser")
    footer = frag.find("footer", class_="site-footer")
    modal = frag.find("div", id="legal-modal")
    for node in (footer, modal):
        if node is not None:
            script.insert_before(node.extract())


def build_one(page: Path) -> None:
    basename = page.name
    html = page.read_text(encoding="utf-8")
    soup = BeautifulSoup(html, "html.parser")

    if soup.html:
        soup.html["lang"] = "en"

    strip_replace_footer(soup)
    translate_soup(soup)
    fix_paths_for_en(soup)
    patch_header_en(soup, basename)

    insert_legal_before_script(soup)

    # Ensure script path
    for sc in soup.find_all("script", src=True):
        if sc["src"] == "script.js":
            sc["src"] = "../script.js"

    out = ROOT / "en" / basename
    html_out = str(soup)
    if not html_out.lstrip().lower().startswith("<!doctype"):
        html_out = "<!DOCTYPE html>\n" + html_out
    out.write_text(html_out, encoding="utf-8")
    print("wrote", out.relative_to(ROOT))


def patch_ru_lang_links() -> None:
    for name in CASE_FILES:
        path = ROOT / name
        if not path.is_file():
            continue
        text = path.read_text(encoding="utf-8")
        old = 'href="en/index.html"'
        new = f'href="en/{name}"'
        if old in text:
            path.write_text(text.replace(old, new, 1), encoding="utf-8")
            print("lang link", name)


def patch_en_index_case_links() -> None:
    path = ROOT / "en" / "index.html"
    text = path.read_text(encoding="utf-8")
    for name in CASE_FILES:
        text = text.replace(
            f"window.open('../{name}', '_self')",
            f"window.open('{name}', '_self')",
        )
    path.write_text(text, encoding="utf-8")
    print("patched en/index.html case hrefs")


def main() -> None:
    en_dir = ROOT / "en"
    en_dir.mkdir(exist_ok=True)

    for name in CASE_FILES:
        src = ROOT / name
        if not src.is_file():
            print("skip missing", name, file=sys.stderr)
            continue
        build_one(src)

    patch_ru_lang_links()
    patch_en_index_case_links()


if __name__ == "__main__":
    main()
