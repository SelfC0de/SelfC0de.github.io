# SelfC0de Store — visual reference build

## Концепция

Направление: developer app store / product showcase. Визуально проект сочетает плотность интерфейса Raycast, чистую типографику Linear и мягкие aurora-переливания современных product landing pages.

## Подключённые библиотеки

- GSAP 3.13.0 — intro/reveal-анимации.
- GSAP ScrollTrigger 3.13.0 — появление секций при прокрутке.
- Lenis 1.3.24 — плавная прокрутка.

Все библиотеки подключены через CDN в `index.html`. Если CDN недоступен, каталог, поиск, фильтры и скачивание продолжают работать; элементы принудительно показываются без анимации.

## Реализовано

- адаптивный hero с product-window mockup;
- aurora background, animated gradients и shine-эффекты;
- mouse spotlight и лёгкий tilt у карточек;
- GSAP reveal/intro, Lenis smooth scroll;
- `prefers-reduced-motion` для отключения движения;
- поиск по `Ctrl+K` / `Cmd+K`, Escape очищает запрос;
- фильтры платформ, счётчики, empty state;
- светлая и тёмная темы;
- mobile sidebar;
- copy-link toast.

## Где менять приложения

Карточки находятся в `.apps-list` внутри `index.html`. Для новой карточки нужны:

- `data-category`: `windows`, `ios`, `android` или `social`;
- `data-search`: слова для поиска;
- уникальный `id`;
- ссылка на файл в `downloads/`.

## Следующий уровень

Для production лучше перенести CDN-зависимости в локальный build (Vite/Astro), добавить реальные screenshots приложений в AVIF/WebP и генерировать карточки из `apps.json`.
