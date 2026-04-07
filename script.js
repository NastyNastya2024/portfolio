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

// Burger menu
document.addEventListener('DOMContentLoaded', function() {
    const burger = document.querySelector('.burger');
    const menu = document.querySelector('.nav.nav-dropdown');

    if (!burger || !menu) return;

    const closeMenu = () => {
        menu.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
    };

    burger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = menu.classList.toggle('is-open');
        burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    document.addEventListener('click', closeMenu);
    window.addEventListener('resize', closeMenu);
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
            document.querySelectorAll('.features .service-card--filter').forEach(function (c) {
                c.classList.remove('active');
            });
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

        function clearTagFiltersVisual() {
            wrap.querySelectorAll('.filter-btn[data-filter]').forEach(function (b) {
                b.classList.remove('active');
            });
            if (moreBtn) {
                moreBtn.classList.remove('filter-btn--more-active');
            }
        }

        function applyServiceCardFilter(button) {
            const raw = button.getAttribute('data-filter-tags') || '';
            const tokens = raw.split(/\s+/).filter(Boolean);
            const matchMode = button.getAttribute('data-filter-match') || 'any';

            document.querySelectorAll('.features .service-card--filter').forEach(function (c) {
                c.classList.toggle('active', c === button);
            });

            clearTagFiltersVisual();
            if (extraPanel && !extraPanel.hidden) {
                extraPanel.hidden = true;
                if (moreBtn) moreBtn.setAttribute('aria-expanded', 'false');
            }

            caseCards.forEach(function (card) {
                const tags = (card.getAttribute('data-tags') || '').split(/\s+/).filter(Boolean);
                const ok = matchMode === 'all'
                    ? tokens.every(function (t) { return tags.includes(t); })
                    : tokens.some(function (t) { return tags.includes(t); });

                if (ok) {
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

            casesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

        const featureServiceCards = document.querySelectorAll('.features .service-card--filter');
        featureServiceCards.forEach(function (sc) {
            sc.addEventListener('click', function () {
                applyServiceCardFilter(sc);
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

