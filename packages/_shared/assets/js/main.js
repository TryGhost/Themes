/* Mobile menu burger toggle */
(function () {
    var burger = document.querySelector('.gh-burger');
    if (!burger) return;

    burger.addEventListener('click', function () {
        if (!document.body.classList.contains('is-head-open')) {
            document.body.classList.add('is-head-open');
        } else {
            document.body.classList.remove('is-head-open');
        }
    });
})();

/* Detects when a gallery card has been used and applies sizing
to make sure the display matches what is seen in the editor. */
(function () {
    var images = document.querySelectorAll('.kg-gallery-image img');
    images.forEach(function (image) {
        var container = image.closest('.kg-gallery-image');
        var width = image.attributes.width.value;
        var height = image.attributes.height.value;
        var ratio = width / height;
        container.style.flex = ratio + ' 1 0%';
    });

    lightbox(
        '.kg-gallery-container',
        '.kg-gallery-image',
        '.kg-gallery-image',
        false,
        true
    );

    lightbox(
        '.kg-image-card',
        '.kg-image',
        '.kg-image',
        false,
        false
    );
})();

/* Responsive video in post content */
(function () {
    const sources = [
        '.gh-content iframe[src*="youtube.com"]',
        '.gh-content iframe[src*="youtube-nocookie.com"]',
        '.gh-content iframe[src*="player.vimeo.com"]',
        '.gh-content iframe[src*="kickstarter.com"][src*="video.html"]',
        '.gh-content object',
        '.gh-content embed',
    ];
    reframe(document.querySelectorAll(sources.join(',')));
})();
