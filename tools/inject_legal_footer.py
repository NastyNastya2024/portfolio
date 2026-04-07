#!/usr/bin/env python3
"""Insert site footer + legal modal before script.js on all site pages."""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

RU_INSERT = r"""    <footer class="site-footer">
        <div class="container">
            <button type="button" class="footer-legal-trigger" data-open-legal-modal>
                Реквизиты и юридическая информация
            </button>
        </div>
    </footer>

    <div class="legal-modal" id="legal-modal" hidden role="dialog" aria-modal="true" aria-labelledby="legal-modal-title">
        <div class="legal-modal__backdrop" data-close-legal-modal tabindex="-1"></div>
        <div class="legal-modal__panel">
            <button type="button" class="legal-modal__close" data-close-legal-modal aria-label="Закрыть">&times;</button>
            <h2 class="legal-modal__title" id="legal-modal-title">Реквизиты и юридическая информация</h2>
            <div class="legal-modal__body">
                <p class="legal-modal__note">Индивидуальный предприниматель. Данные для договора и оплаты.</p>
                <dl class="legal-dl">
                    <dt>Название организации</dt>
                    <dd>ИНДИВИДУАЛЬНЫЙ ПРЕДПРИНИМАТЕЛЬ КОМАРОВА АНАСТАСИЯ АЛЕКСАНДРОВНА</dd>
                    <dt>Юридический адрес</dt>
                    <dd>141310, РОССИЯ, МОСКОВСКАЯ ОБЛ, Г СЕРГИЕВ ПОСАД, Г СЕРГИЕВ ПОСАД, ПР-КТ КРАСНОЙ АРМИИ, Д 6, КВ 91</dd>
                    <dt>ИНН</dt>
                    <dd>504231947047</dd>
                    <dt>ОГРНИП</dt>
                    <dd>322508100272216</dd>
                    <dt>Расчётный счёт</dt>
                    <dd>40802810400006421655</dd>
                    <dt>Банк</dt>
                    <dd>АО «ТБанк»</dd>
                    <dt>ИНН банка</dt>
                    <dd>7710140679</dd>
                    <dt>БИК</dt>
                    <dd>044525974</dd>
                    <dt>Корр. счёт банка</dt>
                    <dd>30101810145250000974</dd>
                </dl>
                <p class="legal-modal__phone"><strong>Телефон:</strong> <a href="tel:+79060959295">+7&nbsp;906&nbsp;095‑92‑95</a></p>
            </div>
        </div>
    </div>

"""

EN_INSERT = RU_INSERT.replace(
    """                Реквизиты и юридическая информация
            </button>""",
    """                Legal &amp; billing details
            </button>""",
).replace(
    """ aria-label="Закрыть""",
    """ aria-label="Close""",
).replace(
    """ id="legal-modal-title">Реквизиты и юридическая информация</h2>""",
    """ id="legal-modal-title">Legal information &amp; billing details</h2>""",
).replace(
    """                <p class="legal-modal__note">Индивидуальный предприниматель. Данные для договора и оплаты.</p>
                <dl class="legal-dl">
                    <dt>Название организации</dt>""",
    """                <p class="legal-modal__note">Individual entrepreneur (Russia). Details for contracts and payments.</p>
                <dl class="legal-dl">
                    <dt>Registered name</dt>""",
).replace(
    """                    <dt>Юридический адрес</dt>""",
    """                    <dt>Legal address</dt>""",
).replace(
    """                    <dt>ОГРНИП</dt>""",
    """                    <dt>OGRNIP</dt>""",
).replace(
    """                    <dt>Расчётный счёт</dt>""",
    """                    <dt>Bank account (RUB)</dt>""",
).replace(
    """                    <dt>Банк</dt>""",
    """                    <dt>Bank</dt>""",
).replace(
    """                    <dt>ИНН банка</dt>""",
    """                    <dt>Bank TIN</dt>""",
).replace(
    """                    <dt>БИК</dt>""",
    """                    <dt>BIK</dt>""",
).replace(
    """                    <dt>Корр. счёт банка</dt>""",
    """                    <dt>Correspondent account</dt>""",
).replace(
    """                <p class="legal-modal__phone"><strong>Телефон:</strong>""",
    """                <p class="legal-modal__phone"><strong>Phone:</strong>""",
)


def main():
    for path in sorted(ROOT.rglob("*.html")):
        rel = path.relative_to(ROOT)
        if "GEO-repository" in path.parts:
            continue
        try:
            text = path.read_text(encoding="utf-8")
        except OSError:
            continue
        if "data-open-legal-modal" in text:
            continue
        if "</footer>" in text and "site-footer" in text:
            continue

        if 'src="../script.js"' in text:
            marker = "    <script src=\"../script.js\"></script>"
            insert = EN_INSERT
        elif 'src="script.js"' in text:
            marker = "    <script src=\"script.js\"></script>"
            insert = RU_INSERT
        else:
            continue

        if marker not in text:
            continue

        path.write_text(text.replace(marker, insert + marker, 1), encoding="utf-8")
        print("patched", rel)


if __name__ == "__main__":
    main()
