/* ===== REVEAL ПРИ СКРОЛЛЕ ===== */
(function() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('visible'), i * 60);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

/* ===== ПАРАЛЛАКС ===== */
(function() {
    const parallaxBg = document.getElementById('parallaxBg');
    if (!parallaxBg) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                parallaxBg.style.transform = `translateY(${scrolled * 0.3}px)`;
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
})();

/* ===== АКТИВНЫЙ ПУНКТ МЕНЮ ПРИ СКРОЛЛЕ ===== */
(function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    if (!sections.length || !navLinks.length) return;

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === '#' + id);
                });
            }
        });
    }, {
        rootMargin: '-40% 0px -55% 0px',
        threshold: 0
    });

    sections.forEach(s => sectionObserver.observe(s));
})();

/* ===== МОБИЛЬНОЕ МЕНЮ ===== */
(function() {
    const toggle = document.getElementById('menuToggle');
    const links = document.getElementById('navLinks');
    if (!toggle || !links) return;

    toggle.addEventListener('click', () => {
        links.classList.toggle('open');
    });

    links.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => links.classList.remove('open'));
    });
})();
