// src/scripts/cli-entrance.js

const CLI_CHAR_SPEED   = 40;  // ms/char — velocidad constante del typewriter
const CLI_LINE_DURATION = 300; // ms — fade-in para outputs
const CLI_BASE_DELAY    = 150; // ms — escalonamiento entre líneas

export function playCLIEntrance(sectionEl) {
  // Respetar prefers-reduced-motion
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Seleccionar elementos animables en orden DOM
  const lines = sectionEl.querySelectorAll('[data-cli-line]');
  
  let currentDelay = 0;

  lines.forEach((line) => {
    const isTypewriter = line.dataset.cliLine === 'typewriter';
    const chars = line.textContent.trim().length || 1;
    
    // Typewriter: velocidad constante por carácter (ritmo visual idéntico en todas las secciones)
    const duration = isTypewriter ? (chars * CLI_CHAR_SPEED) : CLI_LINE_DURATION;
    
    // El delay para esta línea
    const delay = reduced ? 0 : currentDelay;
    
    // Sumar al delay acumulado para la *siguiente* línea
    if (!reduced) {
      if (isTypewriter) {
        // La siguiente línea espera a que termine de escribirse + una pausa de 100ms
        currentDelay += duration + 100;
      } else {
        // Las líneas normales se escalonan más rápido
        currentDelay += CLI_BASE_DELAY;
      }
    }
    
    line.style.setProperty('--cli-delay', `${delay}ms`);
    line.style.setProperty('--cli-duration', `${duration}ms`);
    line.style.setProperty('--cli-chars', chars);
    line.classList.add(isTypewriter ? 'cli-typewriter' : 'cli-line');
  });

  // Activar todos en el siguiente frame
  requestAnimationFrame(() => {
    lines.forEach(line => line.classList.add('is-visible'));
  });
}

export function resetCLIEntrance(sectionEl) {
  const lines = sectionEl.querySelectorAll('[data-cli-line]');
  lines.forEach(line => {
    line.classList.remove('cli-line', 'cli-typewriter', 'is-visible');
  });
}
