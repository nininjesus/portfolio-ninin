// ============================================================
//  window-detail.js — Multi-Window Manager retro
//  Soporta múltiples ventanas OS simultáneas e independientes
// ============================================================

// ── Z-Index Manager ───────────────────────────────────────
let zIndexCounter = 50;

function bringToFront(win) {
  zIndexCounter += 1;
  win.style.zIndex = String(zIndexCounter);
}

// ── Cascade Positioning ───────────────────────────────────
// Desplazamiento entre ventanas para que no se pisen al abrirse.
let cascadeOffset = 0;
const CASCADE_STEP = 28;
const CASCADE_MAX  = 140;

function getNextCascadeOffset() {
  const offset = cascadeOffset;
  cascadeOffset = (cascadeOffset + CASCADE_STEP) % CASCADE_MAX;
  return offset;
}

// ── Per-Window State Map ──────────────────────────────────
// Almacena savedPos para cada ventana usando su ID como clave.
// Evita closures anidados y hace que la delegación de eventos funcione.
const windowState = new Map(); // id → { top, left }

// ── Inicialización Global ─────────────────────────────────

export function initWindowManager() {
  const allWindows = document.querySelectorAll('.window-detail');
  allWindows.forEach((win) => {
    windowState.set(win.id, null); // inicializar estado
    initSingleWindow(win);
  });

  // Delegación global: botones con data-target-window abren esa ventana
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-target-window]');
    if (!trigger) return;
    const win = document.getElementById(trigger.dataset.targetWindow);
    if (win) openWindow(win);
  });
}

// ── Inicializar una ventana individual ───────────────────

function initSingleWindow(win) {
  // Controles
  win.querySelector('[data-action="close"]')
    ?.addEventListener('click', () => closeWindow(win));

  win.querySelector('[data-action="minimize"]')
    ?.addEventListener('click', () => minimizeWindow(win));

  win.querySelector('[data-action="maximize"]')
    ?.addEventListener('click', () => toggleMaximize(win));

  // Click en header minimizado → restaurar
  win.querySelector('.window-detail-header')
    ?.addEventListener('click', (e) => {
      if (
        win.dataset.state === 'minimized' &&
        !e.target.closest('.window-controls')
      ) {
        restoreWindow(win);
      }
    });

  // Click en la ventana → traer al frente
  win.addEventListener('mousedown', () => bringToFront(win), { capture: true });

  // Drag
  initDrag(win);
}

// ── Escape: cierra la ventana visible con mayor z-index ───

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  let topWin = null;
  let topZ   = -Infinity;
  document.querySelectorAll('.window-detail').forEach((w) => {
    if (w.dataset.state === 'hidden') return;
    const z = parseInt(w.style.zIndex || '0', 10);
    if (z > topZ) { topZ = z; topWin = w; }
  });
  if (topWin) closeWindow(topWin);
});

// ── Abrir ─────────────────────────────────────────────────

function openWindow(win) {
  const state = win.dataset.state;

  if (state !== 'hidden') {
    // Ya visible: traer al frente. Si está minimizada, restaurarla.
    bringToFront(win);
    if (state === 'minimized') restoreWindow(win);
    return;
  }

  // Calcular posición centrada + cascada
  const container = win.parentElement;
  if (container) {
    const cW = container.offsetWidth;
    const cH = container.offsetHeight;

    // Calcular tamaño real o estimado
    const wW = Math.min(cW * 0.6, 860);
    const wH = cH * 0.65;

    const offset   = getNextCascadeOffset();
    const baseLeft = Math.round((cW - wW) / 2);
    const baseTop  = Math.round((cH - wH) / 2);

    win.style.left      = `${Math.max(0, baseLeft + offset)}px`;
    win.style.top       = `${Math.max(0, baseTop  + offset)}px`;
    win.style.transform = 'none';
  }

  win.dataset.state = 'normal';
  bringToFront(win);
  updateMaximizeButton(win);

  // Foco accesible
  win.querySelector('button, [href], [tabindex="0"]')?.focus();
}

// ── Cerrar ────────────────────────────────────────────────

function closeWindow(win) {
  win.dataset.state = 'hidden';
  win.style.removeProperty('z-index');
}

// ── Minimizar ─────────────────────────────────────────────

function minimizeWindow(win) {
  if (win.dataset.state === 'normal') {
    windowState.set(win.id, capturePosition(win));
  }
  win.dataset.state = 'minimized';
  updateMaximizeButton(win);
}

// ── Maximizar / Restaurar ─────────────────────────────────

function toggleMaximize(win) {
  if (win.dataset.state === 'maximized') {
    restoreWindow(win);
    return;
  }
  // Guardar posición antes de maximizar
  if (win.dataset.state === 'normal') {
    windowState.set(win.id, capturePosition(win));
  }
  win.dataset.state = 'maximized';
  win.style.removeProperty('top');
  win.style.removeProperty('left');
  win.style.removeProperty('transform');
  bringToFront(win);
  updateMaximizeButton(win);
}

// ── Restaurar a normal ────────────────────────────────────

function restoreWindow(win) {
  win.dataset.state = 'normal';

  const saved = windowState.get(win.id);
  if (saved?.top) {
    win.style.top       = saved.top;
    win.style.left      = saved.left;
    win.style.transform = 'none';
  }

  bringToFront(win);
  updateMaximizeButton(win);
}

// ── Capturar posición actual ──────────────────────────────

function capturePosition(win) {
  return { top: win.style.top || '', left: win.style.left || '' };
}

// ── Actualizar icono del botón maximizar ──────────────────

function updateMaximizeButton(win) {
  const btn = win.querySelector('[data-action="maximize"]');
  if (!btn) return;
  const isMax = win.dataset.state === 'maximized';
  btn.textContent = isMax ? '[▣]' : '[□]';
  btn.setAttribute('aria-label', isMax ? 'Restaurar ventana' : 'Maximizar ventana');
}

// ── Drag ──────────────────────────────────────────────────

function initDrag(win) {
  const header = win.querySelector('.window-detail-header');
  if (!header) return;

  let isDragging   = false;
  let startMouseX  = 0;
  let startMouseY  = 0;
  let startWinLeft = 0;
  let startWinTop  = 0;

  header.addEventListener('mousedown', (e) => {
    if (win.dataset.state !== 'normal') return;
    if (e.target.closest('.window-controls')) return;

    isDragging = true;
    bringToFront(win);

    const containerRect = win.parentElement.getBoundingClientRect();
    const winRect       = win.getBoundingClientRect();

    startWinLeft = winRect.left - containerRect.left;
    startWinTop  = winRect.top  - containerRect.top;
    startMouseX  = e.clientX;
    startMouseY  = e.clientY;

    win.style.left      = `${startWinLeft}px`;
    win.style.top       = `${startWinTop}px`;
    win.style.transform = 'none';
    win.style.transition = 'none';
    document.body.style.userSelect = 'none';

    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const containerRect = win.parentElement.getBoundingClientRect();

    let newLeft = startWinLeft + (e.clientX - startMouseX);
    let newTop  = startWinTop  + (e.clientY - startMouseY);

    const maxLeft = containerRect.width  - win.offsetWidth;
    const maxTop  = containerRect.height - win.offsetHeight;

    newLeft = Math.max(0, Math.min(newLeft, maxLeft));
    newTop  = Math.max(0, Math.min(newTop,  maxTop));

    win.style.left = `${newLeft}px`;
    win.style.top  = `${newTop}px`;
  });

  document.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    win.style.transition = '';
    document.body.style.userSelect = '';
  });
}
