(function () {
  var osWindow = null;
  var btn = null;
  var CRT_KEY = 'crt-enabled';

  var noiseFrame = 0;
  var noiseSeed = 1;
  var turbulence = null;
  var rAF_id = null;

  function animateNoise() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }
    noiseFrame++;
    if (noiseFrame % 3 === 0) { // ~20fps
      noiseSeed = (noiseSeed % 999) + 1;
      if (turbulence) turbulence.setAttribute('seed', noiseSeed);
    }
    if (!osWindow) osWindow = document.querySelector('.os-window');
    if (osWindow && osWindow.classList.contains('crt-on')) {
      rAF_id = requestAnimationFrame(animateNoise);
    }
  }

  /** Aplica/remueve el efecto y sincroniza el botón */
  function applyCRT(enabled) {
    if (!osWindow) osWindow = document.querySelector('.os-window');
    if (!btn) btn = document.getElementById('crt-toggle-btn');
    if (!turbulence) turbulence = document.getElementById('crt-turbulence');

    if (enabled) {
      osWindow.classList.add('crt-on');
      osWindow.style.willChange = 'filter';
      if (btn) {
        btn.classList.add('is-active');
        btn.setAttribute('aria-pressed', 'true');
        btn.setAttribute('aria-label', 'Desactivar efecto de monitor CRT');
      }
      if (rAF_id) cancelAnimationFrame(rAF_id);
      rAF_id = requestAnimationFrame(animateNoise);
    } else {
      osWindow.classList.remove('crt-on');
      osWindow.style.willChange = 'auto';
      if (btn) {
        btn.classList.remove('is-active');
        btn.setAttribute('aria-pressed', 'false');
        btn.setAttribute('aria-label', 'Activar efecto de monitor CRT');
      }
      if (rAF_id) {
        cancelAnimationFrame(rAF_id);
        rAF_id = null;
      }
    }
  }

  /** Toggle público: botón lo llama directamente */
  window.toggleCRT = function () {
    var current = localStorage.getItem(CRT_KEY) === 'true';
    var next = !current;
    localStorage.setItem(CRT_KEY, String(next));
    applyCRT(next);
  };

  /** Inicialización: default = OFF, a menos que localStorage diga lo contrario */
  document.addEventListener('DOMContentLoaded', function () {
    var saved = localStorage.getItem(CRT_KEY);
    var enabled = saved === 'true'; /* Arranca desactivado si no hay valor guardado */
    applyCRT(enabled);

    var toggleBtn = document.getElementById('crt-toggle-btn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', window.toggleCRT);
    }
  });
})();
