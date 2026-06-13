(function () {
    var body = document.body;
    var menuToggle = document.querySelector('[data-menu-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (menuToggle && mobileNav) {
        menuToggle.addEventListener('click', function () {
            mobileNav.classList.toggle('is-open');
            body.classList.toggle('menu-open', mobileNav.classList.contains('is-open'));
        });
    }

    var backTop = document.querySelector('[data-back-top]');
    if (backTop) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 420) {
                backTop.classList.add('is-visible');
            } else {
                backTop.classList.remove('is-visible');
            }
        }, { passive: true });
        backTop.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    var hero = document.querySelector('[data-hero]');
    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var activeIndex = 0;
        var timer = null;

        var showSlide = function (index) {
            activeIndex = (index + slides.length) % slides.length;
            slides.forEach(function (slide, current) {
                slide.classList.toggle('is-active', current === activeIndex);
            });
            dots.forEach(function (dot, current) {
                dot.classList.toggle('is-active', current === activeIndex);
            });
        };

        var startHero = function () {
            if (timer) {
                window.clearInterval(timer);
            }
            timer = window.setInterval(function () {
                showSlide(activeIndex + 1);
            }, 5200);
        };

        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                showSlide(index);
                startHero();
            });
        });

        if (slides.length > 1) {
            startHero();
        }
    }

    var filterForms = document.querySelectorAll('[data-filter-form]');
    filterForms.forEach(function (form) {
        var container = form.parentElement;
        var list = container ? container.querySelector('[data-filter-list]') : document.querySelector('[data-filter-list]');
        var input = form.querySelector('[data-filter-input]');
        var reset = form.querySelector('[data-filter-reset]');

        var applyFilter = function () {
            if (!list || !input) {
                return;
            }
            var keyword = input.value.trim().toLowerCase();
            var items = list.querySelectorAll('.movie-card, .media-row');
            items.forEach(function (item) {
                var text = item.textContent.toLowerCase() + ' ' + Array.prototype.map.call(item.attributes, function (attr) {
                    return attr.value.toLowerCase();
                }).join(' ');
                item.classList.toggle('is-hidden', keyword && text.indexOf(keyword) === -1);
            });
        };

        form.addEventListener('submit', function (event) {
            event.preventDefault();
            applyFilter();
        });

        if (input) {
            input.addEventListener('input', applyFilter);
        }

        if (reset) {
            reset.addEventListener('click', function () {
                if (input) {
                    input.value = '';
                }
                applyFilter();
            });
        }
    });

    var playerWrap = document.querySelector('[data-player]');
    if (playerWrap) {
        var video = playerWrap.querySelector('video');
        var button = playerWrap.querySelector('[data-play-button]');
        var hlsInstance = null;
        var attached = false;

        var attachStream = function () {
            if (!video || attached) {
                return;
            }
            var stream = video.getAttribute('data-stream');
            if (!stream) {
                return;
            }
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = stream;
                attached = true;
                return;
            }
            if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({ enableWorker: true, lowLatencyMode: true });
                hlsInstance.loadSource(stream);
                hlsInstance.attachMedia(video);
                attached = true;
            } else {
                video.src = stream;
                attached = true;
            }
        };

        var startPlayback = function () {
            attachStream();
            if (button) {
                button.classList.add('is-hidden');
            }
            var promise = video.play();
            if (promise && typeof promise.catch === 'function') {
                promise.catch(function () {});
            }
        };

        if (button) {
            button.addEventListener('click', startPlayback);
        }
        if (video) {
            video.addEventListener('click', function () {
                if (video.paused) {
                    startPlayback();
                }
            });
            video.addEventListener('play', function () {
                if (button) {
                    button.classList.add('is-hidden');
                }
            });
        }
        window.addEventListener('pagehide', function () {
            if (hlsInstance) {
                hlsInstance.destroy();
                hlsInstance = null;
            }
        });
    }
})();
