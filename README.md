# vue3-PWA-regula
PWA для iOS, копия мобильного приложения для Android

Увидев слои из FSD, не пугайтесь) Это не мое решение.
Так выглядит попытка FSD во vue3. Как по мне - это полная чушь. Архитектура претерпела уже второй рефактор от автора. Лучше не стало.

Загрузил сюда свою часть, которую успел сделать на данный момент

/components - Блок самостоятельных страниц. _Page.vue - страница, все что с ней в корне - внутренние компоненты страницы

/entites - различные DTO, описание интерфейсов и классов, которые используются в features

/features - Любая бизнесс-логика на проекте. В реакте бы это были хуки, а во вью - composable

/stores - Хранилище глобальных переменных. Но не используется ни pinia, ни vuex, ни любое готовое решение. Все на reactive от vue3 из под коробки

/services = /utils
