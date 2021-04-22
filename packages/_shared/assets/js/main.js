(function () {
    document.querySelector('.gh-burger').addEventListener('click', function () {
        if (!document.body.classList.contains('gh-head-opened')) {
            document.body.classList.add('gh-head-opened');
        } else {
            document.body.classList.remove('gh-head-opened');
        }
    });
})();
