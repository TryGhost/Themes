function initParallax() {
    jarallax(document.querySelectorAll('.has-parallax-feed .gh-card'), {
        speed: 0.8,
    });
}

function pagination(isInfinite = true, done) {
    let loading = false;
    const feedElement = document.querySelector('.gh-feed');
    const target = feedElement.nextElementSibling || feedElement.parentElement.nextElementSibling;

    const loadNextPage = async function () {
        const nextElement = document.querySelector('link[rel=next]');

        if (!nextElement) {
            return;
        }

        try {
            const res = await fetch(nextElement.href);
            const html = await res.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            const posts = doc.querySelectorAll('.gh-feed > *');

            posts.forEach(function (post) {
                feedElement.appendChild(document.importNode(post, true));
            });

            if (done) {
                done();
            }

            const resNextElement = doc.querySelector('link[rel=next]');
            if (resNextElement && resNextElement.href) {
                nextElement.href = resNextElement.href;
            } else {
                nextElement.remove();
            }
        } catch (e) {
            nextElement.remove();
            throw e;
        }
    };

    const callback = async function (entries) {
        if (loading) {
            return;
        }

        loading = true;

        if (entries[0].isIntersecting) {
            // keep loading next page until target is out of the viewport or we've loaded the last page
            while (target.getBoundingClientRect().top <= window.innerHeight && document.querySelector('link[rel=next]')) {
                await loadNextPage();
            }
        }

        loading = false;

        if (!document.querySelector('link[rel=next]')) {
            observer.disconnect();
        }
    };

    const observer = new IntersectionObserver(callback);
    observer.observe(target);
}

(function () {
    initParallax();
})();

(function () {
    const toggle = document.querySelector('[data-toggle-comments]');
    if (!toggle) return;

    toggle.addEventListener('click', function () {
        document.body.classList.toggle('comments-opened');
    });
})();

(function () {
    const element = document.querySelector('.gh-article-excerpt');
    if (!element) return;

    let text = element.textContent;
    const emojiRE = /\p{EPres}|\p{ExtPict}/gu;

    const emojis = text.match(emojiRE);
    if (!emojis) return;

    emojis.forEach(function (emoji) {
        text = text.replace(emoji, `<span class="emoji">${emoji}</span>`);
    });

    element.innerHTML = text;
})();

(function () {
    pagination(true, initParallax);
})();
