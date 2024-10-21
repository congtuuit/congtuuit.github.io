function isFullscreen() {
  return (
    document.fullscreenElement ||
    document.mozFullScreenElement ||
    document.webkitFullscreenElement ||
    document.msFullscreenElement
  );
}

$(document).ready(function () {
  function launchFullscreen(element) {
    if (isFullscreen()) {
      clearInterval(window.requestFullscreen);

      return;
    }

    if (
      !document.fullscreenElement &&
      !document.mozFullScreenElement &&
      !document.webkitFullscreenElement &&
      !document.msFullscreenElement
    ) {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
      }
    }
  }

  window.requestFullscreen = setInterval(() => {
    try {
      launchFullscreen(document.documentElement);
    } catch (err) {}
  }, 1000);
});
