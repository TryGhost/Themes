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

    pswp(
        '.kg-gallery-container',
        '.kg-gallery-image',
        '.kg-gallery-image',
        false,
        true
    );
})();

// Responsive video in post content
(function () {
    reframe(document.querySelectorAll('.gh-content iframe[src*="youtube.com"], .gh-content iframe[src*="vimeo.com"]'));
})();

function pswp(container, element, trigger, caption, isGallery) {
    var parseThumbnailElements = function (el) {
        var items = [],
            gridEl,
            linkEl,
            item;

        el
            .querySelectorAll(element)
            .forEach(function (v) {
                gridEl = v;
                linkEl = gridEl.querySelector(trigger);

                item = {
                    src: isGallery
                        ? gridEl.querySelector('img').getAttribute('src')
                        : linkEl.getAttribute('href'),
                    w: 0,
                    h: 0,
                };

                if (caption && gridEl.querySelector(caption)) {
                    item.title = gridEl.querySelector(caption).innerHTML;
                }

                items.push(item);
            });

        return items;
    };

    var openPhotoSwipe = function (index, galleryElement) {
        var pswpElement = document.querySelectorAll('.pswp')[0],
            gallery,
            options,
            items;

        items = parseThumbnailElements(galleryElement);

        options = {
            closeOnScroll: false,
            history: false,
            index: index,
            shareEl: false,
            showAnimationDuration: 0,
            showHideOpacity: true,
        };

        gallery = new PhotoSwipe(
            pswpElement,
            PhotoSwipeUI_Default,
            items,
            options
        );
        gallery.listen('gettingData', function (index, item) {
            if (item.w < 1 || item.h < 1) {
                // unknown size
                var img = new Image();
                img.onload = function () {
                    // will get size after load
                    item.w = this.width; // set image width
                    item.h = this.height; // set image height
                    gallery.updateSize(true); // reinit Items
                };
                img.src = item.src; // let's download image
            }
        });
        gallery.init();
    };

    var onThumbnailsClick = function (e) {
        e.preventDefault();

        var siblings = e.target.closest(container).querySelectorAll(element);
        var nodes = Array.prototype.slice.call(siblings);
        var index = nodes.indexOf(e.target.closest(element));
        var clickedGallery = e.target.closest(container);

        openPhotoSwipe(index, clickedGallery);

        return false;
    };

    // container = document.querySelector(container);
    // if (!container) return;

    var triggers = document.querySelectorAll(trigger);
    triggers.forEach(function (trig) {
        trig.addEventListener('click', function (e) {
            onThumbnailsClick(e);
        });
    });
}
