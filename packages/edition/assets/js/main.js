var html = document.documentElement;
var body = document.body;
var lastMonth;
var lastGroup;
var timeout;
var st = 0;
var lastSt = 0;
var titleOffset = 0;
var contentOffset = 0;
var progress = document.querySelector('.sticky-progress');

cover();
subMenu();
featured();
feedLayout();
pagination();
archive();
video();
gallery();
table();
toc();
// modal();
// search();
burger();

window.addEventListener('scroll', function () {
    'use strict';
    if (body.classList.contains('post-template')) {
        if (timeout) {
            window.cancelAnimationFrame(timeout);
        }
        timeout = window.requestAnimationFrame(sticky);
    }

    if (body.classList.contains('home-template') && body.classList.contains('with-full-cover')) {
        if (timeout) {
            window.cancelAnimationFrame(timeout);
        }
        timeout = window.requestAnimationFrame(portalButton);
    }
});

window.addEventListener('load', function () {
    'use strict';
    if (body.classList.contains('post-template')) {
        titleOffset = document.querySelector('.single-title').getBoundingClientRect().top + window.scrollY;

        var content = document.querySelector('.single-content');
        var contentHeight = content.offsetHeight;
        contentOffset = content.getBoundingClientRect().top + window.scrollY + contentHeight - window.innerHeight / 2;
    }
});

function sticky() {
    'use strict';
    st = window.scrollY;

    if (titleOffset > 0 && contentOffset > 0) {
        if (st > lastSt) {
            if (st > titleOffset) {
                body.classList.add('sticky-visible');
            }
        } else {
            if (st <= titleOffset) {
                body.classList.remove('sticky-visible');
            }
        }
    }

    progress.style.transform = 'translate3d(' + (-100 + Math.min((st * 100) / contentOffset, 100)) + '%,0,0)';

    lastSt = st;
}

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
        toggle.innerHTML = '<svg class="icon"><use xlink:href="#dots-horizontal"></use></svg>';

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
            '<svg class="icon"><use xlink:href="#chevron-left"></use></svg>',
            '<svg class="icon"><use xlink:href="#chevron-right"></use></svg>',
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
        localStorage.removeItem('dawn_layout');
    });

    document.querySelector('.feed-layout-expanded').addEventListener('click', function () {
        wrapper.classList.add('expanded');
        feed.classList.add('expanded');
        localStorage.setItem('dawn_layout', 'expanded');
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
            status: '.infinite-scroll-status',
        });

        infScroll.on('append', function (_response, _path, items) {
            items[0].classList.add('feed-paged');
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
    reframe(document.querySelectorAll('.single-content iframe[src*="youtube.com"], .single-content iframe[src*="vimeo.com"]'));
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

function toc() {
    'use strict';
    if (!body.classList.contains('post-template')) return;

    var output = '';
    var toggle = document.querySelector('.sticky-toc-button');

    document.querySelectorAll('.single-content > h2, .single-content > h3')
        .forEach(function (value) {
            var linkClass =
                value.tagName == 'H3'
                    ? 'sticky-toc-link sticky-toc-link-indented'
                    : 'sticky-toc-link';
            output +=
                '<a class="' +
                linkClass +
                '" href="#' +
                value.getAttribute('id') +
                '">' +
                value.textContent +
                '</a>';
        });

    if (output == '') {
        toggle.remove();
        return;
    }

    document.querySelector('.sticky-toc').innerHTML = output;

    toggle.addEventListener('click', function () {
        if (!body.classList.contains('toc-opened')) {
            body.classList.add('toc-opened');
        } else {
            body.classList.remove('toc-opened');
        }
    });

    document.querySelector('.sticky-toc').addEventListener('click', function (e) {
        e.preventDefault();
        if (e.target.classList.contains('sticky-toc-link')) {
            var link = e.target.getAttribute('href');
            document.querySelector(link).scrollIntoView({behavior: 'smooth', block: 'start'});
        }
    });
}

function modal() {
    'use strict';
    var modalOverlay = $('.modal-overlay');
    var modal = $('.modal');
    var modalInput = $('.modal-input');

    $('.js-modal').on('click', function (e) {
        e.preventDefault();
        modalOverlay.show().outerWidth();
        body.addClass('modal-opened');
        modalInput.focus();
    });

    $('.modal-close, .modal-overlay').on('click', function () {
        body.removeClass('modal-opened');
    });

    modal.on('click', function (e) {
        e.stopPropagation();
    });

    $(document).keyup(function (e) {
        if (e.keyCode === 27 && body.hasClass('modal-opened')) {
            body.removeClass('modal-opened');
        }
    });

    modalOverlay.on('transitionend', function (e) {
        if (!body.hasClass('modal-opened')) {
            modalOverlay.hide();
        }
    });

    modal.on('transitionend', function (e) {
        e.stopPropagation();
    });
}

function search() {
    'use strict';
    if (
        typeof gh_search_key == 'undefined' ||
        gh_search_key == '' ||
        typeof gh_search_migration == 'undefined'
    )
        return;

    var searchInput = $('.search-input');
    var searchButton = $('.search-button');
    var searchResult = $('.search-result');
    var popular = $('.popular-wrapper');
    var includeContent = typeof gh_search_content == 'undefined' || gh_search_content == true ? true : false;

    var url =
        siteUrl +
        '/ghost/api/v3/content/posts/?key=' +
        gh_search_key +
        '&limit=all&fields=id,title,url,updated_at,visibility&order=updated_at%20desc';
    url += includeContent ? '&formats=plaintext' : '';
    var indexDump = JSON.parse(localStorage.getItem('dawn_search_index'));
    var index;

    elasticlunr.clearStopWords();

    localStorage.removeItem('dawn_index');
    localStorage.removeItem('dawn_last');

    function update(data) {
        data.posts.forEach(function (post) {
            index.addDoc(post);
        });

        try {
            localStorage.setItem('dawn_search_index', JSON.stringify(index));
            localStorage.setItem('dawn_search_last', data.posts[0].updated_at);
        } catch (e) {
            console.error('Your browser local storage is full. Update your search settings following the instruction at https://github.com/TryGhost/Dawn#disable-content-search');
        }
    }

    if (
        !indexDump ||
        gh_search_migration != localStorage.getItem('dawn_search_migration')
    ) {
        $.get(url, function (data) {
            if (data.posts.length > 0) {
                index = elasticlunr(function () {
                    this.addField('title');
                    if (includeContent) {
                        this.addField('plaintext');
                    }
                    this.setRef('id');
                });

                update(data);

                localStorage.setItem(
                    'dawn_search_migration',
                    gh_search_migration
                );
            }
        });
    } else {
        index = elasticlunr.Index.load(indexDump);

        $.get(
            url +
                "&filter=updated_at:>'" +
                localStorage
                    .getItem('dawn_search_last')
                    .replace(/\..*/, '')
                    .replace(/T/, ' ') +
                "'",
            function (data) {
                if (data.posts.length > 0) {
                    update(data);
                }
            }
        );
    }

    searchInput.on('keyup', function (e) {
        var result = index.search(e.target.value, { expand: true });
        var output = '';

        result.forEach(function (post) {
            output +=
                '<div class="search-result-row">' +
                '<a class="search-result-row-link" href="' +
                post.doc.url +
                '">' +
                post.doc.title +
                '</a>' +
                '</div>';
        });

        searchResult.html(output);

        if (e.target.value.length > 0) {
            searchButton.addClass('search-button-clear');
        } else {
            searchButton.removeClass('search-button-clear');
        }

        if (result.length > 0) {
            popular.hide();
        } else {
            popular.show();
        }
    });

    $('.search-form').on('submit', function (e) {
        e.preventDefault();
    });

    searchButton.on('click', function () {
        if ($(this).hasClass('search-button-clear')) {
            searchInput.val('').focus().keyup();
        }
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

function theme() {
    'use strict';
    var toggle = document.querySelector('.js-theme');
    // var toggleText = toggle.find('.theme-text');

    function system() {
        html.classList.remove('theme-dark', 'theme-light');
        localStorage.removeItem('dawn_theme');
        // toggleText.text(toggle.attr('data-system'));
        toggle.setAttribute('title', toggle.getAttribute('data-system'));
    }

    function dark() {
        html.classList.remove('theme-light');
        html.classList.add('theme-dark');
        localStorage.setItem('dawn_theme', 'dark');
        // toggleText.text(toggle.attr('data-dark'));
        toggle.setAttribute('title', toggle.getAttribute('data-dark'));
    }

    function light() {
        html.classList.remove('theme-dark');
        html.classList.add('theme-light');
        localStorage.setItem('dawn_theme', 'light');
        // toggleText.text(toggle.attr('data-light'));
        toggle.setAttribute('title', toggle.getAttribute('data-light'));
    }

    switch (localStorage.getItem('dawn_theme')) {
        case 'dark':
            dark();
            break;
        case 'light':
            light();
            break;
        default:
            system();
            break;
    }

    toggle.addEventListener('click', function (e) {
        e.preventDefault();

        if (!html.classList.contains('theme-dark') && !html.classList.contains('theme-light')) {
            dark();
        } else if (html.classList.contains('theme-dark')) {
            light();
        } else {
            system();
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
