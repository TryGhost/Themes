(function () {
    pagination(true);
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
