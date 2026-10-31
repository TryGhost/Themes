function initParallax() {
    jarallax(document.querySelectorAll('.has-parallax-feed .gh-card'), {
        speed: 0.8,
    });
}

(function () {
    if (!document.body.classList.contains('has-background-about')) return;

    const about = document.querySelector('.gh-about');
    if (!about) return;

    const image = about.querySelector('.gh-about-image');

    if (!image.naturalWidth) {
        imagesLoaded(image, function () {
            about.style.setProperty('--about-height', image.clientWidth * image.naturalHeight / image.naturalWidth + 'px');
        });
    }
})();

(function () {
    initParallax();
})();

(function () {
    const toggle = document.querySelector('[data-toggle-comments]');
    if (!toggle) return;

    toggle.addEventListener('click', function () {
        document.body.classList.toggle('comments-opened');
    });
})();

(function () {
    const element = document.querySelector('.gh-article-excerpt');
    if (!element) return;

    const text = element.textContent;
    const emojiRE = /\p{EPres}|\p{ExtPict}/gu;

    const emojis = Array.from(text.matchAll(emojiRE));
    if (!emojis.length) return;

    const fragment = document.createDocumentFragment();
    let offset = 0;

    emojis.forEach(function (emoji) {
        fragment.appendChild(document.createTextNode(text.slice(offset, emoji.index)));
        const span = document.createElement('span');
        span.className = 'emoji';
        span.textContent = emoji[0];
        fragment.appendChild(span);
        offset = emoji.index + emoji[0].length;
    });

    fragment.appendChild(document.createTextNode(text.slice(offset)));
    element.replaceChildren(fragment);
})();

(function () {
    pagination(true, initParallax);
})();
