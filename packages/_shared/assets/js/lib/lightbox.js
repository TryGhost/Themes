function lightbox(trigger) {
    var onThumbnailsClick = function (e) {
        e.preventDefault();

        var items = [];
        var index = 0;

        var previousElementSibling = e.target.closest('.kg-card').previousElementSibling;
        if (previousElementSibling) {
            while (previousElementSibling.classList.contains('kg-image-card') || previousElementSibling.classList.contains('kg-gallery-card')) {
                var prevItems = [];

                previousElementSibling.querySelectorAll('img').forEach(function (item) {
                    prevItems.push({
                        src: item.getAttribute('src'),
                        msrc: item.getAttribute('src'),
                        w: item.getAttribute('width'),
                        h: item.getAttribute('height'),
                        el: item,
                    })

                    index += 1;
                });
                previousElementSibling = previousElementSibling.previousSibling;

                items = prevItems.concat(items);
            }
        }

        if (e.target.classList.contains('kg-image')) {
            items.push({
                src: e.target.getAttribute('src'),
                msrc: e.target.getAttribute('src'),
                w: e.target.getAttribute('width'),
                h: e.target.getAttribute('height'),
                el: e.target,
            });
        } else {
            var reachedCurrentItem = false;

            e.target.closest('.kg-gallery-card').querySelectorAll('img').forEach(function (item) {
                items.push({
                    src: item.getAttribute('src'),
                    msrc: item.getAttribute('src'),
                    w: item.getAttribute('width'),
                    h: item.getAttribute('height'),
                    el: item,
                });

                if (!reachedCurrentItem && item !== e.target) {
                    index += 1;
                } else {
                    reachedCurrentItem = true;
                }
            });
        }

        var nextElementSibling = e.target.closest('.kg-card').nextElementSibling;
        if (nextElementSibling) {
            while (nextElementSibling.classList.contains('kg-image-card') || nextElementSibling.classList.contains('kg-gallery-card')) {
                nextElementSibling.querySelectorAll('img').forEach(function (item) {
                    items.push({
                        src: item.getAttribute('src'),
                        msrc: item.getAttribute('src'),
                        w: item.getAttribute('width'),
                        h: item.getAttribute('height'),
                        el: item,
                    })
                });
                nextElementSibling = nextElementSibling.nextSibling;
            }
        }

        var pswpElement = document.querySelectorAll('.pswp')[0];

        var options = {
            bgOpacity: 0.9,
            closeOnScroll: true,
            fullscreenEl: false,
            history: false,
            index: index,
            shareEl: false,
            zoomEl: false,
            getThumbBoundsFn: function(index) {
                var thumbnail = items[index].el,
                    pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                    rect = thumbnail.getBoundingClientRect();

                return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
            }
        }

        var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
        gallery.init();

        return false;
    };

    var triggers = document.querySelectorAll(trigger);
    triggers.forEach(function (trig) {
        trig.addEventListener('click', function (e) {
            onThumbnailsClick(e);
        });
    });
}
