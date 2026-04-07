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

// CTA button click handler (все кнопки на странице, как на главной и в кейсах)
document.querySelectorAll('.cta-button').forEach(function (btn) {
    btn.addEventListener('click', function () {
        // Add your booking logic here
        console.log('Book a call clicked');
    });
});

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

