var body = $('body');

$(function () {
  'use strict';
  social();
  author();
  stickySidebar();
  pagination();
  offCanvas();
});

function social() {
  'use strict';
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
			output += '<a class="social-item" href="' + links[key] + '" target="_blank"><i class="icon icon-' + data[key]['icon'] + '"></i></a>';
		}
  }
  
  $('.social').html(output);
}

function author() {
  'use strict';
  $('.author-name').on('click', function () {
    $(this).next('.author-social').toggleClass('enabled');
  });
}

function stickySidebar() {
  'use strict';
  var marginTop = 30;

  jQuery('.sidebar-column, .related-column').theiaStickySidebar({
    additionalMarginTop: marginTop,
    additionalMarginBottom: 30,
  });
}

function pagination() {
  'use strict';
  var wrapper = $('.post-feed .row');

  if (body.hasClass('paged-next')) {
    wrapper.infiniteScroll({
      append: '.post-column',
      button: '.infinite-scroll-button',
      debug: false,
      hideNav: '.pagination',
      history: false,
      path: '.pagination .older-posts',
      scrollThreshold: false,
      status: '.infinite-scroll-status',
    });
  }
}

function offCanvas() {
  'use strict';
  $('.burger').on('click', function () {
    body.toggleClass('canvas-opened');
  });
}