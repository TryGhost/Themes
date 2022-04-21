var body = $('body');

$(function () {
    'use strict';
    player();
    popup();
    subscribe();
});

function player() {
    'use strict';
    var playerAudio = jQuery('.player-audio');
    var playerProgress = jQuery('.player-progress');
    var timeCurrent = jQuery('.player-time-current');
    var timeDuration = jQuery('.player-time-duration');

    jQuery('.js-play').on('click', function () {
        var clicked = jQuery(this);

        if (playerAudio[0].paused) {
            var playPromise = playerAudio[0].play();
            if (playPromise !== undefined) {
                playPromise
                    .then(function () {
                        clicked.addClass('playing');
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
        } else {
            playerAudio[0].pause();
            clicked.removeClass('playing');
        }
    });

    playerAudio.on('timeupdate', function () {
        timeDuration.text(
            new Date(playerAudio[0].duration * 1000).toISOString().substr(11, 8)
        );
        playerAudio[0].addEventListener('timeupdate', function (e) {
            timeCurrent.text(
                new Date(e.target.currentTime * 1000)
                    .toISOString()
                    .substr(11, 8)
            );
            playerProgress.css(
                'width',
                (e.target.currentTime / playerAudio[0].duration) * 100 + '%'
            );
        });
    });
}

function popup() {
    'use strict';
    jQuery('.js-popup').on('click', function () {
        jQuery(this).parent().toggleClass('popup-opened');
    });
}

function subscribe() {
    'use strict';
    var subscribeButton = jQuery('.header-button-subscribe');
    var currentText = subscribeButton.text();
    var closeIcon = '<i class="icon icon-window-close"></i>';

    subscribeButton.on('click', function () {
        if (subscribeButton.parent().hasClass('popup-opened')) {
            subscribeButton.html(closeIcon);
        } else {
            subscribeButton.html(currentText);
        }
    });
}
