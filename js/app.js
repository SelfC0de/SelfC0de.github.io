(() => {
    const links = [...document.querySelectorAll('.sidebar-link[data-filter]')];
    const rows = [...document.querySelectorAll('.app-row')];
    const list = document.querySelector('.apps-list');
    const visibleCount = document.getElementById('visibleCount');
    const search = document.getElementById('searchInput');
    let currentFilter = 'all';
    let currentSearch = '';

    const plural = (n) => {
        const mod10 = n % 10;
        const mod100 = n % 100;
        if (mod10 === 1 && mod100 !== 11) return 'приложение доступно';
        if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) return 'приложения доступны';
        return 'приложений доступно';
    };

    const updateCounts = () => {
        links.forEach((link) => {
            const count = link.dataset.filter === 'all'
                ? rows.length
                : rows.filter((row) => row.dataset.category === link.dataset.filter).length;
            const countNode = link.querySelector('.count');
            if (countNode) countNode.textContent = String(count);
        });
    };

    const applyFilter = () => {
        let visible = 0;
        rows.forEach((row) => {
            const categoryMatches = currentFilter === 'all' || row.dataset.category === currentFilter;
            const queryMatches = !currentSearch || (row.dataset.search || '').toLowerCase().includes(currentSearch);
            const show = categoryMatches && queryMatches;
            row.classList.toggle('hidden', !show);
            row.setAttribute('aria-hidden', String(!show));
            if (show) visible += 1;
        });

        if (visibleCount) visibleCount.textContent = `${visible} ${plural(visible)}`;
        const previousEmpty = list?.querySelector('.empty-state');
        if (!list) return;
        if (visible === 0 && !previousEmpty) {
            const empty = document.createElement('div');
            empty.className = 'empty-state';
            empty.innerHTML = '<div><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg><strong>Ничего не найдено</strong><p>Попробуйте изменить запрос или выбрать другую категорию.</p></div>';
            list.appendChild(empty);
        } else if (visible > 0 && previousEmpty) {
            previousEmpty.remove();
        }
        window.dispatchEvent(new CustomEvent('catalog:updated'));
    };

    links.forEach((link) => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            links.forEach((item) => item.classList.remove('active'));
            link.classList.add('active');
            currentFilter = link.dataset.filter;
            applyFilter();
            document.getElementById('apps')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            closeSidebar();
        });
    });

    search?.addEventListener('input', () => {
        currentSearch = search.value.trim().toLowerCase();
        applyFilter();
    });

    document.addEventListener('keydown', (event) => {
        const modifier = navigator.platform.toLowerCase().includes('mac') ? event.metaKey : event.ctrlKey;
        if (modifier && event.key.toLowerCase() === 'k') {
            event.preventDefault();
            search?.focus();
            search?.select();
        }
        if (event.key === 'Escape' && document.activeElement === search) {
            search.value = '';
            currentSearch = '';
            search.blur();
            applyFilter();
        }
    });

    updateCounts();
    applyFilter();

    const menuButton = document.getElementById('mobileMenuBtn');
    const sidebar = document.getElementById('sidebar');
    const backdrop = document.getElementById('sidebarBackdrop');

    function closeSidebar() {
        sidebar?.classList.remove('open');
        backdrop?.classList.remove('show');
        menuButton?.setAttribute('aria-expanded', 'false');
    }

    menuButton?.addEventListener('click', () => {
        const open = !sidebar?.classList.contains('open');
        sidebar?.classList.toggle('open', open);
        backdrop?.classList.toggle('show', open);
        menuButton.setAttribute('aria-expanded', String(open));
    });
    backdrop?.addEventListener('click', closeSidebar);

    const toast = document.getElementById('toast');
    let toastTimer;
    const showToast = (message) => {
        if (!toast) return;
        const text = toast.querySelector('.toast-text');
        if (text) text.textContent = message;
        toast.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = window.setTimeout(() => toast.classList.remove('show'), 2200);
    };

    document.querySelectorAll('[data-copy]').forEach((button) => {
        button.addEventListener('click', async (event) => {
            event.stopPropagation();
            const url = `${location.origin}${location.pathname}#${button.dataset.copy}`;
            try {
                await navigator.clipboard.writeText(url);
                showToast('Ссылка скопирована');
            } catch {
                const textarea = document.createElement('textarea');
                textarea.value = url;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                const copied = document.execCommand('copy');
                textarea.remove();
                showToast(copied ? 'Ссылка скопирована' : 'Не удалось скопировать');
            }
        });
    });
})();
