// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

/**
 * Чат бронирования: сценарий «меню → ответы» (RU/EN). LLM — только если ASYAKOM_BOOKING_LLM.useLLM === true.
 * Заявки без своего бэка: пункт «Оставить контакты» открывает mailto: на contactEmail с заполненным телом письма.
 * Свой сервер не нужен; альтернатива — Formspree/Getform (POST с формы на их URL).
 */
(function () {
    var COPY = {
        ru: {
            title: 'ASYA.KOM',
            subtitle: 'Бронирование звонка',
            introMenu:
                'Привет! Выберите раздел — ответ пришлю сразу.\n\n' +
                '• Мои контакты — почта, телефон и Telegram\n' +
                '• Услуги — направления работы\n' +
                '• Кейсы — по хештегам портфолио\n' +
                '• Обо мне — коротко о специалисте\n' +
                '• Стоимость — по договорённости, от сложности разработки\n' +
                '• Оставить контакты — форма и письмо на почту (без сервера)',
            placeholder: 'Сообщение или выберите кнопку ниже…',
            send: 'Отправить',
            sendAria: 'Отправить сообщение',
            thinking: 'Печатает…',
            closeAria: 'Закрыть чат',
            error: 'Не удалось получить ответ. Проверьте API или попробуйте позже.',
            menuUnknown:
                'Не распознала запрос. Выберите одну из кнопок ниже: мои контакты, услуги, кейсы, обо мне, стоимость или заявка.',
            chipContacts: 'Мои контакты',
            chipServices: 'Услуги',
            chipCases: 'Кейсы',
            chipAbout: 'Обо мне',
            chipPricing: 'Стоимость',
            chipLead: 'Оставить контакты',
            chipMenu: '← Главное меню',
            leadIntro:
                'Заполните поля и нажмите кнопку — откроется почта с готовым текстом. Отправьте письмо, как обычно. Отдельный сервер не нужен.',
            leadNamePh: 'Имя',
            leadEmailPh: 'Email',
            leadPhonePh: 'Телефон',
            leadNotePh: 'Задача или удобное время для звонка',
            leadMailtoBtn: 'Открыть почту и отправить',
            leadMailtoHint:
                'Если почта не открылась, скопируйте текст и отправьте на anastkomarova@yandex.ru',
            leadNeedContact: 'Укажите email или телефон, чтобы я могла ответить.',
            contactsBody:
                'Мои контакты:\n\n' +
                '✉ anastkomarova@yandex.ru\n' +
                '📞 +7 906 095-92-95\n' +
                'Telegram: @anastasia_komarova1 (t.me/anastasia_komarova1)\n\n' +
                'Пишите на почту или в Telegram — отвечу в рабочее время.',
            servicesBody:
                'Услуги и направления:\n\n' +
                '• ИИ-агенты — внедрение и настройка под процессы, CRM, инструменты\n' +
                '• Приложения и сайты — от лендинга до SaaS, бэкенд и админки\n' +
                '• Голосовые боты — входящие/исходящие звонки, NPS, запись в CRM\n' +
                '• Digital marketing — стратегия, контент, метрики в цифровых каналах\n' +
                '• Аналитика и RnD — исследования, федеративное обучение, прикладной ML\n\n' +
                'Если нужно что-то узкое — опишите в свободной форме после подключения LLM.',
            casesBody:
                'Кейсы на главной можно отфильтровать по тегам (хештеги в карточках совпадают с фильтрами):\n\n' +
                '• #AI/ML — модели, эксперименты, RnD\n' +
                '• #Сайты, #GEO/SEO — лендинги, продвижение в поиске и LLM-выдаче\n' +
                '• #Голосовой бот — сценарии звонков, NPS, интеграции\n' +
                '• #SaaS, #Приложения — платформы, подписки, личные кабинеты\n' +
                '• #RAG, #Агенты — маркетплейсы знаний, Telegram/чат-боты\n' +
                '• #Дизайн, #UI/UX, #Брендинг — интерфейсы и визуал\n' +
                '• #Аналитика, #Прикладное ПО — внутренние системы и тулзы\n\n' +
                'Откройте раздел «Все кейсы» на сайте и нажмите нужный тег.',
            aboutBody:
                'Обо мне:\n\n' +
                'Комарова Анастасия, Москва.\n\n' +
                'В технологиях больше 10 лет; последние годы — сильный упор на ИИ, продукт и задачи бизнеса.\n\n' +
                'По профилю и ролям:\n' +
                '• ИТ-специалист\n' +
                '• UI/UX-дизайнер\n' +
                '• продуктовый, бизнес- и системный аналитик\n' +
                '• продуктолог\n' +
                '• разработчик (Python)\n' +
                '• data scientist\n' +
                '• финансист\n' +
                '• digital-маркетолог\n\n' +
                'Это не набор «красивых ролей из резюме» — за каждой позицией стоит реальный опыт в крупных коммерческих компаниях.',
            pricingBody:
                'Стоимость:\n\n' +
                'Ориентиры обсуждаем по договорённости — они зависят от сложности разработки: объём функционала, интеграции, сроки, сопровождение.\n\n' +
                'Фиксированного прайса «на всё» нет: после короткого описания задачи предложу формат работы и понятную вилку по бюджету. Можно написать в разделе «Оставить контакты» или в Telegram.',
            stubHint:
                'Свободный диалог с ИИ можно будет включить: установите ASYAKOM_BOOKING_LLM.useLLM = true и реализуйте requestCompletion.'
        },
        en: {
            title: 'ASYA.KOM',
            subtitle: 'Book a call',
            introMenu:
                'Hi! Pick a topic — I will reply right away.\n\n' +
                '• My contacts — email, phone & Telegram\n' +
                '• Services — what we do\n' +
                '• Case studies — portfolio hashtags\n' +
                '• About me — short bio\n' +
                '• Pricing — by agreement, depending on development complexity\n' +
                '• Leave your details — form → email draft (no backend)',
            placeholder: 'Type a message or use the chips below…',
            send: 'Send',
            sendAria: 'Send message',
            thinking: 'Typing…',
            closeAria: 'Close chat',
            error: 'Could not get a reply. Check your API or try again.',
            menuUnknown:
                'I did not catch that. Please use one of the chips below: my contacts, services, cases, about, pricing, or lead.',
            chipContacts: 'My contacts',
            chipServices: 'Services',
            chipCases: 'Case studies',
            chipAbout: 'About me',
            chipPricing: 'Pricing',
            chipLead: 'Leave your details',
            chipMenu: '← Main menu',
            leadIntro:
                'Fill in the fields and tap the button — your email app opens with a ready message. Send it as usual. No server required.',
            leadNamePh: 'Name',
            leadEmailPh: 'Email',
            leadPhonePh: 'Phone',
            leadNotePh: 'Project / preferred time for a call',
            leadMailtoBtn: 'Open email app & send',
            leadMailtoHint:
                'If nothing opens, copy the text and send it to anastkomarova@yandex.ru',
            leadNeedContact: 'Please add an email or phone so I can reply.',
            contactsBody:
                'My contacts:\n\n' +
                '✉ anastkomarova@yandex.ru\n' +
                '📞 +7 906 095-92-95\n' +
                'Telegram: @anastasia_komarova1 (t.me/anastasia_komarova1)\n\n' +
                'Email or Telegram work best — I will reply during business hours.',
            servicesBody:
                'Services:\n\n' +
                '• AI agents — rollout and tuning for your workflows, CRM, tools\n' +
                '• Apps & websites — landing pages to SaaS, backends, admin panels\n' +
                '• Voice bots — inbound/outbound, NPS, CRM logging\n' +
                '• Digital marketing — strategy, content, metrics across channels\n' +
                '• Analytics & RnD — research, federated learning, applied ML\n\n' +
                'Need something narrower? Describe it once LLM chat is enabled.',
            casesBody:
                'On the homepage you can filter case cards by tags:\n\n' +
                '• #AI/ML — models, experiments, RnD\n' +
                '• #Sites, #GEO/SEO — landing, search & generative visibility\n' +
                '• #Voice bot — calling flows, NPS, integrations\n' +
                '• #SaaS, #Apps — platforms, subscriptions, dashboards\n' +
                '• #RAG, #Agents — knowledge marketplaces, Telegram/chat bots\n' +
                '• #Design, #UI/UX, #Branding — interfaces and visual identity\n' +
                '• #Analytics, #Software — internal tools and systems\n\n' +
                'Open “All cases” and click the tag you need.',
            aboutBody:
                'About me:\n\n' +
                'Anastasia Komarova, based in Moscow.\n\n' +
                '10+ years in tech; recent years strongly focused on AI, product delivery, and business outcomes.\n\n' +
                'Roles and focus areas:\n' +
                '• IT specialist\n' +
                '• UI/UX designer\n' +
                '• product, business & systems analyst\n' +
                '• product strategist — discovery, metrics, roadmap\n' +
                '• developer (Python)\n' +
                '• data scientist\n' +
                '• finance specialist\n' +
                '• digital marketer\n\n' +
                'These are not invented labels — they are backed by hands-on experience in large commercial companies.',
            pricingBody:
                'Pricing:\n\n' +
                'Rates are agreed by arrangement and depend on how complex the build is: scope, integrations, timeline, and whether you need ongoing support.\n\n' +
                'There is no single price list for everything — share a short brief and I will propose an engagement model and a clear budget range. Use «Leave your details» or Telegram.',
            stubHint:
                'Free-form AI chat: set ASYAKOM_BOOKING_LLM.useLLM = true and implement requestCompletion.'
        }
    };

    function pageLang() {
        var l = document.documentElement.getAttribute('lang') || '';
        return l.slice(0, 2).toLowerCase() === 'en' ? 'en' : 'ru';
    }

    function t() {
        return COPY[pageLang()];
    }

    /**
     * useLLM: false — сценарное меню. true — вызывается requestCompletion(userMessage, systemPrompt).
     */
    window.ASYAKOM_BOOKING_LLM = window.ASYAKOM_BOOKING_LLM || {};
    if (typeof window.ASYAKOM_BOOKING_LLM.useLLM === 'undefined') {
        window.ASYAKOM_BOOKING_LLM.useLLM = false;
    }
    if (!window.ASYAKOM_BOOKING_LLM.systemPrompt) {
        window.ASYAKOM_BOOKING_LLM.systemPrompt =
            'You are a concise assistant for ASYA.KOM. The user may book a call. Match the user language.';
    }
    if (typeof window.ASYAKOM_BOOKING_LLM.requestCompletion !== 'function') {
        window.ASYAKOM_BOOKING_LLM.requestCompletion = function (userMessage, systemPrompt) {
            return Promise.resolve(t().stubHint);
        };
    }
    if (!window.ASYAKOM_BOOKING_LLM.contactEmail) {
        window.ASYAKOM_BOOKING_LLM.contactEmail = 'anastkomarova@yandex.ru';
    }

    var bookingModalEl = null;
    var bookingLastFocus = null;
    var bookingChatEl = null;
    var bookingChipsEl = null;

    function bookingFormatTime() {
        var d = new Date();
        var h = d.getHours();
        var m = d.getMinutes();
        return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
    }

    function bookingScrollChat() {
        if (!bookingChatEl) {
            return;
        }
        bookingChatEl.scrollTop = bookingChatEl.scrollHeight;
    }

    function bookingAppendBubble(kind, text) {
        var row = document.createElement('div');
        row.className =
            'booking-messenger__row' + (kind === 'user' ? ' booking-messenger__row--user' : ' booking-messenger__row--bot');

        var bubble = document.createElement('div');
        bubble.className =
            'booking-messenger__bubble' +
            (kind === 'user' ? ' booking-messenger__bubble--user' : ' booking-messenger__bubble--bot');

        var textSpan = document.createElement('span');
        textSpan.className = 'booking-messenger__bubble-text';
        textSpan.textContent = text;

        var meta = document.createElement('span');
        meta.className = 'booking-messenger__bubble-meta';
        meta.textContent = bookingFormatTime();

        bubble.appendChild(textSpan);
        bubble.appendChild(meta);
        row.appendChild(bubble);
        bookingChatEl.appendChild(row);
        bookingScrollChat();
        return textSpan;
    }

    function bookingNormalize(s) {
        return String(s || '')
            .toLowerCase()
            .trim()
            .replace(/ё/g, 'е');
    }

    function bookingMatchBranch(text) {
        var x = bookingNormalize(text);
        if (!x) {
            return null;
        }
        if (
            /^1\b|^контакт|^мои\s*контакт|^contact|^my\s*contacts|^почт|^mail|^email|^тел|^phone|^телеграм|^telegram/i.test(
                x
            )
        ) {
            return 'contacts';
        }
        if (/^2\b|^услуг|^service|^сервис/i.test(x)) {
            return 'services';
        }
        if (/^3\b|^кейс|^case|^портфол|^portfolio|^хештег|^hashtag|^работ|^work/i.test(x)) {
            return 'cases';
        }
        if (/^4\b|^обо мне|^обо\s*мне|^about|^who|^автор|^биограф/i.test(x)) {
            return 'about';
        }
        if (
            /^6\b|^стоим|^сколько\s*стоит|^цена|^цены|^прайс|^бюджет|^оценк|^pricing|^price|^budget|^cost|^quote|^estimate|how\s*much|^\s*rate\b/i.test(
                x
            )
        ) {
            return 'pricing';
        }
        if (
            /^5\b|^заявк|оставить контакт|свои контакт|написать вам|свой телефон|^lead\b|leave.*details|my details|reach out/i.test(
                x
            )
        ) {
            return 'lead';
        }
        if (/меню|^menu|^назад$|^back$|^главн/i.test(x)) {
            return 'menu';
        }
        return null;
    }

    function bookingTreeResponse(branch) {
        var s = t();
        if (branch === 'contacts') {
            return s.contactsBody;
        }
        if (branch === 'services') {
            return s.servicesBody;
        }
        if (branch === 'cases') {
            return s.casesBody;
        }
        if (branch === 'about') {
            return s.aboutBody;
        }
        if (branch === 'pricing') {
            return s.pricingBody;
        }
        if (branch === 'menu') {
            return s.introMenu;
        }
        if (branch === 'lead') {
            return s.leadIntro;
        }
        return null;
    }

    function bookingRenderChips(list) {
        if (!bookingChipsEl) {
            return;
        }
        bookingChipsEl.innerHTML = '';
        if (!list || !list.length) {
            bookingChipsEl.hidden = true;
            return;
        }
        bookingChipsEl.hidden = false;
        list.forEach(function (item) {
            var b = document.createElement('button');
            b.type = 'button';
            b.className = 'booking-messenger__chip';
            b.textContent = item.label;
            b.setAttribute('data-booking-chip', item.branch);
            bookingChipsEl.appendChild(b);
        });
    }

    function bookingDefaultRootChips() {
        var s = t();
        return [
            { branch: 'contacts', label: s.chipContacts },
            { branch: 'services', label: s.chipServices },
            { branch: 'cases', label: s.chipCases },
            { branch: 'about', label: s.chipAbout },
            { branch: 'pricing', label: s.chipPricing },
            { branch: 'lead', label: s.chipLead }
        ];
    }

    function bookingContactEmail() {
        return (window.ASYAKOM_BOOKING_LLM && window.ASYAKOM_BOOKING_LLM.contactEmail) || 'anastkomarova@yandex.ru';
    }

    function bookingChipsOnlyMode() {
        return !(window.ASYAKOM_BOOKING_LLM && window.ASYAKOM_BOOKING_LLM.useLLM);
    }

    /** Поле ввода скрыто без LLM — только чипы; при открытой заявке всегда скрыт композер. */
    function bookingApplyComposerVisibility() {
        if (!bookingModalEl) {
            return;
        }
        var composer = bookingModalEl.querySelector('#booking-modal-composer');
        var wrap = bookingModalEl.querySelector('#booking-lead-wrap');
        if (!composer || !wrap) {
            return;
        }
        var leadOpen = !wrap.hidden;
        composer.hidden = leadOpen || bookingChipsOnlyMode();
    }

    function bookingSetLeadFormVisible(show) {
        if (!bookingModalEl) {
            return;
        }
        var wrap = bookingModalEl.querySelector('#booking-lead-wrap');
        if (!wrap) {
            return;
        }
        wrap.hidden = !show;
        if (!show) {
            bookingModalEl.querySelector('#booking-lead-name').value = '';
            bookingModalEl.querySelector('#booking-lead-email').value = '';
            bookingModalEl.querySelector('#booking-lead-phone').value = '';
            bookingModalEl.querySelector('#booking-lead-note').value = '';
        }
        bookingApplyComposerVisibility();
    }

    function bookingRefreshLeadPlaceholders() {
        if (!bookingModalEl) {
            return;
        }
        var s = t();
        bookingModalEl.querySelector('#booking-lead-name').placeholder = s.leadNamePh;
        bookingModalEl.querySelector('#booking-lead-email').placeholder = s.leadEmailPh;
        bookingModalEl.querySelector('#booking-lead-phone').placeholder = s.leadPhonePh;
        bookingModalEl.querySelector('#booking-lead-note').placeholder = s.leadNotePh;
        bookingModalEl.querySelector('#booking-lead-mailto').textContent = s.leadMailtoBtn;
        bookingModalEl.querySelector('#booking-lead-hint').textContent = s.leadMailtoHint;
    }

    function bookingBackChip() {
        return [{ branch: 'menu', label: t().chipMenu }];
    }

    function bookingRunTreeTurn(displayedUserText, branchForReply) {
        var errEl = bookingModalEl.querySelector('#booking-modal-error');
        errEl.hidden = true;
        errEl.textContent = '';

        bookingAppendBubble('user', displayedUserText);

        var submit = bookingModalEl.querySelector('#booking-modal-submit');
        var input = bookingModalEl.querySelector('#booking-modal-input');
        submit.disabled = true;

        var typingTextSpan = bookingAppendBubble('bot', t().thinking);

        window.setTimeout(function () {
            typingTextSpan.parentElement.classList.remove('booking-messenger__bubble--error');
            var body = bookingTreeResponse(branchForReply);
            if (!body) {
                body = t().menuUnknown;
                typingTextSpan.textContent = body;
                bookingRenderChips(bookingDefaultRootChips());
                bookingSetLeadFormVisible(false);
            } else {
                typingTextSpan.textContent = body;
                bookingRenderChips(branchForReply === 'menu' ? bookingDefaultRootChips() : bookingBackChip());
                bookingSetLeadFormVisible(branchForReply === 'lead');
            }
            submit.disabled = false;
            bookingScrollChat();
            var leadW = bookingModalEl.querySelector('#booking-lead-wrap');
            if (!leadW || leadW.hidden) {
                if (bookingChipsOnlyMode()) {
                    var ch = bookingModalEl.querySelector('.booking-messenger__chip');
                    if (ch) {
                        ch.focus();
                    }
                } else {
                    input.focus();
                }
            } else {
                bookingModalEl.querySelector('#booking-lead-name').focus();
            }
        }, 320);
    }

    function bookingHandleChipClick(branch) {
        if (!bookingModalEl || bookingModalEl.hidden) {
            return;
        }
        var labelMap = {
            contacts: t().chipContacts,
            services: t().chipServices,
            cases: t().chipCases,
            about: t().chipAbout,
            pricing: t().chipPricing,
            lead: t().chipLead,
            menu: t().chipMenu
        };
        var shown = labelMap[branch] || branch;
        bookingRunTreeTurn(shown, branch === 'menu' ? 'menu' : branch);
    }

    function bookingSyncMessengerModeClass(modalRoot) {
        var panel = modalRoot && modalRoot.querySelector('.booking-messenger');
        if (!panel) {
            return;
        }
        var llm = window.ASYAKOM_BOOKING_LLM && window.ASYAKOM_BOOKING_LLM.useLLM;
        panel.classList.toggle('booking-messenger--scenario', !llm);
        bookingApplyComposerVisibility();
    }

    function ensureBookingModal() {
        if (bookingModalEl) {
            bookingSyncMessengerModeClass(bookingModalEl);
            return bookingModalEl;
        }
        var str = t();
        var root = document.createElement('div');
        root.id = 'booking-modal';
        root.className = 'booking-modal';
        root.setAttribute('hidden', '');
        root.setAttribute('role', 'dialog');
        root.setAttribute('aria-modal', 'true');
        root.setAttribute('aria-labelledby', 'booking-modal-title');
        root.innerHTML =
            '<div class="booking-modal__panel booking-messenger">' +
            '<header class="booking-messenger__header">' +
            '<div class="booking-messenger__header-info">' +
            '<h2 class="booking-messenger__title" id="booking-modal-title">' +
            escapeHtml(str.title) +
            '</h2>' +
            '<p class="booking-messenger__subtitle" id="booking-modal-subtitle"></p>' +
            '</div>' +
            '<button type="button" class="booking-messenger__close" data-booking-close aria-label="' +
            escapeAttr(str.closeAria) +
            '"><span aria-hidden="true">×</span></button>' +
            '</header>' +
            '<div class="booking-messenger__chat" id="booking-modal-chat"></div>' +
            '<div class="booking-messenger__chips" id="booking-modal-chips" hidden></div>' +
            '<p class="booking-messenger__error" id="booking-modal-error" role="alert" hidden></p>' +
            '<div class="booking-messenger__lead" id="booking-lead-wrap" hidden>' +
            '<input class="booking-messenger__lead-field" type="text" id="booking-lead-name" autocomplete="name" />' +
            '<input class="booking-messenger__lead-field" type="email" id="booking-lead-email" autocomplete="email" />' +
            '<input class="booking-messenger__lead-field" type="tel" id="booking-lead-phone" autocomplete="tel" />' +
            '<textarea class="booking-messenger__lead-field booking-messenger__lead-note" id="booking-lead-note" rows="2"></textarea>' +
            '<button type="button" class="booking-messenger__lead-submit" id="booking-lead-mailto"></button>' +
            '<p class="booking-messenger__lead-hint" id="booking-lead-hint"></p>' +
            '</div>' +
            '<div class="booking-messenger__composer" id="booking-modal-composer">' +
            '<label class="visually-hidden" for="booking-modal-input">' +
            escapeHtml(str.placeholder) +
            '</label>' +
            '<textarea class="booking-messenger__input" id="booking-modal-input" rows="1" autocomplete="off"></textarea>' +
            '<button type="button" class="booking-messenger__send" id="booking-modal-submit" title="' +
            escapeAttr(str.send) +
            '" aria-label="' +
            escapeAttr(str.sendAria) +
            '">' +
            '<svg class="booking-messenger__send-icon" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">' +
            '<path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>' +
            '</svg>' +
            '</button>' +
            '</div>' +
            '</div>';

        document.body.appendChild(root);
        bookingModalEl = root;
        bookingChatEl = root.querySelector('#booking-modal-chat');
        bookingChipsEl = root.querySelector('#booking-modal-chips');

        bookingChipsEl.addEventListener('click', function (e) {
            var chip = e.target.closest('[data-booking-chip]');
            if (!chip) {
                return;
            }
            var br = chip.getAttribute('data-booking-chip');
            if (br && br.trim()) {
                bookingHandleChipClick(br.trim());
            }
        });

        var input = root.querySelector('#booking-modal-input');
        var submit = root.querySelector('#booking-modal-submit');
        var errEl = root.querySelector('#booking-modal-error');

        bookingRefreshLeadPlaceholders();
        root.querySelector('#booking-lead-mailto').addEventListener('click', function () {
            var n = root.querySelector('#booking-lead-name').value.trim();
            var em = root.querySelector('#booking-lead-email').value.trim();
            var ph = root.querySelector('#booking-lead-phone').value.trim();
            var nt = root.querySelector('#booking-lead-note').value.trim();
            errEl.hidden = true;
            errEl.textContent = '';
            if (!em && !ph) {
                errEl.textContent = t().leadNeedContact;
                errEl.hidden = false;
                return;
            }
            var en = pageLang() === 'en';
            var subj = en ? 'ASYA.KOM — website lead' : 'ASYA.KOM — заявка с сайта';
            var lines = [
                en ? 'Lead from ASYA.KOM site (chat widget)' : 'Заявка с сайта ASYA.KOM (виджет чата)',
                '',
                (en ? 'Name' : 'Имя') + ': ' + (n || '—'),
                'Email: ' + (em || '—'),
                (en ? 'Phone' : 'Телефон') + ': ' + (ph || '—'),
                '',
                (en ? 'Message' : 'Сообщение') + ':',
                nt || '—'
            ];
            var href =
                'mailto:' +
                bookingContactEmail() +
                '?subject=' +
                encodeURIComponent(subj) +
                '&body=' +
                encodeURIComponent(lines.join('\n'));
            window.location.href = href;
        });

        root.querySelectorAll('[data-booking-close]').forEach(function (el) {
            el.addEventListener('click', function () {
                closeBookingModal();
            });
        });

        input.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                submit.click();
            }
        });

        submit.addEventListener('click', function () {
            var text = (input.value || '').trim();
            errEl.hidden = true;
            errEl.textContent = '';

            if (!text) {
                return;
            }

            input.value = '';

            if (window.ASYAKOM_BOOKING_LLM.useLLM) {
                bookingAppendBubble('user', text);
                submit.disabled = true;
                var typingLLM = bookingAppendBubble('bot', t().thinking);
                var prompt = window.ASYAKOM_BOOKING_LLM.systemPrompt;
                var fn = window.ASYAKOM_BOOKING_LLM.requestCompletion;
                Promise.resolve()
                    .then(function () {
                        return fn.call(window.ASYAKOM_BOOKING_LLM, text, prompt);
                    })
                    .then(function (answer) {
                        typingLLM.textContent = (answer != null ? String(answer) : '').trim() || '—';
                        typingLLM.parentElement.classList.remove('booking-messenger__bubble--error');
                    })
                    .catch(function () {
                        typingLLM.textContent = t().error;
                        typingLLM.parentElement.classList.add('booking-messenger__bubble--error');
                        errEl.textContent = t().error;
                        errEl.hidden = false;
                    })
                    .finally(function () {
                        submit.disabled = false;
                        bookingScrollChat();
                        bookingRenderChips([]);
                        input.focus();
                    });
                return;
            }

            var branch = bookingMatchBranch(text);
            if (!branch) {
                bookingRunTreeTurn(text, null);
                return;
            }

            bookingRunTreeTurn(text, branch);
        });

        bookingSyncMessengerModeClass(root);
        return root;
    }

    function escapeHtml(s) {
        var d = document.createElement('div');
        d.textContent = s;
        return d.innerHTML;
    }

    function escapeAttr(s) {
        return String(s)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/</g, '&lt;');
    }

    function openBookingModal() {
        var modal = ensureBookingModal();
        bookingSyncMessengerModeClass(modal);
        var str = t();
        bookingChatEl = modal.querySelector('#booking-modal-chat');
        bookingChipsEl = modal.querySelector('#booking-modal-chips');
        modal.querySelector('#booking-modal-title').textContent = str.title;
        modal.querySelector('#booking-modal-subtitle').textContent = str.subtitle;
        var input = modal.querySelector('#booking-modal-input');
        input.placeholder = str.placeholder;
        modal.querySelector('#booking-modal-submit').setAttribute('title', str.send);
        modal.querySelector('#booking-modal-submit').setAttribute('aria-label', str.sendAria);
        modal.querySelector('.booking-messenger__close').setAttribute('aria-label', str.closeAria);

        bookingLastFocus = document.activeElement;
        modal.hidden = false;
        input.value = '';
        bookingChatEl.innerHTML = '';
        bookingSetLeadFormVisible(false);
        bookingRefreshLeadPlaceholders();
        bookingAppendBubble('bot', str.introMenu);
        bookingRenderChips(bookingDefaultRootChips());
        var err = modal.querySelector('#booking-modal-error');
        err.hidden = true;
        err.textContent = '';

        setTimeout(function () {
            if (bookingChipsOnlyMode()) {
                var firstChip = modal.querySelector('.booking-messenger__chip');
                if (firstChip) {
                    firstChip.focus();
                } else {
                    modal.querySelector('.booking-messenger__close').focus();
                }
            } else {
                input.focus();
            }
            bookingScrollChat();
        }, 10);
    }

    function closeBookingModal() {
        var modal = document.getElementById('booking-modal');
        if (!modal || modal.hidden) {
            return;
        }
        modal.hidden = true;
        if (bookingLastFocus && typeof bookingLastFocus.focus === 'function') {
            bookingLastFocus.focus();
        }
    }

    document.addEventListener(
        'keydown',
        function (e) {
            if (e.key !== 'Escape') {
                return;
            }
            var modal = document.getElementById('booking-modal');
            if (modal && !modal.hidden) {
                closeBookingModal();
                e.preventDefault();
            }
        },
        true
    );

    document.addEventListener('click', function (e) {
        var modal = document.getElementById('booking-modal');
        if (!modal || modal.hidden) {
            return;
        }
        if (modal.contains(e.target)) {
            return;
        }
        if (e.target.closest && e.target.closest('.cta-button')) {
            return;
        }
        closeBookingModal();
    }, true);

    document.addEventListener('DOMContentLoaded', function () {
        document.querySelectorAll('.cta-button').forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                openBookingModal();
            });
        });
    });
})();

// Cases Filter: равномерно по ширине; не поместившиеся — в выпадающий список «…»
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('section.cases').forEach(function (casesSection) {
        const wrap = casesSection.querySelector('.cases-filters-wrap');
        if (!wrap) return;

        const distributed = wrap.querySelector('.cases-filters-distributed');
        const extraInner = wrap.querySelector('.cases-filters-extra-inner');
        const caseCards = casesSection.querySelectorAll('.cases-grid .case-card');
        const moreBtn = wrap.querySelector('.filter-btn--more');
        const extraPanel = wrap.querySelector('.cases-filters-extra');

        if (!distributed || !extraInner) return;

        const orderedButtons = Array.from(distributed.querySelectorAll('.filter-btn[data-filter]'));

        function placeInRow(countInRow) {
            orderedButtons.forEach(function (b) {
                if (b.parentNode) b.parentNode.removeChild(b);
            });
            for (var i = 0; i < countInRow; i++) {
                distributed.appendChild(orderedButtons[i]);
            }
            for (var j = countInRow; j < orderedButtons.length; j++) {
                extraInner.appendChild(orderedButtons[j]);
            }
        }

        function balanceFilters() {
            var n = orderedButtons.length;
            if (n === 0) {
                if (moreBtn) moreBtn.style.display = 'none';
                return;
            }

            var bestK = 0;
            for (var k = n; k >= 0; k--) {
                placeInRow(k);
                void distributed.offsetWidth;
                var over = distributed.scrollWidth > distributed.clientWidth + 1;
                if (!over) {
                    bestK = k;
                    break;
                }
            }

            placeInRow(bestK);

            var hasOverflow = bestK < n;
            if (moreBtn) {
                moreBtn.style.display = hasOverflow ? '' : 'none';
                if (!hasOverflow && extraPanel) {
                    extraPanel.hidden = true;
                    moreBtn.setAttribute('aria-expanded', 'false');
                }
            }
        }

        function setActiveFilter(filter) {
            wrap.querySelectorAll('.filter-btn[data-filter]').forEach(function (btn) {
                btn.classList.toggle('active', btn.getAttribute('data-filter') === filter);
            });
            if (moreBtn) {
                var activeBtn = wrap.querySelector('.filter-btn[data-filter="' + filter + '"]');
                var inMore = activeBtn && extraInner.contains(activeBtn);
                moreBtn.classList.toggle('filter-btn--more-active', filter !== 'all' && inMore);
            }
        }

        function applyFilter(filter) {
            setActiveFilter(filter);
            caseCards.forEach(function (card) {
                const raw = card.getAttribute('data-tags') || '';
                const tags = raw.split(/\s+/).filter(Boolean);
                if (filter === 'all' || tags.includes(filter)) {
                    card.classList.remove('hidden');
                    card.style.display = '';
                    card.style.opacity = '0';
                    setTimeout(function () {
                        card.style.transition = 'opacity 0.3s';
                        card.style.opacity = '1';
                    }, 10);
                } else {
                    card.classList.add('hidden');
                    card.style.display = 'none';
                }
            });
        }

        wrap.querySelectorAll('.filter-btn[data-filter]').forEach(function (button) {
            button.addEventListener('click', function () {
                applyFilter(this.getAttribute('data-filter'));
                if (extraPanel && !extraPanel.hidden) {
                    extraPanel.hidden = true;
                    if (moreBtn) moreBtn.setAttribute('aria-expanded', 'false');
                }
            });
        });

        if (moreBtn && extraPanel) {
            moreBtn.addEventListener('click', function (e) {
                if (moreBtn.style.display === 'none') return;
                e.stopPropagation();
                var open = extraPanel.hidden;
                extraPanel.hidden = !open;
                moreBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
            });
            extraPanel.addEventListener('click', function (e) {
                e.stopPropagation();
            });
        }

        document.addEventListener('click', function (e) {
            if (!extraPanel || extraPanel.hidden || !moreBtn) return;
            if (!wrap.contains(e.target)) {
                extraPanel.hidden = true;
                moreBtn.setAttribute('aria-expanded', 'false');
            }
        });

        var resizeTimer;
        function scheduleBalance() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(balanceFilters, 100);
        }

        window.addEventListener('resize', scheduleBalance);

        if (typeof ResizeObserver !== 'undefined') {
            var ro = new ResizeObserver(scheduleBalance);
            ro.observe(wrap);
        }

        requestAnimationFrame(function () {
            requestAnimationFrame(balanceFilters);
        });

        caseCards.forEach(function (card) {
            card.style.display = '';
        });
    });
});

// Юридическая информация и реквизиты (модальное окно)
document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('legal-modal');
    if (!modal) return;

    const openBtns = document.querySelectorAll('[data-open-legal-modal]');
    const closeEls = modal.querySelectorAll('[data-close-legal-modal]');
    let lastFocus = null;

    function openModal() {
        lastFocus = document.activeElement;
        modal.hidden = false;
        document.body.classList.add('legal-modal-open');
        const closeBtn = modal.querySelector('.legal-modal__close');
        if (closeBtn) closeBtn.focus();
    }

    function closeModal() {
        modal.hidden = true;
        document.body.classList.remove('legal-modal-open');
        if (lastFocus && typeof lastFocus.focus === 'function') {
            lastFocus.focus();
        }
    }

    openBtns.forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            openModal();
        });
    });

    closeEls.forEach(function (el) {
        el.addEventListener('click', function () {
            closeModal();
        });
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && !modal.hidden) {
            closeModal();
        }
    });
});

// FAQ Accordion Functionality
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
        }
    });

            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
            } else {
                item.classList.add('active');
            }
        });
    });
});

