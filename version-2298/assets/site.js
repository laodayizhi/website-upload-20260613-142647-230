(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function bindMenu() {
        var button = document.querySelector("[data-menu-button]");
        var nav = document.querySelector("[data-site-nav]");
        if (!button || !nav) {
            return;
        }
        button.addEventListener("click", function () {
            nav.classList.toggle("is-open");
        });
    }

    function bindHero() {
        var hero = document.querySelector("[data-hero]");
        if (!hero) {
            return;
        }
        var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        var prev = hero.querySelector("[data-hero-prev]");
        var next = hero.querySelector("[data-hero-next]");
        var current = 0;
        var timer = null;

        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === current);
            });
        }

        function move(step) {
            show(current + step);
        }

        function restart() {
            if (timer) {
                window.clearInterval(timer);
            }
            timer = window.setInterval(function () {
                move(1);
            }, 6000);
        }

        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                show(Number(dot.getAttribute("data-hero-dot")) || 0);
                restart();
            });
        });

        if (prev) {
            prev.addEventListener("click", function () {
                move(-1);
                restart();
            });
        }

        if (next) {
            next.addEventListener("click", function () {
                move(1);
                restart();
            });
        }

        show(0);
        restart();
    }

    function normalize(value) {
        return String(value || "").toLowerCase().trim();
    }

    function bindFilters() {
        var scopes = Array.prototype.slice.call(document.querySelectorAll("[data-filter-scope]"));
        scopes.forEach(function (scope) {
            var textInput = scope.querySelector("[data-search-input]");
            var categorySelect = scope.querySelector("[data-filter-category]");
            var genreSelect = scope.querySelector("[data-filter-genre]");
            var yearInput = scope.querySelector("[data-filter-year]");
            var counter = scope.querySelector("[data-result-count]");
            var cards = Array.prototype.slice.call(scope.querySelectorAll("[data-card]"));

            if (textInput) {
                var params = new URLSearchParams(window.location.search);
                var query = params.get("q");
                if (query) {
                    textInput.value = query;
                }
            }

            function run() {
                var text = normalize(textInput && textInput.value);
                var category = normalize(categorySelect && categorySelect.value);
                var genre = normalize(genreSelect && genreSelect.value);
                var year = normalize(yearInput && yearInput.value);
                var visible = 0;

                cards.forEach(function (card) {
                    var haystack = normalize([
                        card.getAttribute("data-title"),
                        card.getAttribute("data-region"),
                        card.getAttribute("data-category"),
                        card.getAttribute("data-genre"),
                        card.getAttribute("data-tags"),
                        card.getAttribute("data-year")
                    ].join(" "));
                    var ok = true;
                    if (text && haystack.indexOf(text) === -1) {
                        ok = false;
                    }
                    if (category && normalize(card.getAttribute("data-category")) !== category) {
                        ok = false;
                    }
                    if (genre && normalize(card.getAttribute("data-genre")).indexOf(genre) === -1) {
                        ok = false;
                    }
                    if (year && normalize(card.getAttribute("data-year")).indexOf(year) === -1) {
                        ok = false;
                    }
                    card.classList.toggle("is-hidden", !ok);
                    if (ok) {
                        visible += 1;
                    }
                });

                if (counter) {
                    counter.textContent = String(visible);
                }
            }

            [textInput, categorySelect, genreSelect, yearInput].forEach(function (control) {
                if (control) {
                    control.addEventListener("input", run);
                    control.addEventListener("change", run);
                }
            });

            run();
        });
    }

    function bindPlayerLinks() {
        Array.prototype.slice.call(document.querySelectorAll("[data-scroll-player]")).forEach(function (link) {
            link.addEventListener("click", function (event) {
                event.preventDefault();
                var target = document.querySelector("[data-player]");
                if (target) {
                    target.scrollIntoView({ behavior: "smooth", block: "center" });
                }
            });
        });
    }

    ready(function () {
        bindMenu();
        bindHero();
        bindFilters();
        bindPlayerLinks();
    });
})();
