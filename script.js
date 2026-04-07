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
 * Бронирование звонка: компактное модальное окно + заготовка под LLM.
 * Подключите свой API в window.ASYAKOM_BOOKING_LLM.requestCompletion (см. ниже).
 */
(function () {
    var COPY = {
        ru: {
            title: 'ASYA.KOM',
            subtitle: 'Бронирование звонка',
            intro: 'Привет! Кратко напишите задачу или удобное время — отвечу и подскажу следующий шаг.',
            placeholder: 'Сообщение…',
            send: 'Отправить',
            sendAria: 'Отправить сообщение',
            thinking: 'Печатает…',
            closeAria: 'Закрыть чат',
            error: 'Не удалось получить ответ. Проверьте API или попробуйте позже.',
            stub: 'ИИ ещё не подключён. Укажите requestCompletion в ASYAKOM_BOOKING_LLM (ваш API + systemPrompt).'
        },
        en: {
            title: 'ASYA.KOM',
            subtitle: 'Book a call',
            intro: 'Hi! Describe your request or timing — I will reply with next steps.',
            placeholder: 'Message…',
            send: 'Send',
            sendAria: 'Send message',
            thinking: 'Typing…',
            closeAria: 'Close chat',
            error: 'Could not get a reply. Check your API or try again.',
            stub: 'LLM not connected yet. Wire up ASYAKOM_BOOKING_LLM.requestCompletion (your API + systemPrompt).'
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
     * @type {{ systemPrompt: string, requestCompletion: function(string): Promise<string> }}
     * Замените requestCompletion на вызов OpenAI / Anthropic / своего бэкенда.
     */
    window.ASYAKOM_BOOKING_LLM = window.ASYAKOM_BOOKING_LLM || {
        systemPrompt:
            'You are a concise, friendly studio assistant for ASYA.KOM (analytics, AI, web, voice bots). ' +
            'The user wants to book an informal call. Acknowledge, ask 1–2 short clarifying questions if needed, ' +
            'and suggest next step (e.g. leave contact or preferred time). Keep the reply under 120 words. Language: match the user.',

        requestCompletion: function (userMessage) {
            var self = this;
            return new Promise(function (resolve) {
                setTimeout(function () {
                    resolve(t().stub);
                }, 350);
            });
        }
    };

    var bookingModalEl = null;
    var bookingLastFocus = null;
    var bookingChatEl = null;

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

    function ensureBookingModal() {
        if (bookingModalEl) {
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
            '<p class="booking-messenger__error" id="booking-modal-error" role="alert" hidden></p>' +
            '<div class="booking-messenger__composer">' +
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

        var input = root.querySelector('#booking-modal-input');
        var submit = root.querySelector('#booking-modal-submit');
        var errEl = root.querySelector('#booking-modal-error');

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
            bookingAppendBubble('user', text);
            submit.disabled = true;

            var typingTextSpan = bookingAppendBubble('bot', t().thinking);

            var prompt = window.ASYAKOM_BOOKING_LLM.systemPrompt;
            var fn = window.ASYAKOM_BOOKING_LLM.requestCompletion;

            Promise.resolve()
                .then(function () {
                    return fn.call(window.ASYAKOM_BOOKING_LLM, text, prompt);
                })
                .then(function (answer) {
                    var out = (answer != null ? String(answer) : '').trim() || '—';
                    typingTextSpan.textContent = out;
                })
                .catch(function () {
                    typingTextSpan.textContent = t().error;
                    typingTextSpan.parentElement.classList.add('booking-messenger__bubble--error');
                    errEl.textContent = t().error;
                    errEl.hidden = false;
                })
                .finally(function () {
                    submit.disabled = false;
                    bookingScrollChat();
                    input.focus();
                });
        });

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
        var str = t();
        bookingChatEl = modal.querySelector('#booking-modal-chat');
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
        bookingAppendBubble('bot', str.intro);
        var err = modal.querySelector('#booking-modal-error');
        err.hidden = true;
        err.textContent = '';

        setTimeout(function () {
            input.focus();
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

