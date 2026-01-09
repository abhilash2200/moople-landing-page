document.addEventListener('DOMContentLoaded', () => {
  /* =========================
     Utilities
  ========================== */
  const qs = (s, p = document) => p.querySelector(s);
  const qsa = (s, p = document) => [...p.querySelectorAll(s)];

  const yearSpan = qs('#year');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  /* =========================
     Header Scroll Logic
  ========================== */
  const header = qs('#main-header');
  const headerTitle = qs('#header-title');
  const marquee = qs('#marquee-section');

  const updateHeaderState = () => {
    const scrollY = window.scrollY;

    if (scrollY > 20) {
      header.classList.remove('bg-transparent', 'border-transparent');
      header.classList.add(
        'bg-[#fff]/50',
        'backdrop-blur-xl',
        'border-slate-800/50',
        'shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]'
      );
      headerTitle?.classList.replace('text-lg', 'text-base');
    } else {
      header.classList.add('bg-transparent', 'border-transparent');
      header.classList.remove(
        'bg-[#fff]/50',
        'backdrop-blur-xl',
        'border-slate-800/50',
        'shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]'
      );
      headerTitle?.classList.replace('text-base', 'text-lg');
    }

    if (marquee) {
      header.style.top =
        marquee.getBoundingClientRect().bottom <= 0
          ? '0px'
          : `${marquee.offsetHeight}px`;
    }
  };

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateHeaderState();
        ticking = false;
      });
      ticking = true;
    }
  });

  window.addEventListener('resize', updateHeaderState);
  updateHeaderState();


  (function () {
    // Force-unlock scroll if any library locks it
    const unlockScroll = () => {
      document.body.style.overflow = "auto";
      document.body.style.position = "static";
      document.documentElement.style.overflow = "auto";
    };

    // Run immediately
    unlockScroll();

    // Run after select interaction
    document.addEventListener("change", (e) => {
      if (e.target.tagName === "SELECT") {
        setTimeout(unlockScroll, 0);
        setTimeout(unlockScroll, 50);
        setTimeout(unlockScroll, 150);
      }
    });

    // Watch for Flowbite re-locking scroll
    const observer = new MutationObserver(unlockScroll);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["style", "class"],
    });

    // Safety net for mobile browsers
    window.addEventListener("touchend", unlockScroll);
    window.addEventListener("click", unlockScroll);
  })();

  /* =========================
     Reusable Splide Initialiser
  ========================== */
  const initSplide = (id, options, prevId, nextId) => {
    const root = qs(id);
    if (!root) return;

    const splide = new Splide(id, options).mount();

    qs(prevId)?.addEventListener('click', () => splide.go('<'));
    qs(nextId)?.addEventListener('click', () => splide.go('>'));
  };

  initSplide(
    '#software-splide',
    {
      type: 'loop',
      autoWidth: true,
      focus: 'center',
      gap: '1rem',
      pagination: false,
      arrows: true,
      breakpoints: { 768: { gap: '2rem' } }
    },
    null,
    null
  );

  initSplide(
    '#courses-splide',
    {
      type: 'slide',
      perPage: 4,
      perMove: 1,
      gap: '2rem',
      pagination: false,
      arrows: false,
      breakpoints: {
        1024: { perPage: 2, arrows: false },
        768: { perPage: 1, gap: '1.5rem', arrows: true }
      }
    },
    '#courses-prev',
    '#courses-next'
  );

  initSplide(
    '#career-splide',
    {
      type: 'loop',
      autoWidth: true,
      focus: 'center',
      gap: '2rem',
      pagination: false,
      arrows: true,
      breakpoints: { 768: { gap: '1rem' } }
    },
    null,
    null
  );

  initSplide(
    '#stories-splide',
    {
      type: 'loop',
      autoWidth: true,
      focus: 'center',
      gap: '1.5rem',
      pagination: false,
      arrows: true
    },
    null,
    null
  );

  initSplide(
    '#projects-splide',
    {
      type: 'slide',
      perPage: 4,
      perMove: 1,
      gap: '1.25rem',
      pagination: false,
      arrows: true,
      breakpoints: {
        1024: { perPage: 2, gap: '1rem' },
        768: { perPage: 1, gap: '1rem', arrows: true }
      }
    },
    null,
    null
  );

  /* =========================
     Accordion
  ========================== */
  const accordionItems = qsa('.semester-item');

  /**
   * CRITICAL FIX: Proper accordion state management with correct height transitions
   * 
   * ROOT CAUSES IDENTIFIED:
   * 1. scrollHeight measured AFTER removing max-h-0 class → instant jump
   * 2. No proper sequencing → race conditions with CSS transitions
   * 3. Missing toggle-close → clicking open item doesn't close it
   * 4. No keyboard support → accessibility violation
   * 5. No debouncing → rapid clicks cause inconsistent state
   * 6. Height calculation timing → browser hasn't recalculated layout
   */
  const setAccordionState = (item, open, skipTransition = false) => {
    const btn = qs('.accordion-btn', item);
    const content = qs('.accordion-content', item);
    if (!btn || !content) return;

    // Update ARIA state immediately (source of truth)
    btn.setAttribute('aria-expanded', open);

    if (open) {
      // FIX: Measure height BEFORE removing constraints
      // Temporarily remove max-h-0 to measure, but keep it visually hidden
      const hadMaxH0 = content.classList.contains('max-h-0');
      let targetHeight = 0;

      if (hadMaxH0) {
        // Store current inline style
        const currentMaxHeight = content.style.maxHeight;
        // Temporarily remove height constraint to measure
        content.classList.remove('max-h-0');
        content.style.maxHeight = 'none';
        // Force synchronous layout recalculation
        void content.offsetHeight;
        // Measure actual content height
        targetHeight = content.scrollHeight;
        // Immediately restore constraint before browser paints
        content.style.maxHeight = '0px';
        content.classList.add('max-h-0');
        // Force reflow to ensure 0px is applied
        void content.offsetHeight;
      } else {
        // Already measured or partially open
        content.style.maxHeight = 'none';
        void content.offsetHeight;
        targetHeight = content.scrollHeight;
        content.style.maxHeight = '0px';
        void content.offsetHeight;
      }

      // Remove pointer-events-none first (doesn't affect layout)
      content.classList.remove('pointer-events-none');

      if (skipTransition) {
        // Initial load: set immediately without transition
        content.style.maxHeight = `${targetHeight}px`;
        content.classList.remove('max-h-0', 'opacity-0');
        content.classList.add('pl-6', 'opacity-100');
      } else {
        // Animated open: sequence properly
        // Step 1: Remove max-h-0 class (inline style will override)
        content.classList.remove('max-h-0');
        // Step 2: Set target height in next frame to trigger transition
        requestAnimationFrame(() => {
          content.style.maxHeight = `${targetHeight}px`;
          // Step 3: Fade in opacity after height starts animating
          requestAnimationFrame(() => {
            content.classList.remove('opacity-0');
            content.classList.add('opacity-100', 'pl-6');
          });
        });
      }
    } else {
      // Closing: set height to 0 first, then update classes
      const currentHeight = content.scrollHeight;
      content.style.maxHeight = `${currentHeight}px`;
      // Force reflow to ensure height is set
      void content.offsetHeight;

      // Set to 0 in next frame to trigger transition
      requestAnimationFrame(() => {
        content.style.maxHeight = '0px';
        // Update classes after transition starts
        setTimeout(() => {
          content.classList.add('opacity-0', 'pointer-events-none');
          // Add max-h-0 back after transition completes
          setTimeout(() => {
            if (btn.getAttribute('aria-expanded') === 'false') {
              content.classList.add('max-h-0');
            }
          }, 500); // Match transition duration
        }, 50);
        content.classList.remove('opacity-100', 'pl-6');
      });
    }
  };

  // Debounce helper to prevent rapid-fire clicks
  const debounce = (fn, delay = 100) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), delay);
    };
  };

  // Handle accordion toggle with proper state management
  const handleAccordionToggle = (item, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const btn = qs('.accordion-btn', item);
    if (!btn) return;

    const isCurrentlyOpen = btn.getAttribute('aria-expanded') === 'true';

    if (isCurrentlyOpen) {
      // Toggle-close: clicking open item closes it
      setAccordionState(item, false);
    } else {
      // Close all other items first
      accordionItems.forEach(otherItem => {
        const otherBtn = qs('.accordion-btn', otherItem);
        if (otherBtn && otherBtn.getAttribute('aria-expanded') === 'true') {
          setAccordionState(otherItem, false);
        }
      });

      // Small delay to ensure other items start closing first
      setTimeout(() => {
        setAccordionState(item, true);
      }, 10);
    }
  };

  // Debounced toggle handler
  const debouncedToggle = debounce(handleAccordionToggle, 150);

  // Initialize accordion items
  accordionItems.forEach((item, i) => {
    const btn = qs('.accordion-btn', item);
    const content = qs('.accordion-content', item);
    if (!btn || !content) return;

    // Ensure button type (prevents form submission)
    btn.type = 'button';

    // Setup ARIA attributes
    const contentId = content.id || `accordion-content-${i}`;
    content.id = contentId;
    btn.setAttribute('aria-controls', contentId);
    btn.setAttribute('aria-expanded', 'false');

    // Initial state: open first item without transition
    if (i === 0) {
      setAccordionState(item, true, true);
    }

    // Click handler with scroll prevention
    btn.addEventListener('click', e => {
      debouncedToggle(item, e);
    });

    // Keyboard support (Enter and Space)
    btn.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();
        debouncedToggle(item, e);
      }
    });
  });

  // Handle window resize: update open accordion heights
  const handleResize = debounce(() => {
    accordionItems.forEach(item => {
      const btn = qs('.accordion-btn', item);
      const content = qs('.accordion-content', item);
      if (btn && btn.getAttribute('aria-expanded') === 'true') {
        // Temporarily remove max-height to get accurate measurement
        const currentMaxHeight = content.style.maxHeight;
        content.style.maxHeight = 'none';
        const newHeight = content.scrollHeight;
        content.style.maxHeight = currentMaxHeight;
        // Update height
        requestAnimationFrame(() => {
          if (btn.getAttribute('aria-expanded') === 'true') {
            content.style.maxHeight = `${newHeight}px`;
          }
        });
      }
    });
  }, 150);

  window.addEventListener('resize', handleResize);
  

  /* =========================
     Career Card Expand
  ========================== */
  qsa('.career-card').forEach(card => {
    const overlay = qs('.career-overlay', card);
    const base = qs('.career-base-banner', card);

    if (!overlay || !base) return;

    qs('.career-expand-btn', card)?.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      
      // Expand overlay: remove closed state classes and add open state classes
      overlay.classList.remove('h-0', 'translate-y-full', 'opacity-0', 'pointer-events-none');
      overlay.classList.add('h-[75%]', 'translate-y-0', 'opacity-100');
      
      // Hide base banner
      base.classList.add('opacity-0', 'pointer-events-none');
    });

    qs('.career-collapse-btn', card)?.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      
      // Collapse overlay: remove open state classes and add closed state classes
      overlay.classList.remove('h-[75%]', 'translate-y-0', 'opacity-100');
      overlay.classList.add('h-0', 'translate-y-full', 'opacity-0', 'pointer-events-none');
      
      // Show base banner
      base.classList.remove('opacity-0', 'pointer-events-none');
    });
  });

  /* =========================
     Modal
  ========================== */
  const modal = qs('#enrollment-modal');
  const closeBtn = qs('#close-modal');
  const modalForm = qs('#modal-enrollment-form');
  let triggerEl = null;

  const lockScroll = lock => {
    document.body.style.overflow = lock ? 'hidden' : '';
  };

  window.openModal = () => {
    triggerEl = document.activeElement;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    lockScroll(true);
  };

  const closeModal = () => {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    lockScroll(false);
    triggerEl?.focus();
  };

  closeBtn?.addEventListener('click', closeModal);
  modal?.addEventListener('click', e => e.target === modal && closeModal());

  modalForm?.addEventListener('submit', e => {
    e.preventDefault();
    alert('Application Submitted! (Simulation)');
    modalForm.reset();
    closeModal();
  });
});
