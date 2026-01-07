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
      arrows: false,
      breakpoints: { 768: { gap: '2rem' } }
    },
    '#software-prev',
    '#software-next'
  );

  initSplide(
    '#career-splide',
    {
      type: 'loop',
      autoWidth: true,
      focus: 'center',
      gap: '2rem',
      pagination: false,
      arrows: false,
      breakpoints: { 768: { gap: '1rem' } }
    },
    '#career-prev',
    '#career-next'
  );

  initSplide(
    '#stories-splide',
    {
      type: 'loop',
      autoWidth: true,
      focus: 'center',
      gap: '1.5rem',
      pagination: false,
      arrows: false
    },
    '#stories-prev',
    '#stories-next'
  );

  /* =========================
     Accordion
  ========================== */
  const accordionItems = qsa('.semester-item');

  const closeAccordion = item => setAccordionState(item, false);

  const setAccordionState = (item, open, skipTransition = false) => {
    const btn = qs('.accordion-btn', item);
    const content = qs('.accordion-content', item);
    if (!btn || !content) return;

    btn.setAttribute('aria-expanded', open);

    if (open) {
      content.classList.remove('pointer-events-none', 'opacity-0', 'max-h-0');
      content.classList.add('pl-6'); // Add left padding when open
      content.style.maxHeight = skipTransition
        ? `${content.scrollHeight}px`
        : `${content.scrollHeight}px`;
    } else {
      content.style.maxHeight = '0px';
      content.classList.add('opacity-0', 'pointer-events-none');
      content.classList.remove('pl-6'); // Remove left padding when closed
    }
  };

  accordionItems.forEach((item, i) => {
    const btn = qs('.accordion-btn', item);
    const content = qs('.accordion-content', item);
    if (!btn || !content) return;

    btn.type = 'button';
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', content.id || `accordion-${i}`);
    content.id = btn.getAttribute('aria-controls');

    if (i === 0) setAccordionState(item, true, true);

    btn.addEventListener('click', e => {
      e.preventDefault();
      accordionItems.forEach(closeAccordion);
      setAccordionState(item, true);
    });
  });

  /* =========================
     Career Card Expand
  ========================== */
  qsa('.career-card').forEach(card => {
    const overlay = qs('.career-overlay', card);
    const base = qs('.career-base-banner', card);

    qs('.career-expand-btn', card)?.addEventListener('click', e => {
      e.stopPropagation();
      overlay.classList.remove('h-0', 'translate-y-full', 'opacity-0');
      base.classList.add('opacity-0', 'pointer-events-none');
    });

    qs('.career-collapse-btn', card)?.addEventListener('click', e => {
      e.stopPropagation();
      overlay.classList.add('h-0', 'translate-y-full', 'opacity-0');
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
