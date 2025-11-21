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
                    // Add fade-in animation
                    card.style.opacity = '0';
                    setTimeout(() => {
                        card.style.transition = 'opacity 0.3s';
                        card.style.opacity = '1';
                    }, 10);
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // Pagination dots
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            dots.forEach(d => d.classList.remove('active'));
            this.classList.add('active');
            // Add pagination logic here if needed
        });
    });

    // Pagination arrows
    const prevBtn = document.querySelector('.arrow-btn.prev');
    const nextBtn = document.querySelector('.arrow-btn.next');
    let currentPage = 0;
    const totalPages = dots.length;

    nextBtn?.addEventListener('click', function() {
        if (currentPage < totalPages - 1) {
            currentPage++;
            updatePagination();
        }
    });

    prevBtn?.addEventListener('click', function() {
        if (currentPage > 0) {
            currentPage--;
            updatePagination();
        }
    });

    function updatePagination() {
        dots.forEach((dot, index) => {
            if (index === currentPage) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });

        if (prevBtn) {
            prevBtn.disabled = currentPage === 0;
        }
        if (nextBtn) {
            nextBtn.disabled = currentPage === totalPages - 1;
        }
    }
});

