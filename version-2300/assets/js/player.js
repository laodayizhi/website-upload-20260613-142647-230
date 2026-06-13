(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function attachStream(video, stream) {
        if (!stream) {
            return false;
        }

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = stream;
            return true;
        }

        if (window.Hls && window.Hls.isSupported()) {
            if (video.hlsController) {
                video.hlsController.destroy();
            }

            var controller = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true,
                backBufferLength: 90
            });

            controller.loadSource(stream);
            controller.attachMedia(video);
            video.hlsController = controller;
            return true;
        }

        video.src = stream;
        return true;
    }

    function startPlayer(card) {
        var video = card.querySelector("video");
        var stream = card.getAttribute("data-stream");

        if (!video || !stream) {
            return;
        }

        if (!video.getAttribute("src") && !video.hlsController) {
            attachStream(video, stream);
        }

        card.classList.add("is-playing");
        var playTask = video.play();

        if (playTask && typeof playTask.catch === "function") {
            playTask.catch(function () {
                card.classList.remove("is-playing");
            });
        }
    }

    ready(function () {
        Array.prototype.forEach.call(document.querySelectorAll("[data-player]"), function (card) {
            var button = card.querySelector("[data-play-button]");
            var video = card.querySelector("video");

            if (button) {
                button.addEventListener("click", function () {
                    startPlayer(card);
                });
            }

            if (video) {
                video.addEventListener("play", function () {
                    card.classList.add("is-playing");
                });

                video.addEventListener("pause", function () {
                    if (video.currentTime === 0 || video.ended) {
                        card.classList.remove("is-playing");
                    }
                });
            }
        });
    });
})();
