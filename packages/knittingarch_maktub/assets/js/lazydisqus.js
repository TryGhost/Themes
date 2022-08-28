(function (doc, win) {
    var script;
    var isLoaded;
    var shortname;
    var element;
    var eventCallback;
    var threashold = win.innerHeight * 0.75;
  
    if (element) {
      addEventListener("scroll", eventCallback);
      addEventListener("resize", eventCallback);
    }
  
    function throttle(fn, delay) {
      var lastCalled = 0;
      var timeout;
  
      return function () {
        var now = +new Date();
        var remaining = delay - (now - lastCalled);
        var args = arguments;
  
        clearTimeout(timeout);
  
        if (remaining > 0) {
          timeout = setTimeout(function () {
            lastCalled = now;
            fn.apply(null, args);
          }, remaining);
        } else {
          lastCalled = now;
          fn.apply(null, args);
        }
      };
    }
  
    function isPassedThreashold() {
      var top = element.getBoundingClientRect().top;
      return top - win.innerHeight <= threashold;
    }
  
    function lazyLoad() {
      if (!isLoaded && isPassedThreashold()) {
        removeEventListener("scroll", eventCallback);
        removeEventListener("resize", eventCallback);
  
        script = doc.createElement("script");
        script.async = true;
        script.src = "//" + shortname + ".disqus.com/embed.js";
        script.setAttribute("data-timestamp", +new Date());
  
        element.innerHTML = "Loading comments...";
  
        (doc.head || doc.body).appendChild(script);
  
        isLoaded = true;
      }
    }
  
    win.disqusLazy = function (opts) {
      opts = opts || {};
      shortname = opts.shortname;
      eventCallback = throttle(lazyLoad, opts.throttle || 100);
      element = opts.element || doc.getElementById("disqus_thread");
      threashold = opts.threashold || win.innerHeight * 0.75;
  
      if (element) {
        addEventListener("scroll", eventCallback);
        addEventListener("resize", eventCallback);
      }
    };
  })(document, window);