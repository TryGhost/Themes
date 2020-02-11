var body = $('body');

$(function () {
  'use strict';
  search();
  featured();
  gallery();
  table();
  notification();
  social();
  copyright();
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
  var searchField = $('.search-field');
  var searchButton = $('.search-button');
  var searchResult = $('.search-result');
  var posts = [];

  if (themeOptions.search_key == '') {
    return;
  }

  searchField.one('focus', function () {
    var base = window.location.protocol + "//" + window.location.host + "/" + window.location.pathname.split('/')[1];
    $.get(base + '/ghost/api/v3/content/posts/?key=' + themeOptions.search_key + '&limit=all&fields=title,url', function (data) {
      posts = data.posts
    });
  })

  searchField.on('keyup', function (e) {
    var output = '';

    if (e.target.value.length > 2) {
      var result = fuzzysort.go(e.target.value, posts, {key: 'title'});
      result.forEach(function (item) {
        output += '<div class="search-result-row">' +
          '<a class="search-result-row-link" href="' + item.obj.url + '">' + item.obj.title + '</a>' +
        '</div>';
      });
      searchResult.html(output);
    }

    if (e.target.value.length > 0) {
      searchButton.addClass('search-button-clear');
    } else {
      searchButton.removeClass('search-button-clear');
    }

    searchResult.html(output);
  });

  $('.search-form').on('submit', function (e) {
    e.preventDefault();
  });

  searchButton.on('click', function () {
    if ($(this).hasClass('search-button-clear')) {
      searchField.val('').focus().keyup();
    }
  });
}

function featured() {
  'use strict';
  $('.featured-posts').owlCarousel({
    dots: false,
    margin: 30,
    nav: true,
    navText: ['<i class="icon icon-chevron-left"></i>', '<i class="icon icon-chevron-right"></i>'],
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
}

function table() {
  'use strict';
  if (body.hasClass('post-template') || body.hasClass('page-template')) {
    var tables = $('.post-content').find('.table');
    tables.each(function (_, table) {
      var labels = []

      $(table).find('thead th').each(function (_, label) {
        labels.push($(label).text());
      });
      
      $(table).find('tr').each(function (_, row) {
        $(row).find('td').each(function (index, column) {
          $(column).attr('data-label', labels[index]);
        });
      });
    });
  }
}

function notification() {
  'use strict';
  $('.notification-close').on('click', function (e) {
    e.preventDefault();

    body.removeClass('notification-opened');
    var uri = window.location.toString();
    if (uri.indexOf('?') > 0) {
      var clean_uri = uri.substring(0, uri.indexOf('?'));
      window.history.replaceState({}, document.title, clean_uri);
    }

    if ($(this).closest('.subscribe-form').length) {
      $(this).closest('.subscribe-form').removeClass('success error');
    }
  });
}

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
			output += '<a class="footer-social-item" href="' + links[key] + '" target="_blank"><i class="icon icon-' + data[key]['icon'] + '"></i></a>';
		}
  }
  
  $('.footer-social').html(output);
}

function copyright() {
  'use strict';
  if (themeOptions.copyright != '') {
    $('.copyright').html(themeOptions.copyright);
  }
}

function mobileMenu() {
  'use strict';
  $('.burger').on('click', function() {
    $('body').toggleClass('menu-opened');
  });
}

function getParameterByName(name, url) {
  'use strict';
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
  var results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}