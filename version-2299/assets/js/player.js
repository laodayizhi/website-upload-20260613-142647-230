(function () {
  function createMessage(wrapper, text) {
    var current = wrapper.querySelector('.player-message');

    if (!current) {
      current = document.createElement('div');
      current.className = 'player-message';
      wrapper.appendChild(current);
    }

    current.textContent = text;
  }

  function hideLayer(layer) {
    if (layer) {
      layer.classList.add('is-hidden');
    }
  }

  function playVideo(video) {
    var result = video.play();

    if (result && typeof result.catch === 'function') {
      result.catch(function () {});
    }
  }

  function prepare(wrapper) {
    var video = wrapper.querySelector('video');
    var layer = wrapper.querySelector('.play-layer');
    var stream = wrapper.getAttribute('data-stream');

    if (!video || !stream) {
      createMessage(wrapper, '播放暂时不可用，请稍后再试');
      return;
    }

    if (wrapper.dataset.ready === '1') {
      hideLayer(layer);
      playVideo(video);
      return;
    }

    wrapper.dataset.ready = '1';
    hideLayer(layer);

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = stream;
      video.addEventListener('loadedmetadata', function () {
        playVideo(video);
      }, { once: true });
      video.load();
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 60
      });

      hls.loadSource(stream);
      hls.attachMedia(video);
      hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
        playVideo(video);
      });
      hls.on(window.Hls.Events.ERROR, function (eventName, data) {
        if (!data || !data.fatal) {
          return;
        }

        if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
          hls.startLoad();
        } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
          hls.recoverMediaError();
        } else {
          hls.destroy();
          createMessage(wrapper, '播放暂时不可用，请稍后再试');
        }
      });
      return;
    }

    video.src = stream;
    video.load();
    playVideo(video);
  }

  document.querySelectorAll('[data-player]').forEach(function (wrapper) {
    var layer = wrapper.querySelector('.play-layer');
    var video = wrapper.querySelector('video');

    if (layer) {
      layer.addEventListener('click', function () {
        prepare(wrapper);
      });
    }

    if (video) {
      video.addEventListener('click', function () {
        if (wrapper.dataset.ready !== '1') {
          prepare(wrapper);
        }
      });
    }
  });
})();
