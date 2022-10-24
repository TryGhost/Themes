function dropdown() {
    const mediaQuery = window.matchMedia('(max-width: 991px)');

    const menu = document.querySelector('.gh-head-menu');
    const nav = menu.querySelector('.nav');
    if (!nav) return;

    const navHTML = nav.innerHTML;

    const makeDropdown = function () {
        if (mediaQuery.matches) return;
        const submenuItems = [];

        while ((nav.offsetWidth + 64) > menu.offsetWidth) {
            submenuItems.unshift(nav.lastElementChild);
            nav.lastElementChild.remove();
        }

        if (!submenuItems.length) return;

        const toggle = document.createElement('button');
        toggle.setAttribute('class', 'nav-more-toggle gh-icon-btn');
        toggle.setAttribute('aria-label', 'More');
        toggle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M21.333 16c0-1.473 1.194-2.667 2.667-2.667v0c1.473 0 2.667 1.194 2.667 2.667v0c0 1.473-1.194 2.667-2.667 2.667v0c-1.473 0-2.667-1.194-2.667-2.667v0zM13.333 16c0-1.473 1.194-2.667 2.667-2.667v0c1.473 0 2.667 1.194 2.667 2.667v0c0 1.473-1.194 2.667-2.667 2.667v0c-1.473 0-2.667-1.194-2.667-2.667v0zM5.333 16c0-1.473 1.194-2.667 2.667-2.667v0c1.473 0 2.667 1.194 2.667 2.667v0c0 1.473-1.194 2.667-2.667 2.667v0c-1.473 0-2.667-1.194-2.667-2.667v0z"></path></svg>';

        const wrapper = document.createElement('div');
        wrapper.setAttribute('class', 'gh-dropdown');

        submenuItems.forEach(function (child) {
            wrapper.appendChild(child);
        });

        toggle.appendChild(wrapper);
        nav.appendChild(toggle);

        toggle.addEventListener('click', function () {
            if (window.getComputedStyle(wrapper).display == 'none') {
                wrapper.style.display = 'block';
                wrapper.classList.add('animate__animated', 'animate__bounceIn');
            } else {
                wrapper.classList.add('animate__animated', 'animate__zoomOut');
            }
        });

        wrapper.addEventListener('animationend', function (e) {
            wrapper.classList.remove('animate__animated', 'animate__bounceIn', 'animate__zoomOut');
            if (e.animationName == 'zoomOut') {
                wrapper.style.display = 'none';
            }
        });
    }

    makeDropdown();

    window.addEventListener('resize', function () {
        setTimeout(() => {
            nav.innerHTML = navHTML;
            makeDropdown();
        }, 1);
    });
}
