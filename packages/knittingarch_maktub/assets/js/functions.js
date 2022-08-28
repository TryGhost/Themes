var disqus_shortname=theme_config.disqus_shortname;!function(){var e=document.createElement("script");e.async=!0,e.type="text/javascript",e.src="//"+disqus_shortname+".disqus.com/count.js",document.getElementsByTagName("BODY")[0].appendChild(e)}();

(function($){
	/* All Images Loaded */
	$(window).load(function(){

	});
	/* Dom Loaded */
	$(document).ready(function($){

        AOS.init({
            offset: 220,
            duration: 700,
            disable: window.innerWidth < 1024,
            easing: 'ease',
            once: true
        });

        if( $(".first-letter").length > 0 ){
            $(".first-letter").each(function(){
                var title = $(this).data('title');
                $(this).html( title.substring(0, 1) ).addClass('loaded');
            })
        }

        $(".epcl-switch button").on('click', function(){
            var current = $(this).data('price');
            $(".epcl-switch, .epcl-plans").attr( 'data-active-price', current );
        });

        // $('.epcl-dropcap').each(function(){
        //     var src = $(this).find('.fullimage').data('src');
        //     if( src != undefined ){
        //         $(this).append('<span class="fullimage cover fakelayout lazy" data-src="'+src+'"></span>')
        //     }
        // });
        
		$(".lazy, img[data-src], iframe[data-src]").Lazy({
            defaultImage: "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==",
            placeholder: "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==",
            threshold: 0,
            enableThrottle: true,
            throttle: 50,
			afterLoad: function(element){
				element.addClass('loaded');
                element.parents('.epcl-loader').addClass('loaded');
			}
        });

        if( theme_config.masonry == 'on' ){
            $('div.articles.grid-posts').masonry({
                // options
                itemSelector: 'article',
                // columnWidth: 200
            });
        }     
        
        if( theme_config.sticky_sidebar == 'on' ){
            $('#sidebar').theiaStickySidebar({
                additionalMarginTop: 30,
                additionalMarginBottom: 30
            });
        } 

        // Account page
                          
        if( $(".plan-price").length > 0 ){
            $(".plan-price").each(function(){
                var planAmount = $(this).data('value') / 100;
                $(this).html(planAmount);
            })
        }

        // Single Post copy button
        
        $(".permalink .copy").on('click', function(){
            $("#copy-link").select();
            document.execCommand('copy');
        });
        
        /* Gallery Ghost v2.1 */

        var images = document.querySelectorAll('.kg-gallery-image img');
        images.forEach(function (image) {
            var container = image.closest('.kg-gallery-image');
            var width = image.attributes.width.value;
            var height = image.attributes.height.value;
            var ratio = width / height;
            container.style.flex = ratio + ' 1 0%';
        })

        $('.kg-gallery-card').each(function(){
			$(this).find('img').wrap(function() {
				return '<a href="'+$(this).attr('src')+'" class="hover-effect" rel="gallery"></a>';
			});
			$(this).magnificPopup({
				type: 'image',
				gallery:{
					enabled: true,
					arrowMarkup: '<i class="mfp-arrow mfp-arrow-%dir% fa fa-chevron-%dir%"></i>'
				},
				delegate: 'a',
				mainClass: 'my-mfp-zoom-in',
				removalDelay: 300,
				closeMarkup: '<span title="%title%" class="mfp-close">&times;</span>',
			});
		});

		/* Global */

		// Open mobile menu        

        $('#header div.menu-mobile').on('click', function(){
			$('body').toggleClass('menu-open');
        });
        $('.menu-overlay').on('click', function(){
			$('body').removeClass('menu-open');
        });

        var form_lang = $('#form-lang');
        var searchinGhost = new SearchinGhost({
            key: search_engine_key,
            url: site_url,
            inputId: ['s'],
            version: '',
            limit: 6,
            outputChildsType: '',
            searchOn: 'submit',
            cacheMaxAge: 3600, // 1 hour cache
            template: function(post) {
                var o = `<article class="item">`
                if (post.feature_image) o += `<a href="${post.url}" class="search-image"><img src="${post.feature_image}" class="fulwidth"></a>`   
                o += `<h4 class="title usmall underline-effect"><a href="${post.url}">${post.title}</a></h4>`
                o += `<div class="bottom">`
                if (post.tags.length > 0) {
                    o += `<footer>
                            <time>${post.published_at}</time>
                            <div class="tags"><a href="${post.tags[0].url}" class="ctag-${post.tags[0].slug}">${post.tags[0].name}</a></div>
                        </footer>`
                } else {
                    o += `<footer>
                            <time>${post.published_at}</time>
                        </footer>`
                }
                o += `</div></article>`
                return o;
            },
            emptyTemplate: function(){
                return '<h3 class="title small textcenter no-results">'+form_lang.data('no-results')+'</h3>';
            },
            customProcessing: function(post) {
                if (post.tags) post.string_tags = post.tags.map(o => o.name).join(' ').toLowerCase();
                if (post.feature_image) post.feature_image = post.feature_image.replace('/images/', '/images/size/w600/'); // reduce image size to w600
                return post;
            }
        });

		$('#back-to-top').click(function(event) {
			event.preventDefault();
			$('html, body').animate({scrollTop: 0}, 500);
			return false;
		});

		$('.tooltip').tooltipster({ theme: 'tooltipster-small', contentAsHTML: true, animation: 'grow' });


		/* Global Lightbox */

		$('.lightbox').magnificPopup({
			mainClass: 'my-mfp-zoom-in',
			removalDelay: 300,
			closeMarkup: '<i title="%title%" class="mfp-close fa fa-times"></i>',
			fixedContentPos: true
        });

        $('.main-nav .lightbox, .epcl-search-button').magnificPopup({
			mainClass: 'my-mfp-zoom-in',
			removalDelay: 300,
			closeMarkup: '<button title="%title%" class="mfp-close">&times;</button>',
            fixedContentPos: true,
            closeBtnInside: false,
            callbacks: {
                beforeOpen: function(item) {
                    setTimeout(function() { $('#search-lightbox form #s').focus() }, 500);
                },
            }
        });

        // Lazy Disqus
        if( $('#disqus_thread').length > 0 ){
            disqusLazy({    
                // threashold: win.innerHeight * .75,
                throttle: 350,
                shortname: theme_config.disqus_shortname,
            });
        }

	});

})(jQuery);

(function() {
    var supportsPassive = eventListenerOptionsSupported();  

    if (supportsPassive) {
      var addEvent = EventTarget.prototype.addEventListener;
      overwriteAddEvent(addEvent);
    }

    function overwriteAddEvent(superMethod) {
      var defaultOptions = {
        passive: true,
        capture: false
      };

      EventTarget.prototype.addEventListener = function(type, listener, options) {
        var usesListenerOptions = typeof options === 'object';
        var useCapture = usesListenerOptions ? options.capture : options;
        options = usesListenerOptions ? options : {};
        if( type == 'touchstart' || type == 'touchmove'){
            options.passive = options.passive !== undefined ? options.passive : defaultOptions.passive;
        }        
        options.capture = useCapture !== undefined ? useCapture : defaultOptions.capture;

        superMethod.call(this, type, listener, options);
      };
    }

    function eventListenerOptionsSupported() {
      var supported = false;
      try {
        var opts = Object.defineProperty({}, 'passive', {
          get: function() {
            supported = true;
          }
        });
        window.addEventListener("test", null, opts);
      } catch (e) {}

      return supported;
    }

  })();

