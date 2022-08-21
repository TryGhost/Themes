(function () {
    jarallax(document.querySelectorAll('.has-parallax-feed .gh-card'), {
        speed: 0.1,
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
