(function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.app-card');

    if (!filterButtons.length || !cards.length) return;

    /* Подсчёт количества карточек в каждой категории */
    function updateCounts() {
        filterButtons.forEach(btn => {
            const filter = btn.dataset.filter;
            const countSpan = btn.querySelector('.count');
            if (!countSpan) return;

            const count = filter === 'all'
                ? cards.length
                : Array.from(cards).filter(c => c.dataset.category === filter).length;
            countSpan.textContent = `(${count})`;
        });
    }

    /* Применение фильтра */
    function applyFilter(filter) {
        cards.forEach(card => {
            const match = filter === 'all' || card.dataset.category === filter;
            card.classList.toggle('hidden', !match);
        });

        /* Сообщение, если ничего не найдено */
        const grid = document.querySelector('.apps-grid');
        let empty = grid.querySelector('.empty-state');
        const visibleCount = Array.from(cards).filter(c => !c.classList.contains('hidden')).length;

        if (visibleCount === 0) {
            if (!empty) {
                empty = document.createElement('div');
                empty.className = 'empty-state';
                empty.textContent = 'В этой категории пока нет приложений';
                grid.appendChild(empty);
            }
        } else if (empty) {
            empty.remove();
        }
    }

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            applyFilter(btn.dataset.filter);
        });
    });

    /* Клик по карточке категории прокручивает к Apps и применяет фильтр */
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            const filter = card.dataset.filter;
            const targetBtn = document.querySelector(`.filter-btn[data-filter="${filter}"]`);
            if (targetBtn) targetBtn.click();
            document.getElementById('apps').scrollIntoView({ behavior: 'smooth' });
        });
        card.style.cursor = 'pointer';
    });

    updateCounts();
})();
