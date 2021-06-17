(function () {
    var bodyClass = document.body.classList;
    var overlay = document.querySelector('.gh-modal-overlay');

    document.querySelectorAll('.js-archive').forEach(function (element) {
        element.addEventListener('click', function () {
            overlay.style.display = 'block';
            window.setTimeout(function () {
                bodyClass.add('is-modal-open');
            }, 0);
        })
    });

    document.querySelector('.gh-modal-close').addEventListener('click', function () {
        bodyClass.remove('is-modal-open');
        window.setTimeout(function () {
            overlay.style.display = 'none';
        }, 200);
    });
})();
