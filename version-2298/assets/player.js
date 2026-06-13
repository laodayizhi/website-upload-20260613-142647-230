(function () {
    var hlsPromise = null;

    function whenReady(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function getHls() {
        if (window.Hls) {
            return Promise.resolve(window.Hls);
        }
        if (!hlsPromise) {
            hlsPromise = import("./hls-vendor-dru42stk.js").then(function (module) {
                return module.H || module.default || null;
            }).catch(function () {
                return null;
            });
        }
        return hlsPromise;
    }

    function bindPlayer(shell) {
        var video = shell.querySelector("video[data-src]");
        var trigger = shell.querySelector("[data-play-trigger]");
        var source = video ? video.getAttribute("data-src") : "";
        var attached = false;
        var hlsInstance = null;

        if (!video || !source) {
            return;
        }

        function attach() {
            if (attached) {
                return Promise.resolve();
            }
            attached = true;
            return getHls().then(function (Hls) {
                if (Hls && Hls.isSupported()) {
                    hlsInstance = new Hls({
                        enableWorker: true,
                        lowLatencyMode: true,
                        backBufferLength: 90
                    });
                    hlsInstance.loadSource(source);
                    hlsInstance.attachMedia(video);
                    return;
                }
                video.src = source;
            });
        }

        function play() {
            shell.classList.add("is-loading");
            attach().then(function () {
                shell.classList.add("is-playing");
                shell.classList.remove("is-loading");
                var action = video.play();
                if (action && typeof action.catch === "function") {
                    action.catch(function () {
                        shell.classList.remove("is-playing");
                    });
                }
            });
        }

        if (trigger) {
            trigger.addEventListener("click", play);
        }

        video.addEventListener("click", function () {
            if (video.paused) {
                play();
            }
        });

        video.addEventListener("play", function () {
            shell.classList.add("is-playing");
        });

        video.addEventListener("ended", function () {
            shell.classList.remove("is-playing");
        });

        window.addEventListener("beforeunload", function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    }

    whenReady(function () {
        Array.prototype.slice.call(document.querySelectorAll("[data-player]")).forEach(bindPlayer);
    });
})();
