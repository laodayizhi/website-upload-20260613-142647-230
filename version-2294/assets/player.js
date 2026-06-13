(function () {
  function initMoviePlayer(streamUrl) {
    function bind() {
      var video = document.querySelector('[data-player-video]');
      var button = document.querySelector('[data-player-button]');
      var message = document.querySelector('[data-player-message]');
      var loaded = false;
      var hls = null;

      function showMessage(text) {
        if (!message) {
          return;
        }
        message.textContent = text;
        message.classList.add('is-visible');
      }

      function hideMessage() {
        if (message) {
          message.textContent = '';
          message.classList.remove('is-visible');
        }
      }

      function loadVideo() {
        if (!video || loaded) {
          return;
        }
        if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hls.loadSource(streamUrl);
          hls.attachMedia(video);
          hls.on(window.Hls.Events.ERROR, function (event, data) {
            if (data && data.fatal) {
              if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
                hls.startLoad();
              } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
                hls.recoverMediaError();
              } else {
                showMessage('播放暂时不可用，请稍后再试');
              }
            }
          });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = streamUrl;
        } else {
          showMessage('播放暂时不可用，请稍后再试');
        }
        loaded = true;
      }

      function play() {
        if (!video) {
          return;
        }
        hideMessage();
        loadVideo();
        if (button) {
          button.classList.add('is-hidden');
        }
        var promise = video.play();
        if (promise && typeof promise.catch === 'function') {
          promise.catch(function () {
            if (button) {
              button.classList.remove('is-hidden');
            }
          });
        }
      }

      if (!video || !button) {
        return;
      }

      button.addEventListener('click', play);
      video.addEventListener('click', function () {
        if (video.paused) {
          play();
        } else {
          video.pause();
        }
      });
      video.addEventListener('play', function () {
        button.classList.add('is-hidden');
      });
      video.addEventListener('pause', function () {
        if (!video.ended) {
          button.classList.remove('is-hidden');
        }
      });
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', bind);
    } else {
      bind();
    }
  }

  window.initMoviePlayer = initMoviePlayer;
})();
