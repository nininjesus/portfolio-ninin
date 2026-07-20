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
  // ResizeObserver en el contenedor: recalcula el top de ventanas minimizadas
  // cuando cambia el tamaño del layout (más preciso que window 'resize').
  const container = document.querySelector('#proyectos.panel');
  if (container) {
    new ResizeObserver(() => {
      const cH = container.offsetHeight;
      document.querySelectorAll('.window-detail[data-state="minimized"]').forEach((win) => {
        const wH = win.offsetHeight;
        win.style.top = `${cH - wH}px`;
        const cW  = container.offsetWidth;
        const wW  = win.offsetWidth;
        const cur = parseInt(win.style.left || '0', 10);
        win.style.left = `${Math.max(0, Math.min(cur, cW - wW))}px`;
      });
    }).observe(container);
  }
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
      if (win._hasDragged) return; // No restaurar si acaba de terminar un drag
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
  const container = win.closest('.panel');
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

  // Apagar transiciones temporalmente para evitar el glitch visual
  // al animar top/width mientras height: auto hace snap.
  win.style.transition = 'none';
  void win.offsetWidth; // Forzar reflow

  // Cambiar estado primero para que el CSS aplique width:300px / height:auto
  win.dataset.state = 'minimized';
  updateMaximizeButton(win);

  // Limpiar todos los inline styles de posición que puedan venir
  // del estado maximizado o de un drag previo
  win.style.removeProperty('transform');
  win.style.removeProperty('width');
  win.style.removeProperty('height');

  // Calcular posición explícita: pegar al fondo del contenedor
  // Usamos top en px en lugar de CSS bottom:0 para garantizar que
  // el valor sea correcto independientemente del estado anterior.
  const container = win.closest('.panel');
  if (container) {
    // Forzar reflow para obtener las dimensiones reales del estado minimizado
    const cH = container.offsetHeight;
    const wH = win.offsetHeight;
    win.style.top  = `${cH - wH}px`;
    win.style.left = `${getFirstFreeMinimizedLeft(win)}px`;
  } else {
    win.style.left = `${getFirstFreeMinimizedLeft(win)}px`;
  }

  // Restaurar transiciones en el siguiente frame
  requestAnimationFrame(() => {
    win.style.transition = '';
  });
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

/**
 * Encuentra el primer slot horizontal libre (de izquierda a derecha)
 * donde una nueva ventana minimizada no solape ninguna existente.
 */
function getFirstFreeMinimizedLeft(win) {
  const container = win.closest('.panel');
  if (!container) return 0;

  const winWidth  = win.offsetWidth || 300; // ancho estimado si aún no está en DOM
  const maxLeft   = container.offsetWidth - winWidth;

  const occupied = Array.from(
    document.querySelectorAll('.window-detail[data-state="minimized"]')
  )
    .filter((w) => w !== win)
    .map((w) => {
      const r = w.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
      const l = r.left - containerRect.left;
      return { left: l, right: l + w.offsetWidth };
    })
    .sort((a, b) => a.left - b.left);

  let candidate = 0;
  for (const range of occupied) {
    if (candidate + winWidth <= range.left) break; // slot libre encontrado
    candidate = range.right;                        // saltar al siguiente hueco
  }

  return Math.max(0, Math.min(candidate, maxLeft));
}

/**
 * Calcula la posición left más cercana a `desiredLeft` sin que la ventana
 * minimizada se solape con ninguna otra ventana minimizada.
 * Funciona como paredes de choque: al tocar otra ventana, rebota al borde más cercano.
 */
function getClampedMinimizedLeft(win, desiredLeft, containerRect) {
  const winWidth = win.offsetWidth;
  const maxLeft  = containerRect.width - winWidth;

  // Rangos ocupados por otras ventanas minimizadas
  const blockedRanges = Array.from(
    document.querySelectorAll('.window-detail[data-state="minimized"]')
  )
    .filter((w) => w !== win)
    .map((w) => {
      const r = w.getBoundingClientRect();
      const l = r.left - containerRect.left;
      return { left: l, right: l + w.offsetWidth };
    })
    .sort((a, b) => a.left - b.left);

  let left = Math.max(0, Math.min(desiredLeft, maxLeft));

  for (const range of blockedRanges) {
    const overlaps = left < range.right && (left + winWidth) > range.left;
    if (overlaps) {
      // Dos candidatos: pegar a la izquierda o a la derecha del bloque
      const snapLeft  = Math.max(0, range.left - winWidth); // a la izquierda del bloqueador
      const snapRight = Math.min(maxLeft, range.right);      // a la derecha del bloqueador

      // Elegir el borde más cercano al destino deseado
      left = Math.abs(desiredLeft - snapLeft) <= Math.abs(desiredLeft - snapRight)
        ? snapLeft
        : snapRight;
    }
  }

  return left;
}

function initDrag(win) {
  const header = win.querySelector('.window-detail-header');
  if (!header) return;

  let isDragging   = false;
  let startMouseX  = 0;
  let startMouseY  = 0;
  let startWinLeft = 0;
  let startWinTop  = 0;

  header.addEventListener('mousedown', (e) => {
    if (win.dataset.state !== 'normal' && win.dataset.state !== 'minimized') return;
    if (e.target.closest('.window-controls')) return;

    isDragging = true;
    bringToFront(win);

    const containerRect = win.closest('.panel').getBoundingClientRect();
    const winRect       = win.getBoundingClientRect();

    startWinLeft = winRect.left - containerRect.left;
    startMouseX  = e.clientX;

    // Para estado normal también capturamos top
    if (win.dataset.state === 'normal') {
      startWinTop = winRect.top - containerRect.top;
      startMouseY = e.clientY;
      win.style.top = `${startWinTop}px`;
    }

    win.style.left      = `${startWinLeft}px`;
    win.style.transform = 'none';
    win.style.transition = 'none';
    document.body.style.userSelect = 'none';

    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    win._hasDragged = true;

    const containerRect = win.closest('.panel').getBoundingClientRect();

    let newLeft = startWinLeft + (e.clientX - startMouseX);
    const maxLeft = containerRect.width - win.offsetWidth;

    // En minimizado aplicamos detección de colisión con otras ventanas minimizadas
    if (win.dataset.state === 'minimized') {
      newLeft = getClampedMinimizedLeft(win, newLeft, containerRect);
    } else {
      newLeft = Math.max(0, Math.min(newLeft, maxLeft));
    }
    win.style.left = `${newLeft}px`;

    // El eje vertical solo se mueve si la ventana está en estado normal.
    // En minimizado, CSS bottom: 0 mantiene la ventana al fondo automáticamente.
    if (win.dataset.state === 'normal') {
      let newTop = startWinTop + (e.clientY - startMouseY);
      const maxTop = containerRect.height - win.offsetHeight;
      newTop = Math.max(0, Math.min(newTop, maxTop));
      win.style.top = `${newTop}px`;
    }
  });

  document.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    win.style.transition = '';
    document.body.style.userSelect = '';
    // Restablecer el flag en el siguiente tick para que el evento click lo pueda leer
    setTimeout(() => { win._hasDragged = false; }, 0);
  });
}
