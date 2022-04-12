var html = $('html');
var body = $('body');

$(function () {
    'use strict';
    tagFeed();
    parallax();
    loadMore();
    offCanvas();
});

function tagFeed() {
    'use strict';
    var count = $('.tag-feed').attr('data-count');

    $('.tag-feed').owlCarousel({
        dots: false,
        nav: true,
        navText: ['', ''],
        responsive: {
            0: {
                items: 1,
            },
            768: {
                items: count > 1 ? 2 : count,
            },
            1200: {
                items: count > 2 ? 3 : count,
            },
            1920: {
                items: count > 3 ? 4 : count,
            },
            2560: {
                items: count > 4 ? 5 : count,
            },
        }
    });
}

function parallax() {
    var image = $('.jarallax-img');
    if (!image) return;

    var options = {
        disableParallax: /iPad|iPhone|iPod|Android/,
        disableVideo: /iPad|iPhone|iPod|Android/,
        speed: 0.1,
    };

    image.imagesLoaded(function () {
        image.parent().jarallax(options).addClass('initialized');
    });
}

function loadMore() {
    'use strict';
    pagination(true);
}

function offCanvas() {
    'use strict';
    var burger = jQuery('.burger');
    var canvasClose = jQuery('.canvas-close');

    burger.on('click', function () {
        html.toggleClass('canvas-opened');
        html.addClass('canvas-visible');
        dimmer('open', 'medium');
    });

    canvasClose.on('click', function () {
        if (html.hasClass('canvas-opened')) {
            html.removeClass('canvas-opened');
            dimmer('close', 'medium');
        }
    });

    jQuery('.dimmer').on('click', function () {
        if (html.hasClass('canvas-opened')) {
            html.removeClass('canvas-opened');
            dimmer('close', 'medium');
        }
    });

    jQuery(document).keyup(function (e) {
        if (e.keyCode == 27 && html.hasClass('canvas-opened')) {
            html.removeClass('canvas-opened');
            dimmer('close', 'medium');
        }
    });
}

function dimmer(action, speed) {
    'use strict';
    var dimmer = jQuery('.dimmer');

    switch (action) {
        case 'open':
            dimmer.fadeIn(speed);
            break;
        case 'close':
            dimmer.fadeOut(speed);
            break;
    }
}
