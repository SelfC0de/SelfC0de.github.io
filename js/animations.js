(() => {
    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasFinePointer = matchMedia('(pointer: fine)').matches;

    const revealWithoutLibrary = () => {
        document.querySelectorAll('.reveal-item').forEach((element) => {
            element.style.opacity = '1';
            element.style.transform = 'none';
        });
    };

    if (reduceMotion) {
        revealWithoutLibrary();
        return;
    }

    if (window.Lenis) {
        const lenis = new Lenis({ duration: 1.05, smoothWheel: true, wheelMultiplier: 0.88, touchMultiplier: 1.1 });
        const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
        requestAnimationFrame(raf);
        document.querySelectorAll('a[href^="#"]').forEach((link) => {
            link.addEventListener('click', (event) => {
                const target = document.querySelector(link.getAttribute('href'));
                if (!target) return;
                event.preventDefault();
                lenis.scrollTo(target, { offset: -88 });
            });
        });
    }

    if (window.gsap && window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
        const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
        intro
            .fromTo('.top-bar', { y: -72, opacity: 0 }, { y: 0, opacity: 1, duration: .8 })
            .fromTo('.hero-animate', { y: 34, opacity: 0 }, { y: 0, opacity: 1, duration: .9, stagger: .1 }, '-=.45')
            .fromTo('.product-window', { rotateY: -17, rotateX: 10, scale: .9 }, { rotateY: -7, rotateX: 4, scale: 1, duration: 1.2 }, '-=1.0')
            .fromTo('.float-chip', { scale: .7, opacity: 0 }, { scale: 1, opacity: 1, duration: .7, stagger: .12 }, '-=.65');

        gsap.utils.toArray('.reveal-item').forEach((element) => {
            gsap.to(element, {
                opacity: 1, y: 0, duration: .75, ease: 'power2.out',
                scrollTrigger: { trigger: element, start: 'top 90%', once: true }
            });
        });

        gsap.to('.orb-one', { xPercent: 18, yPercent: 14, duration: 8, repeat: -1, yoyo: true, ease: 'sine.inOut' });
        gsap.to('.orb-two', { xPercent: -22, yPercent: 10, duration: 10, repeat: -1, yoyo: true, ease: 'sine.inOut' });
        gsap.to('.orb-three', { xPercent: 10, yPercent: -18, duration: 12, repeat: -1, yoyo: true, ease: 'sine.inOut' });

        window.addEventListener('catalog:updated', () => ScrollTrigger.refresh());
    } else {
        revealWithoutLibrary();
    }

    if (!hasFinePointer) return;

    document.querySelectorAll('[data-tilt]').forEach((card) => {
        const strength = card.classList.contains('hero-stage') ? 5 : 2.5;
        card.addEventListener('pointermove', (event) => {
            const rect = card.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width;
            const y = (event.clientY - rect.top) / rect.height;
            card.style.setProperty('--mouse-x', `${x * 100}%`);
            card.style.setProperty('--mouse-y', `${y * 100}%`);
            if (card.classList.contains('app-card')) {
                card.style.transform = `perspective(900px) rotateX(${(0.5 - y) * strength}deg) rotateY(${(x - 0.5) * strength}deg) translateY(-2px)`;
            }
        });
        card.addEventListener('pointerleave', () => {
            if (card.classList.contains('app-card')) card.style.transform = '';
        });
    });

    document.querySelectorAll('.magnetic').forEach((button) => {
        button.addEventListener('pointermove', (event) => {
            const rect = button.getBoundingClientRect();
            const x = event.clientX - rect.left - rect.width / 2;
            const y = event.clientY - rect.top - rect.height / 2;
            button.style.transform = `translate(${x * .08}px, ${y * .12}px) translateY(-2px)`;
        });
        button.addEventListener('pointerleave', () => { button.style.transform = ''; });
    });
})();
