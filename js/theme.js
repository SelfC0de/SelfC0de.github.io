(() => {
    const root = document.documentElement;
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;

    toggle.addEventListener('click', () => {
        const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', next === 'dark' ? '#07090f' : '#f5f7fb');
    });
})();
