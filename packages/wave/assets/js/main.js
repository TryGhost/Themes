$(function () {
    'use strict';
    cover();
    pagination(true);
    player();
});

function cover() {
    'use strict';

    var image = $('.cover-image');
    if (!image) return;

    image.imagesLoaded(function () {
        $('.site-cover').addClass('initialized');
    });
}

function player() {
    'use strict';
    var player = jQuery('.player');
    var playerAudio = jQuery('.player-audio');
    var playerProgress = jQuery('.player-progress');
    var timeCurrent = jQuery('.player-time-current');
    var timeDuration = jQuery('.player-time-duration');
    var playButton = jQuery('.button-play');
    var backwardButton = jQuery('.player-backward');
    var forwardButton = jQuery('.player-forward');
    var playerSpeed = 1;
    var speedButton = jQuery('.player-speed');

    jQuery('.site').on('click', '.js-play', function () {
        var clicked = jQuery(this);

        if (clicked.hasClass('post-play')) {
            var episode = clicked.closest('.post');
            if (player.attr('data-playing') !== episode.attr('data-id')) {
                playerAudio.attr('src', episode.attr('data-url'));
                jQuery('.post[data-id="' + player.attr('data-playing') + '"]').find('.post-play').removeClass('playing');
                player.attr('data-playing', episode.attr('data-id'));
                player.find('.post-image').attr('src', episode.find('.post-image').attr('src'));
                player.find('.post-title').text(episode.find('.post-title').text());
                player.find('.post-meta time').attr('datetime', episode.find('.post-meta-date time').attr('datetime'));
                player.find('.post-meta time').text(episode.find('.post-meta-date time').text());
            }
        }

        if (playerAudio[0].paused) {
            var playPromise = playerAudio[0].play();
            if (playPromise !== undefined) {
                playPromise
                    .then(function () {
                        clicked.addClass('playing');
                        playButton.addClass('playing');
                        jQuery('.post[data-id="' + player.attr('data-playing') + '"]').find('.post-play').addClass('playing');
                        jQuery('body').addClass('player-opened');
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
        } else {
            playerAudio[0].pause();
            clicked.removeClass('playing');
            playButton.removeClass('playing');
            jQuery('.post[data-id="' + player.attr('data-playing') + '"]').find('.post-play').removeClass('playing');
        }
    });

    playerAudio.on('timeupdate', function () {
        const duration = isNaN(playerAudio[0].duration) ? 0 : playerAudio[0].duration;
        timeDuration.text(
            new Date(duration * 1000).toISOString().substring(11, 19)
        );
        playerAudio[0].addEventListener('timeupdate', function (e) {
            timeCurrent.text(
                new Date(e.target.currentTime * 1000)
                    .toISOString()
                    .substring(11, 19)
            );
            playerProgress.css(
                'width',
                (e.target.currentTime / playerAudio[0].duration) * 100 + '%'
            );
        });
    });

    backwardButton.on('click', function () {
        playerAudio[0].currentTime = playerAudio[0].currentTime - 10;
    });

    forwardButton.on('click', function () {
        playerAudio[0].currentTime = playerAudio[0].currentTime + 30;
    });

    speedButton.on('click', function () {
        if (playerSpeed < 2) {
            playerSpeed += 0.5;
        } else {
            playerSpeed = 1;
        }

        playerAudio[0].playbackRate = playerSpeed;
        speedButton.text(playerSpeed + 'x');
    });
}
