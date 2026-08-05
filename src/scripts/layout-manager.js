import { playCLIEntrance, resetCLIEntrance } from './cli-entrance.js';
import { MOBILE_BREAKPOINT } from './window-detail.js';

document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('section.panel');
  const titleElement = document.getElementById('active-section-title');
  const navLinks = document.querySelectorAll('[data-nav-link]');
  const scrollContainer = document.getElementById('sections-container');

  if (!scrollContainer) return;

  const observerOptions = {
    root: scrollContainer,
    rootMargin: '0px',
    threshold: 0.5
  };

  // Observador para la navegación, títulos y accesibilidad (Continuo)
  const layoutObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Manejar foco de teclado con inert
        sections.forEach(sec => sec.setAttribute('inert', ''));
        entry.target.removeAttribute('inert');

        // Actualizar Título
        const newTitle = entry.target.getAttribute('data-title');
        if (newTitle && titleElement) {
          titleElement.textContent = newTitle;
        }

        // Actualizar Nav Activo
        const activeId = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('is-active');
          link.removeAttribute('aria-current');
          if (link.getAttribute('href') === `#${activeId}`) {
            link.classList.add('is-active');
            link.setAttribute('aria-current', 'page');
          }
        });
      }
    });
  }, observerOptions);

  // Observador para la animación CLI (Una sola vez)
  const cliObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        resetCLIEntrance(entry.target);
        playCLIEntrance(entry.target);
        cliObserver.unobserve(entry.target); // Dejar de observar la sección
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    layoutObserver.observe(section);
    cliObserver.observe(section);
  });
  
  // Mobile Menu Toggle
  const menuBtn = document.getElementById('menu-btn');
  const sidebar = document.querySelector('.layout-sidebar');
  
  if (menuBtn && sidebar) {
    menuBtn.addEventListener('click', () => {
      const isOpen = sidebar.classList.contains('is-open');
      if (isOpen) {
        sidebar.classList.remove('is-open');
        menuBtn.setAttribute('aria-expanded', 'false');
      } else {
        sidebar.classList.add('is-open');
        menuBtn.setAttribute('aria-expanded', 'true');
      }
    });

    // Close sidebar when clicking a nav link (mobile)
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= MOBILE_BREAKPOINT) {
          sidebar.classList.remove('is-open');
          menuBtn.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // Close sidebar when clicking outside (mobile)
    document.addEventListener('click', (event) => {
      if (window.innerWidth <= MOBILE_BREAKPOINT && sidebar.classList.contains('is-open')) {
        if (!sidebar.contains(event.target) && !menuBtn.contains(event.target)) {
          sidebar.classList.remove('is-open');
          menuBtn.setAttribute('aria-expanded', 'false');
        }
      }
    });
  }

  // Scroll con JS usando comportamiento instantáneo (estilo OS retro)
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);
      if (targetSection && scrollContainer) {
        if (window.innerWidth <= MOBILE_BREAKPOINT) {
          scrollContainer.scrollTo({
            top: targetSection.offsetTop,
            behavior: 'instant'
          });
        } else {
          scrollContainer.scrollTo({
            left: targetSection.offsetLeft,
            behavior: 'instant'
          });
        }
        // Actualizar URL sin causar scroll nativo del browser
        history.pushState({ sectionId: targetId }, '', `#${targetId}`);
      }
    });
  });

  // Soporte para el botón Atrás / Adelante del browser
  window.addEventListener('popstate', (event) => {
    const sectionId = event.state?.sectionId ?? location.hash.replace('#', '');
    if (!sectionId) return;
    const targetSection = document.getElementById(sectionId);
    if (targetSection && scrollContainer) {
      if (window.innerWidth <= MOBILE_BREAKPOINT) {
        scrollContainer.scrollTo({ top: targetSection.offsetTop, behavior: 'instant' });
      } else {
        scrollContainer.scrollTo({ left: targetSection.offsetLeft, behavior: 'instant' });
      }
    }
  });

  // Re-centrar la sección activa al cambiar entre Desktop (eje X) y Mobile (eje Y)
  let lastWidth = window.innerWidth;
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const currentWidth = window.innerWidth;
      const crossedBreakpoint = (lastWidth > MOBILE_BREAKPOINT && currentWidth <= MOBILE_BREAKPOINT) || (lastWidth <= MOBILE_BREAKPOINT && currentWidth > MOBILE_BREAKPOINT);
      
      if (crossedBreakpoint) {
        const activeLink = document.querySelector('[data-nav-link].is-active');
        if (activeLink) {
          const targetId = activeLink.getAttribute('href').substring(1);
          const targetSection = document.getElementById(targetId);
          if (targetSection && scrollContainer) {
            if (currentWidth <= MOBILE_BREAKPOINT) {
              scrollContainer.scrollTo({ top: targetSection.offsetTop, behavior: 'instant' });
            } else {
              scrollContainer.scrollTo({ left: targetSection.offsetLeft, behavior: 'instant' });
            }
          }
        }
      }
      lastWidth = currentWidth;
    }, 100);
  });

  // Deep linking: si la URL ya tiene un hash al cargar, ir a esa sección
  const initialHash = location.hash.replace('#', '');
  const initialSection = initialHash ? document.getElementById(initialHash) : null;

  if (initialSection) {
    // Registrar el estado inicial en el historial
    history.replaceState({ sectionId: initialHash }, '', `#${initialHash}`);
    if (window.innerWidth <= MOBILE_BREAKPOINT) {
      scrollContainer.scrollTo({ top: initialSection.offsetTop, behavior: 'instant' });
    } else {
      scrollContainer.scrollTo({ left: initialSection.offsetLeft, behavior: 'instant' });
    }
  } else if (window.innerWidth <= MOBILE_BREAKPOINT && sections.length > 0) {
    scrollContainer.scrollTo({ top: 0, behavior: 'instant' });
  }

});
