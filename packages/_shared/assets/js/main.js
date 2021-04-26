// Mobile menu burger toggle
(function () {
    document.querySelector('.gh-burger').addEventListener('click', function () {
        console.log('whuttt');
        if (!document.body.classList.contains('gh-head-opened')) {
            document.body.classList.add('gh-head-opened');
        } else {
            document.body.classList.remove('gh-head-opened');
        }
    });
})();

/* Detects when a gallery card has been used and applies sizing
 * to make sure the display matches what is seen in the editor. */
(function () {
    var images = document.querySelectorAll('.kg-gallery-image img');
    images.forEach(function (image) {
        var container = image.closest('.kg-gallery-image');
        var width = image.attributes.width.value;
        var height = image.attributes.height.value;
        var ratio = width / height;
        container.style.flex = ratio + ' 1 0%';
    });
})();

(function () {
    reframe(document.querySelectorAll('.gh-content iframe[src*="youtube.com"], .gh-content iframe[src*="vimeo.com"]'));
})();
