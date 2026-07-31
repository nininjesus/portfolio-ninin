/**
 * Rota el texto de un elemento HTML dado un arreglo de strings.
 * 
 * @param {string} elementId - El ID del elemento HTML cuyo texto será rotado.
 * @param {string[]} textArray - Arreglo de strings a mostrar.
 * @param {number} interval - Tiempo en milisegundos entre cada cambio (por defecto 5000ms).
 */
export function rotateText(elementId, textArray, interval = 5000) {
  const element = document.getElementById(elementId);
  
  if (!element || !textArray || textArray.length === 0) {
    return null;
  }
  
  // Respetar preferencias de movimiento reducido del usuario
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null;
  
  let currentIndex = 0;
  
  return setInterval(() => {
    currentIndex = (currentIndex + 1) % textArray.length;
    element.textContent = textArray[currentIndex];
  }, interval);
}
