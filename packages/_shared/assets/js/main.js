/* Mobile menu burger toggle */
(function () {
    document.querySelector('.gh-burger').addEventListener('click', function () {
        if (!document.body.classList.contains('is-head-open')) {
            document.body.classList.add('is-head-open');
        } else {
            document.body.classList.remove('is-head-open');
        }
    });
})();

/* Detects when a gallery card has been used and applies sizing
to make sure the display matches what is seen in the editor. */
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

/* Responsive video in post content */
(function () {
    const sources = [
        '.gh-content iframe[src*="youtube.com"]',
        '.gh-content iframe[src*="youtube-nocookie.com"]',
        '.gh-content iframe[src*="player.vimeo.com"]',
        '.gh-content iframe[src*="kickstarter.com"][src*="video.html"]',
        '.gh-content object',
        '.gh-content embed',
    ];
    reframe(document.querySelectorAll(sources.join(',')));
})();

/* Pagination - supports load more on click and infinite scrolling */
function pagination(isInfinite) {
    // next link element
    var nextElement = document.querySelector('link[rel=next]');
    if (!nextElement) {
        return;
    }

    // post feed element
    var feedElement = document.querySelector('.gh-feed');
    if (!feedElement) {
        return;
    }

    var buffer = 300;

    var ticking = false;
    var loading = false;

    var lastScrollY = window.scrollY;
    var lastWindowHeight = window.innerHeight;
    var lastDocumentHeight = document.documentElement.scrollHeight;

    var buttonElement = document.querySelector('.gh-loadmore');

    function onPageLoad() {
        if (this.status === 404) {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onResize);
            buttonElement.remove();
            return;
        }

        // append contents
        var postElements = this.response.querySelectorAll('article.gh-card');
        postElements.forEach(function (item) {
            // document.importNode is important, without it the item's owner
            // document will be different which can break resizing of
            // `object-fit: cover` images in Safari
            feedElement.appendChild(document.importNode(item, true));
        });

        // set next link
        var resNextElement = this.response.querySelector('link[rel=next]');
        if (resNextElement) {
            nextElement.href = resNextElement.href;
        } else {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onResize);
            buttonElement.remove();
        }

        // sync status
        lastDocumentHeight = document.documentElement.scrollHeight;
        ticking = false;
        loading = false;
    }

    function onUpdate() {
        // return if already loading
        if (loading) {
            return;
        }

        // return if not scroll to the bottom
        if (isInfinite && lastScrollY + lastWindowHeight <= lastDocumentHeight - buffer) {
            ticking = false;
            return;
        }

        loading = true;

        var xhr = new window.XMLHttpRequest();
        xhr.responseType = 'document';

        xhr.addEventListener('load', onPageLoad);

        xhr.open('GET', nextElement.href);
        xhr.send(null);
    }

    function requestTick() {
        ticking || window.requestAnimationFrame(onUpdate);
        ticking = true;
    }

    function onScroll() {
        lastScrollY = window.scrollY;
        requestTick();
    }

    function onResize() {
        lastWindowHeight = window.innerHeight;
        lastDocumentHeight = document.documentElement.scrollHeight;
        requestTick();
    }

    if (isInfinite) {
        window.addEventListener('scroll', onScroll, {passive: true});
        window.addEventListener('resize', onResize);
        requestTick();
    } else {
        buttonElement.addEventListener('click', requestTick);
    }
}

/* Uses PhotoSwipe for gallery images */
function pswp(container, element, trigger, caption, isGallery) {
    var parseThumbnailElements = function (el) {
        var items = [],
            gridEl,
            linkEl,
            item;

        el.querySelectorAll(element).forEach(function (v) {
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
            arrowEl: false,
            bgOpacity: 0.9,
            closeEl: false,
            closeOnScroll: false,
            fullscreenEl: false,
            history: false,
            index: index,
            shareEl: false,
            showAnimationDuration: 0,
            showHideOpacity: true,
            zoomEl: false,
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

    var triggers = document.querySelectorAll(trigger);
    triggers.forEach(function (trig) {
        trig.addEventListener('click', function (e) {
            onThumbnailsClick(e);
        });
    });
}
