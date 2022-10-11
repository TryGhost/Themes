$(function () {
    'use strict';
    feed();
});

function feed() {
    'use strict';

    var grid = document.querySelector('.post-feed');
    if (!grid) return;
    var masonry;

    imagesLoaded(grid, function () {
        masonry = new Masonry(grid, {
            itemSelector: '.grid-item',
            columnWidth: '.grid-sizer',
            stamp: '.related-title',
            hiddenStyle: {transform: 'translateY(50px)', opacity: 0},
            visibleStyle: {transform: 'translateY(0)', opacity: 1},
        });

        masonry.on('layoutComplete', function () {
            grid.classList.add('initialized');
        });

        masonry.layout();

        function callback(items, loadNextPage) {
            imagesLoaded(items, function (loaded) {
                masonry.appended(items);
                masonry.layout();
                loaded.elements.forEach(function (item) {
                    item.style.visibility = 'visible';
                });
                loadNextPage();
            });
        }

        pagination(true, callback, true);
    });

    pswp(
        '.post-feed',
        '.post',
        '.post-lightbox',
        '.post-caption',
        false
    );
}

function pswp(container, element, trigger, caption, isGallery) {
    var parseThumbnailElements = function (el) {
        var items = [],
            gridEl,
            linkEl,
            item;

        $(el)
            .find(element)
            .each(function (i, v) {
                gridEl = $(v);
                linkEl = gridEl.find(trigger);

                item = {
                    src: isGallery
                        ? gridEl.find('img').attr('src')
                        : linkEl.attr('href'),
                    w: 0,
                    h: 0,
                };

                if (caption && gridEl.find(caption).length) {
                    item.title = gridEl.find(caption).html();
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

        var index = $(e.target)
            .closest(container)
            .find(element)
            .index($(e.target).closest(element));
        var clickedGallery = $(e.target).closest(container);

        openPhotoSwipe(index, clickedGallery[0]);

        return false;
    };

    $(container).on('click', trigger, function (e) {
        onThumbnailsClick(e);
    });
}
