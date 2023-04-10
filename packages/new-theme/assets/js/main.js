(function () {
    pagination(true);
})();

(function () {
    if (!document.body.classList.contains('post-template')) return;

    const cover = document.querySelector('.gh-article-cover');
    if (!cover) return;

    const image = cover.querySelector('.gh-article-image');

    window.addEventListener('load', function () {
        cover.style.setProperty('--cover-height', image.clientWidth * image.naturalHeight / image.naturalWidth + 'px');
        cover.classList.remove('loading');
    });
})();

(function () {
    const cta = document.querySelector('.gh-main > .gh-cta');

    if (!cta) {
        document.body.classList.add('has-sticky-cta');
        return;
    }

    var observer = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) {
            document.body.classList.add('has-sticky-cta');
        }
        else {
            document.body.classList.remove('has-sticky-cta');
        }
    }, {
        threshold: 0.5
    });

    observer.observe(cta);
})();
