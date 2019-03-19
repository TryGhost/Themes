var html = $('html');

$(function () {
  carousel();
  loadMore();
  gallery();
  comment();
  author();
  offCanvas();
  copyright();
  social();
});

function carousel() {
  var carousel = $('.carousel');
  var postImage = carousel.find('.tag-image');
  var imageHeight, nav;

  function moveNav() {
    imageHeight = postImage.height();
    if (!nav) {
      nav = carousel.find('.owl-prev, .owl-next');
    }
    nav.css({
      top: (imageHeight / 2) + 'px',
      opacity: 1,
    });
  }

  carousel.owlCarousel({
    dots: false,
    margin: 40,
    nav: true,
    navText: ['', ''],
    onInitialized: function () {
      moveNav();
    },
    onResized: function () {
      moveNav();
    },
    responsive: {
      0: {
        items: 1,
      },
      768: {
        items: 2,
        margin: 20,
      },
      992: {
        items: 2,
        margin: 40,
      },
      1200: {
        items: 3,
      },
      1920: {
        items: 4,
      },
      2560: {
        items: 5,
      },
    },
  });
}

function loadMore() {
  var wrapper = $('.post-feed');
  var button = $('.pagination');
  var content, link, page;

  button.on('click', function() {
    $.get($(this).attr('data-url'), function(data) {
      content = $(data).find('.post-feed > *');
      link = $(data).find('.pagination').attr('data-url');
      page = $(data).find('.page-number').text();

      wrapper.append(content);

      button.attr('data-url', link);
      button.find('.page-number').text(page);

      if (link) {
        button.attr('data-url', link);
      } else {
        button.remove();
      }
    });
  });
}

function gallery() {
  var images = document.querySelectorAll('.kg-gallery-image img');
  images.forEach(function (image) {
    var container = image.closest('.kg-gallery-image');
    var width = image.attributes.width.value;
    var height = image.attributes.height.value;
    var ratio = width / height;
    container.style.flex = ratio + ' 1 0%';
  });
}

function comment() {
  if (themeOptions.disqus_shortname == '') {
    $('.comment-container').remove();
  }
}

function author() {
  $('.author-name').on('click', function () {
    $(this).next('.author-social').toggleClass('enabled');
  });
}

function offCanvas() {
  var burger = jQuery('.burger');
  var canvasClose = jQuery('.canvas-close');

  jQuery('.nav-list').slicknav({
    label: '',
    prependTo: '.mobile-menu',
  });

  burger.on('click', function() {
    html.toggleClass('canvas-opened');
    html.addClass('canvas-visible');
    dimmer('open', 'medium');
  });

  canvasClose.on('click', function() {
    if (html.hasClass('canvas-opened')) {
      html.removeClass('canvas-opened');
      dimmer('close', 'medium');
    }
  });

  jQuery('.dimmer').on('click', function() {
    if (html.hasClass('canvas-opened')) {
      html.removeClass('canvas-opened');
      dimmer('close', 'medium');
    }
  });

  jQuery(document).keyup(function(e) {
    if (e.keyCode == 27 && html.hasClass('canvas-opened')) {
      html.removeClass('canvas-opened');
      dimmer('close', 'medium');
    }
  });
}

function copyright() {
  if (themeOptions.copyright != '') {
    $('.copyright').html(themeOptions.copyright);
  }
}

function social() {
  var data = {
    facebook: {name: 'Facebook', icon: 'facebook'},
    twitter: {name: 'Twitter', icon: 'twitter'},
    instagram: {name: 'Instagram', icon: 'instagram'},
    dribbble: {name: 'Dribbble', icon: 'dribbble'},
    behance: {name: 'Behance', icon: 'behance'},
    github: {name: 'GitHub', icon: 'github-circle'},
    linkedin: {name: 'LinkedIn', icon: 'linkedin'},
    vk: {name: 'VK', icon: 'vk'},
    rss: {name: 'RSS', icon: 'rss'},
  };
  var links = themeOptions.social_links;
  var output = '';

  for (var key in links) {
		if (links[key] != '') {
			output += '<a class="footer-social-item" href="' + links[key] + '" target="_blank"><i class="icon icon-' + data[key]['icon'] + '"></i></a>';
		}
  }
  
  $('.footer-social').html(output);
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