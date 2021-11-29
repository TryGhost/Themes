var body = $('body');

$(function () {
    'use strict';
    search();
    featured();
    video();
    table();
    mobileMenu();
});

document.addEventListener('lazyloaded', function (e) {
    'use strict';
    var options = {
        disableParallax: /iPad|iPhone|iPod|Android/,
        disableVideo: /iPad|iPhone|iPod|Android/,
        speed: 0.1,
    };

    if ($(e.target).parent('.site-cover').length) {
        $(e.target).parent().jarallax(options).addClass('initialized');
    }
});

function search() {
    'use strict';
    if (
        typeof gh_search_key == 'undefined' ||
        gh_search_key == ''
    )
        return;

    var searchInput = $('.search-field');
    var searchButton = $('.search-button');
    var searchResult = $('.search-result');

    var url =
        siteUrl +
        '/ghost/api/v3/content/posts/?key=' +
        gh_search_key +
        '&limit=all&fields=id,title,excerpt,url,updated_at,visibility&order=updated_at%20desc&formats=plaintext';
    var indexDump = JSON.parse(localStorage.getItem('ease_search_index'));
    var index;

    elasticlunr.clearStopWords();

    localStorage.removeItem('ease_index');
    localStorage.removeItem('ease_last');

    function update(data) {
        data.posts.forEach(function (post) {
            index.addDoc(post);
        });

        localStorage.setItem('ease_search_index', JSON.stringify(index));
        localStorage.setItem('ease_search_last', data.posts[0].updated_at);
    }

    if (
        !indexDump
    ) {
        $.get(url, function (data) {
            if (data.posts.length > 0) {
                index = elasticlunr(function () {
                    this.addField('title');
                    this.addField('plaintext');
                    this.setRef('id');
                });

                update(data);
            }
        });
    } else {
        index = elasticlunr.Index.load(indexDump);

        $.get(
            url +
                "&filter=updated_at:>'" +
                localStorage
                    .getItem('ease_search_last')
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
                '<div class="search-result-row-title">' +
                post.doc.title +
                '</div><div class="search-result-row-excerpt">' +
                post.doc.excerpt +
                '</div></a>' +
                '</div>';
        });

        searchResult.html(output);

        if (e.target.value.length > 0) {
            searchButton.addClass('search-button-clear');
        } else {
            searchButton.removeClass('search-button-clear');
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

    $(document).keyup(function (e) {
        if (e.keyCode === 27) {
            searchInput.val('').focus().keyup();
        }
    });
}

function featured() {
    'use strict';
    $('.featured-posts').owlCarousel({
        dots: false,
        margin: 30,
        nav: true,
        navText: [
            '<i class="icon icon-chevron-left"></i>',
            '<i class="icon icon-chevron-right"></i>',
        ],
        responsive: {
            0: {
                items: 1,
            },
            768: {
                items: 3,
            },
            992: {
                items: 4,
            },
        },
    });
}

function video() {
    'use strict';
    $('.post-content').fitVids();
}

function table() {
    'use strict';
    if (body.hasClass('post-template') || body.hasClass('page-template')) {
        var tables = $('.post-content').find('.table');
        tables.each(function (_, table) {
            var labels = [];

            $(table)
                .find('thead th')
                .each(function (_, label) {
                    labels.push($(label).text());
                });

            $(table)
                .find('tr')
                .each(function (_, row) {
                    $(row)
                        .find('td')
                        .each(function (index, column) {
                            $(column).attr('data-label', labels[index]);
                        });
                });
        });
    }
}

function mobileMenu() {
    'use strict';
    $('.burger').on('click', function () {
        $('body').toggleClass('menu-opened');
    });
}
