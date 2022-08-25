(function () {
    jarallax(document.querySelectorAll('.has-parallax-feed .gh-card'), {
        speed: 0.8,
    });
})();

(function () {
    document.querySelector('[data-toggle-comments]').addEventListener('click', function () {
        document.body.classList.toggle('comments-opened');
    });

    document.querySelector('.gh-comments').addEventListener('click', function (e) {
        e.stopPropagation();
        document.body.classList.toggle('modal-opened');
    });
})();

// (function () {
//     if (!document.body.classList.contains('has-background-about')) return;

//     const about = document.querySelector('.gh-about');
//     if (!about) return;

//     const image = about.querySelector('.gh-about-image');

//     imagesLoaded(image, function () {
//         about.style.setProperty('--about-height', image.clientWidth * image.naturalHeight / image.naturalWidth + 'px');
//         about.classList.add('initialized');
//     });
// })();
