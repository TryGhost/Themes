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
    var playerTrack = jQuery('.player-track');
    var timeCurrent = jQuery('.player-time-current');
    var timeDuration = jQuery('.player-time-duration');
    var playButton = jQuery('.button-play');
    var backwardButton = jQuery('.player-backward');
    var forwardButton = jQuery('.player-forward');
    var playerSpeed = 1;
    var speedButton = jQuery('.player-speed');

    if (!playerAudio.length) return;

    var audio = playerAudio[0];
    var minBufferingMs = 450;
    var bufferingStartedAt = 0;
    var clearBufferingTimer;
    var playRequestTrigger = null;

    function removeBuffering() {
        jQuery('.js-play.is-buffering').removeClass('is-buffering').removeAttr('aria-busy');
    }

    function clearBuffering() {
        clearTimeout(clearBufferingTimer);
        var remaining = minBufferingMs - (Date.now() - bufferingStartedAt);
        if (remaining > 0) {
            clearBufferingTimer = setTimeout(removeBuffering, remaining);
            return;
        }
        removeBuffering();
    }

    function setBuffering(trigger) {
        clearTimeout(clearBufferingTimer);
        removeBuffering();
        bufferingStartedAt = Date.now();
        jQuery(trigger).addClass('is-buffering').attr('aria-busy', 'true');
    }

    function formatTime(seconds) {
        return new Date(seconds * 1000).toISOString().substring(11, 19);
    }

    function setPlaying(playing) {
        var postPlay = player.attr('data-playing')
            ? jQuery('.post[data-id="' + player.attr('data-playing') + '"]').find('.post-play')
            : jQuery();
        if (playing) {
            playButton.addClass('playing');
            postPlay.addClass('playing');
            jQuery('body').addClass('player-opened');
        } else {
            playButton.removeClass('playing');
            postPlay.removeClass('playing');
        }
    }

    // On mobile, make the full thumbnail area trigger play
    if (window.matchMedia('(max-width: 767px)').matches) {
        jQuery('.site').on('click', '.post-media-link', function (e) {
            e.preventDefault();
            var play = jQuery(this).closest('.post-media').find('.js-play');
            if (play.length) play.trigger('click');
        });
    }

    // Click handler
    jQuery('.site').on('click', '.js-play', function () {
        var trigger = this;
        var clicked = jQuery(trigger);
        var post = clicked.closest('.post');
        var isNewPost = post.length && post.attr('data-id') && player.attr('data-playing') !== post.attr('data-id');

        if (isNewPost) {
            jQuery('.post[data-id="' + player.attr('data-playing') + '"]').find('.post-play').removeClass('playing');
            playerAudio.attr('src', post.attr('data-url'));
            player.attr('data-playing', post.attr('data-id'));
            player.find('.post-image').attr('src', post.find('.post-image').attr('src'));
            player.find('.post-title').text(post.find('.post-title').text());
            player.find('.post-meta time').attr('datetime', post.find('.post-meta-date time').attr('datetime'));
            player.find('.post-meta time').text(post.find('.post-meta-date time').text());
        }

        if (audio.paused || isNewPost) {
            var bufferingTarget = jQuery(trigger).find('.player-spinner').length ? trigger : playButton[0];
            playRequestTrigger = bufferingTarget;
            setBuffering(bufferingTarget);
            audio.play().catch(function (error) {
                console.error(error);
                playRequestTrigger = null;
                clearBuffering();
            });
        } else {
            audio.pause();
        }
    });

    // Time display (fix: separate listeners, no nesting)
    audio.addEventListener('timeupdate', function () {
        timeCurrent.text(formatTime(audio.currentTime));
        if (!isNaN(audio.duration) && audio.duration > 0) {
            playerProgress.css('width', (audio.currentTime / audio.duration * 100) + '%');
        }
    });

    audio.addEventListener('durationchange', function () {
        timeDuration.text(formatTime(isNaN(audio.duration) ? 0 : audio.duration));
    });

    // Audio state events
    audio.addEventListener('playing', function () {
        playRequestTrigger = null;
        clearBuffering();
        setPlaying(true);
    });

    audio.addEventListener('pause', function () {
        playRequestTrigger = null;
        clearBuffering();
        setPlaying(false);
    });

    ['ended', 'error'].forEach(function (eventName) {
        audio.addEventListener(eventName, function () {
            playRequestTrigger = null;
            clearBuffering();
            setPlaying(false);
        });
    });

    audio.addEventListener('waiting', function () {
        if (playRequestTrigger && playRequestTrigger.isConnected) { setBuffering(playRequestTrigger); return; }
        if (!audio.paused && playButton.length) setBuffering(playButton[0]);
    });

    audio.addEventListener('stalled', function () {
        if (playRequestTrigger && playRequestTrigger.isConnected) { setBuffering(playRequestTrigger); return; }
        if (!audio.paused && playButton.length) setBuffering(playButton[0]);
    });

    // Seek — mouse
    if (playerTrack.length) {
        var dragging = false;

        function seek(clientX) {
            if (isNaN(audio.duration)) return;
            var rect = playerTrack[0].getBoundingClientRect();
            var ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
            audio.currentTime = ratio * audio.duration;
            playerProgress.css('width', (ratio * 100) + '%');
        }

        playerTrack.on('mousedown', function (e) { dragging = true; seek(e.clientX); });
        jQuery(document).on('mousemove', function (e) { if (dragging) seek(e.clientX); });
        jQuery(document).on('mouseup', function () { dragging = false; });

        // Seek — touch
        var startX = 0, startY = 0, locked = false;

        playerTrack[0].addEventListener('touchstart', function (e) {
            dragging = true; locked = false;
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });

        document.addEventListener('touchmove', function (e) {
            if (!dragging) return;
            var dx = Math.abs(e.touches[0].clientX - startX);
            var dy = Math.abs(e.touches[0].clientY - startY);
            if (!locked) {
                if (dx < 5 && dy < 5) return;
                if (dy > dx) { dragging = false; return; }
                locked = true;
            }
            e.preventDefault();
            seek(e.touches[0].clientX);
        }, { passive: false });

        document.addEventListener('touchend', function () {
            if (dragging && !locked) seek(startX);
            dragging = false; locked = false;
        });

        document.addEventListener('touchcancel', function () {
            dragging = false; locked = false;
        });
    }

    // Controls
    backwardButton.on('click', function () {
        audio.currentTime = Math.max(0, audio.currentTime - 10);
    });

    forwardButton.on('click', function () {
        audio.currentTime = audio.currentTime + 30;
    });

    speedButton.on('click', function () {
        playerSpeed = playerSpeed < 2 ? playerSpeed + 0.5 : 1;
        audio.playbackRate = playerSpeed;
        speedButton.text(playerSpeed + 'x');
    });
}
