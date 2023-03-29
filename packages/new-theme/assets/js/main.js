(function () {
    pagination(true);
})();

(function () {
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

    observer.observe(document.querySelector('.gh-main > .gh-cta'));
})();
