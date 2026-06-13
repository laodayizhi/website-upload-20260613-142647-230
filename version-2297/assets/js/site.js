(function () {
    function ready(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }

    ready(function () {
        var toggle = document.querySelector('[data-menu-toggle]');
        var nav = document.querySelector('[data-site-nav]');
        if (toggle && nav) {
            toggle.addEventListener('click', function () {
                nav.classList.toggle('is-open');
            });
        }

        var hero = document.querySelector('[data-hero]');
        if (hero) {
            var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
            var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
            var current = 0;
            var timer = null;

            function show(index) {
                current = (index + slides.length) % slides.length;
                slides.forEach(function (slide, slideIndex) {
                    slide.classList.toggle('active', slideIndex === current);
                });
                dots.forEach(function (dot, dotIndex) {
                    dot.classList.toggle('active', dotIndex === current);
                });
            }

            function start() {
                if (timer || slides.length < 2) {
                    return;
                }
                timer = window.setInterval(function () {
                    show(current + 1);
                }, 5200);
            }

            function stop() {
                if (timer) {
                    window.clearInterval(timer);
                    timer = null;
                }
            }

            dots.forEach(function (dot) {
                dot.addEventListener('click', function () {
                    var index = Number(dot.getAttribute('data-hero-dot')) || 0;
                    show(index);
                    stop();
                    start();
                });
            });

            hero.addEventListener('mouseenter', stop);
            hero.addEventListener('mouseleave', start);
            show(0);
            start();
        }

        var forms = Array.prototype.slice.call(document.querySelectorAll('[data-filter-form]'));
        forms.forEach(function (form) {
            var section = form.closest('section') || document;
            var cards = Array.prototype.slice.call(section.querySelectorAll('.movie-card'));
            var countNode = section.querySelector('[data-result-count]');

            function update() {
                var data = new FormData(form);
                var keyword = String(data.get('keyword') || '').trim().toLowerCase();
                var year = String(data.get('year') || '').trim();
                var type = String(data.get('type') || '').trim();
                var visible = 0;

                cards.forEach(function (card) {
                    var haystack = [
                        card.getAttribute('data-title') || '',
                        card.getAttribute('data-year') || '',
                        card.getAttribute('data-region') || '',
                        card.getAttribute('data-type') || '',
                        card.getAttribute('data-tags') || ''
                    ].join(' ').toLowerCase();
                    var cardYear = card.getAttribute('data-year') || '';
                    var cardType = card.getAttribute('data-type') || '';
                    var ok = true;

                    if (keyword && haystack.indexOf(keyword) === -1) {
                        ok = false;
                    }
                    if (year && cardYear.indexOf(year) === -1) {
                        ok = false;
                    }
                    if (type && cardType.indexOf(type) === -1) {
                        ok = false;
                    }

                    card.hidden = !ok;
                    if (ok) {
                        visible += 1;
                    }
                });

                if (countNode) {
                    countNode.textContent = '共 ' + visible + ' 部影片';
                }
            }

            form.addEventListener('submit', function (event) {
                event.preventDefault();
                update();
            });

            form.addEventListener('input', update);
            form.addEventListener('reset', function () {
                window.setTimeout(update, 0);
            });
        });
    });
}());
