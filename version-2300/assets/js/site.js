(function () {
    function each(selector, callback) {
        Array.prototype.forEach.call(document.querySelectorAll(selector), callback);
    }

    function normalize(value) {
        return String(value || "").toLowerCase().trim();
    }

    function setupMenu() {
        var button = document.querySelector(".nav-toggle");
        var nav = document.getElementById("mainNav");

        if (!button || !nav) {
            return;
        }

        button.addEventListener("click", function () {
            var opened = nav.classList.toggle("is-open");
            button.setAttribute("aria-expanded", opened ? "true" : "false");
        });
    }

    function setupHero() {
        var root = document.querySelector("[data-hero]");

        if (!root) {
            return;
        }

        var slides = Array.prototype.slice.call(root.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(root.querySelectorAll("[data-hero-dot]"));
        var prev = root.querySelector("[data-hero-prev]");
        var next = root.querySelector("[data-hero-next]");
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

        function start() {
            stop();
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

        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener("click", function () {
                show(dotIndex);
                start();
            });
        });

        if (prev) {
            prev.addEventListener("click", function () {
                show(current - 1);
                start();
            });
        }

        if (next) {
            next.addEventListener("click", function () {
                show(current + 1);
                start();
            });
        }

        root.addEventListener("mouseenter", stop);
        root.addEventListener("mouseleave", start);
        show(0);
        start();
    }

    function setupFiltering() {
        each(".filter-input", function (input) {
            var list = document.querySelector("[data-filter-list]");

            if (!list) {
                return;
            }

            var cards = Array.prototype.slice.call(list.querySelectorAll(".movie-card"));

            function apply(value) {
                var keyword = normalize(value);

                cards.forEach(function (card) {
                    var haystack = normalize([
                        card.getAttribute("data-title"),
                        card.getAttribute("data-region"),
                        card.getAttribute("data-year"),
                        card.getAttribute("data-genre"),
                        card.getAttribute("data-tags")
                    ].join(" "));
                    card.classList.toggle("is-hidden", keyword && haystack.indexOf(keyword) === -1);
                });
            }

            input.addEventListener("input", function () {
                apply(input.value);
            });

            var params = new URLSearchParams(window.location.search);
            var q = params.get("q");

            if (q && input.classList.contains("search-query-input")) {
                input.value = q;
                apply(q);
            }
        });
    }

    function setupImageHandling() {
        document.addEventListener("error", function (event) {
            var target = event.target;

            if (target && target.tagName === "IMG") {
                target.classList.add("image-muted");
            }
        }, true);
    }

    document.addEventListener("DOMContentLoaded", function () {
        setupMenu();
        setupHero();
        setupFiltering();
        setupImageHandling();
    });
})();
