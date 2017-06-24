window.addEventListener('load', function () {
  iFrameResize({
    checkOrigin: false,
    heightCalculationMethod: 'taggedElement'
  }, 'iframe');
}, false);