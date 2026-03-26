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

// CTA button click handler
document.querySelector('.cta-button')?.addEventListener('click', function() {
    // Add your booking logic here
    console.log('Book a call clicked');
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

// Cases Filter Functionality
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const caseCards = document.querySelectorAll('.case-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');

            // Filter cases
            caseCards.forEach(card => {
                const tags = card.getAttribute('data-tags').split(' ');
                
                if (filter === 'all' || tags.includes(filter)) {
                    card.classList.remove('hidden');
                    card.style.display = 'block';
                    // Add fade-in animation
                    card.style.opacity = '0';
                    setTimeout(() => {
                        card.style.transition = 'opacity 0.3s';
                        card.style.opacity = '1';
                    }, 10);
                } else {
                    card.classList.add('hidden');
                    card.style.display = 'none';
                }
            });
        });
    });

    // Show all cases on page load (no pagination)
    caseCards.forEach(card => {
        card.style.display = 'block';
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

