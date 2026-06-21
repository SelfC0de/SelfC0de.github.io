/* ===== ФИЛЬТР ПО КАТЕГОРИЯМ (сайдбар) ===== */
(function() {
    const links = document.querySelectorAll('.sidebar-link[data-filter]');
    const rows = document.querySelectorAll('.app-row');
    const list = document.querySelector('.apps-list');
    if (!links.length || !rows.length) return;

    function plural(n, forms) {
        const m10 = n % 10, m100 = n % 100;
        if (m10 === 1 && m100 !== 11) return forms[0];
        if ([2,3,4].includes(m10) && ![12,13,14].includes(m100)) return forms[1];
        return forms[2];
    }

    function updateCounts() {
        links.forEach(link => {
            const filter = link.dataset.filter;
            const countEl = link.querySelector('.count');
            if (!countEl) return;
            const count = filter === 'all'
                ? rows.length
                : Array.from(rows).filter(r => r.dataset.category === filter).length;
            countEl.textContent = count;
        });
    }

    function applyFilter(filter, searchQuery = '') {
        let visible = 0;
        rows.forEach(row => {
            const catMatch = filter === 'all' || row.dataset.category === filter;
            const text = (row.dataset.search || '').toLowerCase();
            const searchMatch = !searchQuery || text.includes(searchQuery.toLowerCase());
            const show = catMatch && searchMatch;
            row.classList.toggle('hidden', !show);
            if (show) visible++;
        });

        let empty = list.querySelector('.empty-state');
        if (visible === 0) {
            if (!empty) {
                empty = document.createElement('div');
                empty.className = 'empty-state';
                empty.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="m21 21-4.3-4.3"/>
                    </svg>
                    <div>Ничего не найдено</div>
                `;
                list.appendChild(empty);
            }
        } else if (empty) {
            empty.remove();
        }
    }

    let currentFilter = 'all';
    let currentSearch = '';

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            links.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            currentFilter = link.dataset.filter;
            applyFilter(currentFilter, currentSearch);
            /* закрыть сайдбар на мобиле */
            document.querySelector('.sidebar')?.classList.remove('open');
            document.querySelector('.sidebar-backdrop')?.classList.remove('show');
        });
    });

    /* поиск */
    const search = document.getElementById('searchInput');
    if (search) {
        search.addEventListener('input', () => {
            currentSearch = search.value.trim();
            applyFilter(currentFilter, currentSearch);
        });
    }

    updateCounts();
})();

/* ===== МОБИЛЬНОЕ МЕНЮ ===== */
(function() {
    const btn = document.getElementById('mobileMenuBtn');
    const sidebar = document.querySelector('.sidebar');
    const backdrop = document.querySelector('.sidebar-backdrop');
    if (!btn || !sidebar || !backdrop) return;

    btn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        backdrop.classList.toggle('show');
    });
    backdrop.addEventListener('click', () => {
        sidebar.classList.remove('open');
        backdrop.classList.remove('show');
    });
})();

/* ===== COPY LINK + TOAST ===== */
(function() {
    const toast = document.getElementById('toast');
    if (!toast) return;
    let timer;

    function showToast(message) {
        toast.querySelector('.toast-text').textContent = message;
        toast.classList.add('show');
        clearTimeout(timer);
        timer = setTimeout(() => toast.classList.remove('show'), 2200);
    }

    document.querySelectorAll('[data-copy]').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const slug = btn.dataset.copy;
            const url = `${window.location.origin}${window.location.pathname}#${slug}`;
            try {
                await navigator.clipboard.writeText(url);
                showToast('Ссылка скопирована');
            } catch {
                /* fallback для http и старых браузеров */
                const ta = document.createElement('textarea');
                ta.value = url;
                document.body.appendChild(ta);
                ta.select();
                try { document.execCommand('copy'); showToast('Ссылка скопирована'); }
                catch { showToast('Не удалось скопировать'); }
                ta.remove();
            }
        });
    });

    /* Кнопка скачивания — не триггерит клик по строке */
    document.querySelectorAll('.app-row .btn-get').forEach(btn => {
        btn.addEventListener('click', (e) => e.stopPropagation());
    });
})();
