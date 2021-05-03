var html = document.documentElement;
var body = document.body;
var lastMonth;
var lastGroup;
var timeout;
var st = 0;

cover();
subMenu();
featured();
feedLayout();
pagination();
archive();
video();
gallery();
table();
burger();

window.addEventListener('scroll', function () {
    'use strict';
    if (body.classList.contains('home-template') && body.classList.contains('with-full-cover')) {
        if (timeout) {
            window.cancelAnimationFrame(timeout);
        }
        timeout = window.requestAnimationFrame(portalButton);
    }
});

function portalButton() {
    'use strict';
    st = window.scrollY;

    if (st > 300) {
        body.classList.add('portal-visible');
    } else {
        body.classList.remove('portal-visible');
    }
}

function cover() {
    'use strict';
    var cover = document.querySelector('.cover');
    if (!cover) return;

    imagesLoaded(cover, function () {
        cover.classList.remove('image-loading');
    });

    document.querySelector('.cover-arrow').addEventListener('click', function () {
        var element = cover.nextElementSibling;
        element.scrollIntoView({behavior: 'smooth', block: 'start'});
    });
}

function subMenu() {
    'use strict';
    var nav = document.querySelector('.header-nav');
    var items = nav.querySelectorAll('.menu-item');

    function getSiblings(el, filter) {
        var siblings = [];
        while (el= el.nextSibling) { if (!filter || filter(el)) siblings.push(el); }
        return siblings;
    }

    function exampleFilter(el) {
        return el.nodeName.toLowerCase() == 'a';
    }

    if (items.length > 5) {
        var separator = items[4];

        var toggle = document.createElement('button');
        toggle.setAttribute('class', 'button-icon menu-item-button menu-item-more');
        toggle.setAttribute('aria-label', 'More');
        toggle.innerHTML = '<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M21.333 16c0-1.473 1.194-2.667 2.667-2.667v0c1.473 0 2.667 1.194 2.667 2.667v0c0 1.473-1.194 2.667-2.667 2.667v0c-1.473 0-2.667-1.194-2.667-2.667v0zM13.333 16c0-1.473 1.194-2.667 2.667-2.667v0c1.473 0 2.667 1.194 2.667 2.667v0c0 1.473-1.194 2.667-2.667 2.667v0c-1.473 0-2.667-1.194-2.667-2.667v0zM5.333 16c0-1.473 1.194-2.667 2.667-2.667v0c1.473 0 2.667 1.194 2.667 2.667v0c0 1.473-1.194 2.667-2.667 2.667v0c-1.473 0-2.667-1.194-2.667-2.667v0z"></path></svg>';

        var wrapper = document.createElement('div');
        wrapper.setAttribute('class', 'sub-menu');

        var children = getSiblings(separator, exampleFilter);

        children.forEach(function (child) {
            wrapper.appendChild(child);
        });

        toggle.appendChild(wrapper);
        separator.parentNode.appendChild(toggle);

        toggle.addEventListener('click', function () {
            if (window.getComputedStyle(wrapper).display == 'none') {
                wrapper.style.display = 'block';
                wrapper.classList.add('animate__animated', 'animate__bounceIn');
            } else {
                wrapper.classList.add('animate__animated', 'animate__zoomOut');
            }
        });

        wrapper.addEventListener('animationend', function (e) {
            wrapper.classList.remove('animate__animated', 'animate__bounceIn', 'animate__zoomOut');
            if (e.animationName == 'zoomOut') {
                wrapper.style.display = 'none';
            }
        });
    }
}

function featured() {
    'use strict';
    var feed = document.querySelector('.featured-feed');
    if (!feed) return;

    tns({
        container: feed,
        controlsText: [
            '<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M20.547 22.107L14.44 16l6.107-6.12L18.667 8l-8 8 8 8 1.88-1.893z"></path></svg>',
            '<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M11.453 22.107L17.56 16l-6.107-6.12L13.333 8l8 8-8 8-1.88-1.893z"></path></svg>',
        ],
        gutter: 30,
        loop: false,
        nav: false,
        responsive: {
            0: {
                items: 1,
            },
            768: {
                items: 2,
            },
            992: {
                items: 3,
            },
        },
    });
}

function feedLayout() {
    'use strict';
    var wrapper = document.querySelector('.feed-layout');
    if (!wrapper) return;

    var feed = document.querySelector('.post-feed');

    document.querySelector('.feed-layout-headline').addEventListener('click', function () {
        wrapper.classList.remove('expanded');
        feed.classList.remove('expanded');
        localStorage.setItem('edition_layout', 'compact');
    });

    document.querySelector('.feed-layout-expanded').addEventListener('click', function () {
        wrapper.classList.add('expanded');
        feed.classList.add('expanded');
        localStorage.removeItem('edition_layout');
    });
}

function pagination() {
    'use strict';
    var infScroll;

    if (body.classList.contains('paged-next')) {
        infScroll = new InfiniteScroll('.post-feed', {
            append: '.feed',
            button: '.infinite-scroll-button',
            debug: false,
            hideNav: '.pagination',
            history: false,
            path: '.pagination .older-posts',
            scrollThreshold: false,
        });

        var button = document.querySelector('.infinite-scroll-button');

        infScroll.on('request', function (_path, _fetchPromise) {
            button.classList.add('loading');
        });

        infScroll.on('append', function (_response, _path, items) {
            items[0].classList.add('feed-paged');
            button.classList.remove('loading');
            archive(items);
        });
    }
}

function archive(data) {
    'use strict';
    if (!body.classList.contains('logged-in')) return;

    var posts = data || document.querySelectorAll('.feed');

    posts.forEach(function (post) {
        var current = post.getAttribute('data-month');
        if (current != lastMonth) {
            var month = document.createElement('div');
            month.className = 'feed-month';
            month.innerText = current;

            var group = document.createElement('div');
            group.className = 'feed-group';
            group.appendChild(month);

            feed.insertBefore(group, post);

            group.appendChild(post);

            lastMonth = current;
            lastGroup = group;
        } else {
            lastGroup.appendChild(post);
        }
    });
}

function video() {
    'use strict';
    const sources = [
        '.single-content iframe[src*="youtube.com"]',
        '.single-content iframe[src*="youtube-nocookie.com"]',
        '.single-content iframe[src*="player.vimeo.com"]',
        '.single-content iframe[src*="kickstarter.com"][src*="video.html"]',
        'object',
        'embed',
    ];

    reframe(document.querySelectorAll(sources.join(',')));
}

function gallery() {
    'use strict';
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
}

function table() {
    'use strict';
    if (!body.classList.contains('post-template') && !body.classList.contains('page-template')) return;

    var tables = document.querySelectorAll('.single-content .table');

    tables.forEach(function (table) {
        var labels = [];

        table.querySelectorAll('thead th').forEach(function (label) {
            labels.push(label.textContent);
        });

        table.querySelectorAll('tr').forEach(function (row) {
            row.querySelectorAll('td').forEach(function (column, index) {
                column.setAttribute('data-label', labels[index]);
            });
        });
    });
}

function burger() {
    'use strict';
    document.querySelector('.burger').addEventListener('click', function () {
        if (!body.classList.contains('menu-opened')) {
            body.classList.add('menu-opened');
        } else {
            body.classList.remove('menu-opened');
        }
    });
}

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
