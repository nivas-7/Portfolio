/**
 * Handles scroll-driven UI behavior:
 * - Reveal-on-scroll animations
 * - Sticky navbar shadow
 * - Active nav link highlighting
 * - Scroll-to-top button visibility + click handler
 */
const ScrollAnimations = (() => {
  /**
   * Sets up IntersectionObserver to add .revealed to elements
   * marked with [data-reveal] or [data-reveal-group] once they
   * scroll into view. Unobserves after reveal (one-time animation).
   */
  const initRevealOnScroll = () => {
    const revealElements = document.querySelectorAll('[data-reveal], [data-reveal-group]');
    if (revealElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            obs.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px', // triggers slightly before fully in view
      }
    );

    revealElements.forEach((el) => observer.observe(el));
  };

  /**
   * Adds a shadow/background change to the navbar once the page
   * has scrolled past a small threshold, so it stands out against content.
   */
  const initNavbarScrollEffect = () => {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    const SCROLL_THRESHOLD = 20;

    const handleScroll = () => {
      if (window.scrollY > SCROLL_THRESHOLD) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // run once on load in case page loads mid-scroll (e.g. anchor link)
  };

  /**
   * Highlights the nav link corresponding to whichever section
   * is currently most visible in the viewport.
   */
  const initActiveNavHighlight = () => {
    const sections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    if (sections.length === 0 || navLinks.length === 0) return;

    const setActiveLink = (sectionId) => {
      navLinks.forEach((link) => {
        link.classList.toggle('active', link.dataset.section === sectionId);
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveLink(entry.target.id);
          }
        });
      },
      {
        // A horizontal band around the vertical middle of the viewport —
        // whichever section crosses this band is considered "active"
        rootMargin: '-45% 0px -45% 0px',
        threshold: 0,
      }
    );

    sections.forEach((section) => observer.observe(section));
  };

  /**
   * Shows the scroll-to-top button after scrolling down a bit,
   * and wires up its click-to-scroll-to-top behavior.
   */
  const initScrollToTop = () => {
    const btn = document.getElementById('scroll-top-btn');
    if (!btn) return;

    const SHOW_THRESHOLD = 400;

    const handleScroll = () => {
      btn.classList.toggle('visible', window.scrollY > SHOW_THRESHOLD);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  /**
   * Closes the mobile nav menu automatically after a link is clicked,
   * so navigating doesn't leave the menu awkwardly open.
   */
  const initMobileNavAutoClose = () => {
    const navLinks = document.getElementById('nav-links');
    const hamburger = document.getElementById('hamburger');
    if (!navLinks || !hamburger) return;

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  };

  /**
   * Wires up the hamburger button itself to toggle the mobile nav menu.
   */
  const initHamburgerToggle = () => {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });
  };
const initDynamicContentReveal = () => {
  document.addEventListener('content-rendered', () => {
    initRevealOnScroll();
  });
};
  const init = () => {
    initRevealOnScroll();
    initNavbarScrollEffect();
    initActiveNavHighlight();
    initScrollToTop();
    initHamburgerToggle();
    initMobileNavAutoClose();
    initDynamicContentReveal();
  };

  return { init };
})();

document.addEventListener('DOMContentLoaded', () => {
  ScrollAnimations.init();
});
/**
 * Re-scans the DOM for [data-reveal] / [data-reveal-group] elements
 * that were injected AFTER the initial page load.
 */
