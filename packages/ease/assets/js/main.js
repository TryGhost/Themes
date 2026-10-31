jQuery.noConflict();

(function ($) {
    var image = $('.jarallax-img');
    if (!image) return;

    var options = {
        disableParallax: /iPad|iPhone|iPod|Android/,
        disableVideo: /iPad|iPhone|iPod|Android/,
        speed: 0.1,
    };

    image.imagesLoaded(function () {
        image.parent().jarallax(options).addClass('initialized');
    });
})(jQuery);

(function () {
    'use strict';
    var feed = document.querySelector('.featured-posts');
    if (!feed) return;

    var controls = document.querySelector('.featured-controls');
    var previous = controls.querySelector('[data-direction="previous"]');
    var next = controls.querySelector('[data-direction="next"]');
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    var direction = getComputedStyle(feed).direction === 'rtl' ? -1 : 1;

    function updateControls() {
        var maxScroll = feed.scrollWidth - feed.clientWidth;
        var position = Math.abs(feed.scrollLeft);
        controls.hidden = maxScroll <= 1;
        previous.setAttribute('aria-disabled', position <= 1);
        next.setAttribute('aria-disabled', position >= maxScroll - 1);
    }

    controls.addEventListener('click', function (event) {
        var button = event.target.closest('button');
        if (!button || button.getAttribute('aria-disabled') === 'true') return;

        var cardWidth = feed.firstElementChild.getBoundingClientRect().width;
        var gap = parseFloat(getComputedStyle(feed).columnGap);
        var items = Math.round((feed.clientWidth + gap) / (cardWidth + gap));
        var step = items * (cardWidth + gap);
        feed.scrollBy({
            left: direction * (button === next ? step : -step),
            behavior: reducedMotion.matches ? 'instant' : 'smooth',
        });
    });

    feed.addEventListener('scroll', updateControls, {passive: true});
    new ResizeObserver(updateControls).observe(feed);
    updateControls();
})();
