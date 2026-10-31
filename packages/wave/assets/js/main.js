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
    var playerAudio = jQuery('audio.player-audio');
    var playerProgress = jQuery('.player-progress');
    var playerSeek = jQuery('.player-seek');
    var timeCurrent = jQuery('.player-time-current');
    var timeDuration = jQuery('.player-time-duration');
    var playButton = jQuery('.button-play');
    var backwardButton = jQuery('.player-backward');
    var forwardButton = jQuery('.player-forward');
    var playerSpeed = 1;
    var speedButton = jQuery('.player-speed');

    if (!playerAudio.length) return;

    function playingPost() {
        return jQuery('.post').filter(function () {
            return jQuery(this).attr('data-id') === player.attr('data-playing');
        });
    }

    jQuery('.site').on('click', '.js-play', function () {
        var clicked = jQuery(this);

        if (clicked.hasClass('post-play')) {
            var episode = clicked.closest('.post');
            if (player.attr('data-playing') !== episode.attr('data-id')) {
                var audioSource = episode.attr('data-url');
                if (!audioSource || !audioSource.trim()) return;

                var audioUrl;
                try {
                    audioUrl = new URL(audioSource, document.baseURI);
                } catch (error) {
                    return;
                }
                if (audioUrl.protocol !== 'http:' && audioUrl.protocol !== 'https:') return;

                playerAudio[0].src = audioUrl.href;
                playingPost().find('.post-play').removeClass('playing');
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
                        playingPost().find('.post-play').addClass('playing');
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
            playingPost().find('.post-play').removeClass('playing');
        }
    });

    function updateProgress() {
        var audio = playerAudio[0];
        var duration = Number.isFinite(audio.duration) ? audio.duration : 0;
        var currentTime = duration > 0 ? audio.currentTime : 0;
        var currentText = new Date(currentTime * 1000).toISOString().substring(11, 19);
        var durationText = new Date(duration * 1000).toISOString().substring(11, 19);
        timeDuration.text(durationText);
        timeCurrent.text(currentText);
        playerSeek.prop('disabled', duration <= 0).attr('max', duration).val(currentTime);
        playerSeek.attr('aria-valuetext', currentText + ' / ' + durationText);
        playerProgress.css(
            'width',
            (duration > 0 ? currentTime / duration : 0) * 100 + '%'
        );
    }

    playerAudio.on('loadedmetadata durationchange timeupdate emptied', updateProgress);
    updateProgress();

    playerSeek.on('input', function () {
        var audio = playerAudio[0];
        if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;

        audio.currentTime = Math.min(audio.duration, Math.max(0, Number(this.value)));
        updateProgress();
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
