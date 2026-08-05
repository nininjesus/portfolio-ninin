// ============================================================
//  window-detail.js — Multi-Window Manager retro
//  Soporta múltiples ventanas OS simultáneas e independientes
// ============================================================

export const MOBILE_BREAKPOINT = 768;

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
    if (win) openWindow(win, trigger);
  });
  // ResizeObserver en el contenedor layout-main para recalcular 
  // ventanas cuando cambia el tamaño del OS window
  const mainContainer = document.querySelector('.layout-main');
  if (mainContainer) {
    new ResizeObserver(() => {
      recalculateAllWindowPositions();
    }).observe(mainContainer);
  } else {
    const container = document.querySelector('#proyectos.panel');
    if (container) {
      new ResizeObserver(() => {
        recalculateMinimizedPositions(container);
      }).observe(container);
    }
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

  document.addEventListener('mousemove', (e) => {
    if (!activeDragWin) return;
    const win = activeDragWin;
    win._hasDragged = true;

    const containerRect = win.closest('.panel').getBoundingClientRect();

    let newLeft = dragState.startWinLeft + (e.clientX - dragState.startMouseX);
    const maxLeft = containerRect.width - win.offsetWidth;

    // En minimizado aplicamos detección de colisión con otras ventanas minimizadas
    if (win.dataset.state === 'minimized') {
      newLeft = getClampedMinimizedLeft(win, newLeft, containerRect);
      win.style.left = `${newLeft}px`;
    } else {
      newLeft = Math.max(0, Math.min(newLeft, maxLeft));
      win.style.left = `${(newLeft / containerRect.width) * 100}%`;
    }

    // El eje vertical solo se mueve si la ventana está en estado normal.
    if (win.dataset.state === 'normal') {
      let newTop = dragState.startWinTop + (e.clientY - dragState.startMouseY);
      const maxTop = containerRect.height - win.offsetHeight;
      newTop = Math.max(0, Math.min(newTop, maxTop));
      win.style.top = `${(newTop / containerRect.height) * 100}%`;
    }
  });

  document.addEventListener('mouseup', () => {
    if (!activeDragWin) return;
    const win = activeDragWin;
    activeDragWin = null;
    win.style.transition = '';
    document.body.style.userSelect = '';
    // Restablecer el flag en el siguiente tick para que el evento click lo pueda leer
    setTimeout(() => { win._hasDragged = false; }, 0);
  });
}

function recalculateAllWindowPositions() {
  document.querySelectorAll('.window-detail').forEach(win => {
    const state = win.dataset.state;
    const container = win.closest('.panel');
    if (!container) return;

    if (state === 'minimized') {
      recalculateMinimizedPositions(container);
    } else if (state === 'normal') {
      clampWindowInsideContainer(win, container);
    }
  });
}

function clampWindowInsideContainer(win, container) {
  const cW = container.offsetWidth;
  const cH = container.offsetHeight;
  const wW = win.offsetWidth;
  const wH = win.offsetHeight;

  let currentLeft = parseFloat(win.style.left) || 0;
  if (win.style.left.includes('%')) {
    currentLeft = (currentLeft / 100) * cW;
  }
  let currentTop = parseFloat(win.style.top) || 0;
  if (win.style.top.includes('%')) {
    currentTop = (currentTop / 100) * cH;
  }

  const clampedLeft = Math.max(0, Math.min(currentLeft, cW - wW));
  const clampedTop  = Math.max(0, Math.min(currentTop,  cH - wH));

  win.style.left = `${(clampedLeft / cW) * 100}%`;
  win.style.top  = `${(clampedTop / cH) * 100}%`;
}

// ── Inicializar una ventana individual ───────────────────

function initSingleWindow(win) {
  if (win.dataset.state === 'hidden') {
    win.setAttribute('inert', '');
  } else {
    win.removeAttribute('inert');
  }

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

  // Focus Trap
  trapFocus(win);
}

// ── Abrir ─────────────────────────────────────────────────

function openWindow(win, trigger = null) {
  const state = win.dataset.state;

  if (trigger) {
    win._triggerBtn = trigger;
  }

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

    const finalLeft = Math.max(0, baseLeft + offset);
    const finalTop  = Math.max(0, baseTop  + offset);

    win.style.left      = `${(finalLeft / cW) * 100}%`;
    win.style.top       = `${(finalTop / cH) * 100}%`;
    win.style.transform = 'none';
  }

  win.dataset.state = 'normal';
  win.removeAttribute('inert');
  bringToFront(win);
  updateMaximizeButton(win);

  // Foco accesible: Mover foco al botón de cierre
  win.querySelector('[data-action="close"]')?.focus();
}

// ── Cerrar ────────────────────────────────────────────────

function closeWindow(win) {
  win.dataset.state = 'hidden';
  win.setAttribute('inert', '');
  win.style.removeProperty('z-index');
  const container = win.closest('.panel');
  if (container && window.innerWidth <= 768) {
    recalculateMinimizedPositions(container);
  }

  if (win._triggerBtn) {
    win._triggerBtn.focus();
    win._triggerBtn = null;
  }
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
    if (window.innerWidth <= 768) {
      recalculateMinimizedPositions(container);
    } else {
      const cH = container.offsetHeight;
      const wH = win.offsetHeight;
      win.style.top  = `${cH - wH}px`;
      win.style.left = `${getFirstFreeMinimizedLeft(win)}px`;
    }
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

  const container = win.closest('.panel');
  if (container && window.innerWidth <= 768) {
    recalculateMinimizedPositions(container);
  }
}

// ── Capturar posición actual ──────────────────────────────

function capturePosition(win) {
  return { top: win.style.top || '', left: win.style.left || '' };
}

// ── Recalcular posiciones minimizadas (Stack vertical en mobile) ──
function recalculateMinimizedPositions(container) {
  if (!container) return;
  const minimizedWins = Array.from(container.querySelectorAll('.window-detail[data-state="minimized"]'));
  const cH = container.offsetHeight;
  
  if (window.innerWidth <= 768) {
    let currentTop = cH;
    minimizedWins.forEach(win => {
      const wH = win.offsetHeight;
      currentTop -= wH;
      win.style.top = `${currentTop}px`;
      win.style.left = '0px';
    });
  } else {
    const cW = container.offsetWidth;
    minimizedWins.forEach(win => {
      const wH = win.offsetHeight;
      win.style.top = `${cH - wH}px`;
      const wW  = win.offsetWidth;
      const cur = parseInt(win.style.left || '0', 10);
      win.style.left = `${Math.max(0, Math.min(cur, cW - wW))}px`;
    });
  }
}

// ── Actualizar icono del botón maximizar ──────────────────

function updateMaximizeButton(win) {
  const btn = win.querySelector('[data-action="maximize"]');
  if (!btn) return;
  const isMax = win.dataset.state === 'maximized';
  btn.textContent = isMax ? '[▣]' : '[□]';
  btn.setAttribute('aria-label', isMax ? 'Restaurar ventana' : 'Maximizar ventana');
}

// ── Focus Trap ────────────────────────────────────────────

function trapFocus(win) {
  win.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    // Solo atrapar foco si la ventana está activa (normal o maximizada)
    if (win.dataset.state !== 'normal' && win.dataset.state !== 'maximized') return;

    const focusableEls = win.querySelectorAll('a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])');
    if (focusableEls.length === 0) return;

    // Filtrar elementos visibles (simplificado: asume que si tienen width/height o son el activo, son interactuables)
    const visibleEls = Array.from(focusableEls).filter(el => {
      return el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement;
    });

    if (visibleEls.length === 0) return;

    const firstEl = visibleEls[0];
    const lastEl = visibleEls[visibleEls.length - 1];

    if (e.shiftKey) { // Shift + Tab
      if (document.activeElement === firstEl) {
        lastEl.focus();
        e.preventDefault();
      }
    } else { // Tab
      if (document.activeElement === lastEl) {
        firstEl.focus();
        e.preventDefault();
      }
    }
  });
}

// ── Drag ──────────────────────────────────────────────────

/**
 * Encuentra los rangos ocupados por ventanas minimizadas.
 */
function getOccupiedRanges(win, containerRect) {
  return Array.from(
    document.querySelectorAll('.window-detail[data-state="minimized"]')
  )
    .filter((w) => w !== win)
    .map((w) => {
      const r = w.getBoundingClientRect();
      const l = r.left - containerRect.left;
      return { left: l, right: l + w.offsetWidth };
    })
    .sort((a, b) => a.left - b.left);
}

/**
 * Encuentra el primer slot horizontal libre (de izquierda a derecha)
 * donde una nueva ventana minimizada no solape ninguna existente.
 */
function getFirstFreeMinimizedLeft(win) {
  const container = win.closest('.panel');
  if (!container) return 0;

  const winWidth  = win.offsetWidth || 300; // ancho estimado si aún no está en DOM
  const maxLeft   = container.offsetWidth - winWidth;

  const containerRect = container.getBoundingClientRect();
  const occupied = getOccupiedRanges(win, containerRect);

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
  const blockedRanges = getOccupiedRanges(win, containerRect);

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

let activeDragWin = null;
const dragState = {
  startMouseX: 0,
  startMouseY: 0,
  startWinLeft: 0,
  startWinTop: 0
};



function initDrag(win) {
  const header = win.querySelector('.window-detail-header');
  if (!header) return;

  header.addEventListener('mousedown', (e) => {
    if (win.dataset.state !== 'normal' && win.dataset.state !== 'minimized') return;
    if (e.target.closest('.window-controls')) return;

    activeDragWin = win;
    bringToFront(win);

    const containerRect = win.closest('.panel').getBoundingClientRect();
    const winRect       = win.getBoundingClientRect();

    dragState.startWinLeft = winRect.left - containerRect.left;
    dragState.startMouseX  = e.clientX;

    // Para estado normal también capturamos top
    if (win.dataset.state === 'normal') {
      dragState.startWinTop = winRect.top - containerRect.top;
      dragState.startMouseY = e.clientY;
      win.style.top = `${(dragState.startWinTop / containerRect.height) * 100}%`;
    }

    if (win.dataset.state === 'minimized') {
      win.style.left = `${dragState.startWinLeft}px`;
    } else {
      win.style.left = `${(dragState.startWinLeft / containerRect.width) * 100}%`;
    }
    
    win.style.transform = 'none';
    win.style.transition = 'none';
    document.body.style.userSelect = 'none';

    e.preventDefault();
  });
}
