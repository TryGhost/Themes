(function () {
    const header = document.querySelector('.gh-header');
    const services = document.querySelector('.gh-podcast-service-list');
    if (!header || !services) return;

    header.style.setProperty('--header-height', `calc(100vh - ${services.offsetHeight}px)`);
})();

(function () {
    pagination(true);
})();
