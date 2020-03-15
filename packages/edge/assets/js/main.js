$(function () {
  'use strict';
  gallery();
  social();
  copyright();
  mobileMenu();
  feed();
  lightbox();
});

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

  pswp('.kg-gallery-container', '.kg-gallery-image', '.kg-gallery-image', true);
}

function social() {
  'use strict';
  var data = {
    facebook: {name: 'Facebook', icon: 'facebook', text: 'FB'},
    twitter: {name: 'Twitter', icon: 'twitter', text: 'TW'},
    instagram: {name: 'Instagram', icon: 'instagram', text: 'IG'},
    dribbble: {name: 'Dribbble', icon: 'dribbble', text: 'DR'},
    behance: {name: 'Behance', icon: 'behance', text: 'BE'},
    github: {name: 'GitHub', icon: 'github-circle', text: 'GH'},
    linkedin: {name: 'LinkedIn', icon: 'linkedin', text: 'LI'},
    vk: {name: 'VK', icon: 'vk', text: 'VK'},
  };
  var links = themeOptions.social_links;
  var output = '';

  for (var key in links) {
		if (links[key] != '') {
			output += '<a class="social-item social-item-' + data[key]['name'].toLowerCase() + '" href="' + links[key] + '" title="' + data[key]['name'] + '" target="_blank">' + data[key]['text'] + '</a>';
		}
  }
  
  $('.social').html(output);
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

function feed() {
  'use strict';
  var grid = $('.post-feed').masonry({
    columnWidth: '.grid-sizer',
    itemSelector: 'none',
    hiddenStyle: {transform: 'translateY(50px)', opacity: 0},
    visibleStyle: {transform: 'translateY(0)', opacity: 1},
  });
  var msnry = grid.data('masonry');

  grid.imagesLoaded(function () {
    grid.addClass('initialized');
    grid.masonry('option', {itemSelector: '.grid-item'});
    var items = grid.find('.grid-item');
    grid.masonry('appended', items);
  });

  if ($('.pagination .older-posts').length) {
    grid.infiniteScroll({
      append: '.grid-item',
      history: false,
      outlayer: msnry,
      path: '.pagination .older-posts',
      prefill: true,
      status: '.infinite-scroll-status',
    });
  }
}

function lightbox() {
  pswp('.post-feed', '.grid-item:not(.grid-sizer)', '.post-lightbox', false);
}

function pswp(container, element, trigger, gallery) {
  var parseThumbnailElements = function (el) {
    var items = [],
      gridEl,
      linkEl,
      item;

    $(el).find(element).each(function (i, v) {
      gridEl = $(v);
      linkEl = gridEl.find(trigger);

      item = {
        src: gallery ? gridEl.find('img').attr('src') : linkEl.attr('href'),
        w: 0,
        h: 0,
      };

      if (gridEl.find('.post-caption').length) {
        item.title = gridEl.find('.post-caption').html();
      }

      items.push(item);
    });

    return items;
  };

  var openPhotoSwipe = function(index, galleryElement) {
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

    gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
    gallery.listen('gettingData', function (index, item) {
      if (item.w < 1 || item.h < 1) { // unknown size
        var img = new Image(); 
        img.onload = function() { // will get size after load
          item.w = this.width; // set image width
          item.h = this.height; // set image height
          gallery.updateSize(true); // reinit Items
        }
        img.src = item.src; // let's download image
      }
    });
    gallery.init();
  };

  var onThumbnailsClick = function(e) {
    e.preventDefault();

    var index = $(element).index($(e.target).closest(element))
    var clickedGallery = $(e.target).closest(container);

    openPhotoSwipe(index, clickedGallery[0]);

    return false;
  };

  $(container).on('click', trigger, function (e) {
    onThumbnailsClick(e);
  });
}