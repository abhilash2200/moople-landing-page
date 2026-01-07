document.addEventListener('DOMContentLoaded', () => {
  // --- Init & Utility ---
  const header = document.getElementById('main-header');
  const headerTitle = document.getElementById('header-title');
  const marquee = document.getElementById('marquee-section');
  const yearSpan = document.getElementById('year');

  // Set Footer Year
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // Optimized Scroll Handler (Handles both Header Style & Position)
  const updateHeaderState = () => {
    const scrollY = window.scrollY;

    // 1. Header Styling (Blur/Transparency)
    if (scrollY > 20) {
      header.classList.remove('py-3', 'bg-black/10', 'border-transparent');
      header.classList.add('py-3', 'bg-[#020617]/80', 'backdrop-blur-xl', 'border-slate-800/50', 'shadow-[0_8px_32px_0_rgba(0,0,0,0.8)]');
      if (headerTitle) {
        headerTitle.classList.remove('text-lg');
        headerTitle.classList.add('text-base');
      }
    } else {
      header.classList.add('py-3', 'bg-black/10', 'border-transparent');
      header.classList.remove('py-3', 'bg-[#020617]/80', 'backdrop-blur-xl', 'border-slate-800/50', 'shadow-[0_8px_32px_0_rgba(0,0,0,0.8)]');
      if (headerTitle) {
        headerTitle.classList.remove('text-base');
        headerTitle.classList.add('text-lg');
      }
    }

    // 2. Header Position relative to Marquee
    if (marquee) {
      const marqueeRect = marquee.getBoundingClientRect();
      if (marqueeRect.bottom <= 0) {
        header.style.top = '0px';
      } else {
        header.style.top = `${marquee.offsetHeight}px`;
      }
    }
  };

  // Scroll Event Listener with requestAnimationFrame
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateHeaderState();
        ticking = false;
      });
      ticking = true;
    }
  });

  // Handle Resize for Marquee logic
  window.addEventListener('resize', updateHeaderState);

  // Initial Call
  updateHeaderState();

  // Enrollment Form
  const form = document.getElementById('enrollment-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Application Submitted! (Simulation)');
    });
  }

  // Software Carousel (Splide)
  if (document.querySelector('#software-splide')) {
    const softwareSplide = new Splide('#software-splide', {
      type: 'loop',
      autoWidth: true,
      focus: 'center',
      gap: '1rem',
      pagination: false,
      arrows: false,
      breakpoints: {
        768: {
          gap: '2rem',
        }
      }
    });
    softwareSplide.mount();

    const swPrev = document.getElementById('software-prev');
    const swNext = document.getElementById('software-next');
    if (swPrev) swPrev.addEventListener('click', () => softwareSplide.go('<'));
    if (swNext) swNext.addEventListener('click', () => softwareSplide.go('>'));
  }

  // Career Carousel (Splide)
  if (document.querySelector('#career-splide')) {
    const careerSplide = new Splide('#career-splide', {
      type: 'loop',
      autoWidth: true,
      focus: 'center',
      gap: '2rem',
      pagination: false,
      arrows: false,
      breakpoints: {
        768: {
          gap: '1rem',
        }
      }
    });
    careerSplide.mount();

    const carPrev = document.getElementById('career-prev');
    const carNext = document.getElementById('career-next');
    if (carPrev) carPrev.addEventListener('click', () => careerSplide.go('<'));
    if (carNext) carNext.addEventListener('click', () => careerSplide.go('>'));
  }

  // Students Speak Carousel (Splide)
  if (document.querySelector('#stories-splide')) {
    const storiesSplide = new Splide('#stories-splide', {
      type: 'loop',
      autoWidth: true,
      focus: 'center',
      gap: '1.5rem',
      pagination: false,
      arrows: false,
    });
    storiesSplide.mount();

    const stPrev = document.getElementById('stories-prev');
    const stNext = document.getElementById('stories-next');
    if (stPrev) stPrev.addEventListener('click', () => storiesSplide.go('<'));
    if (stNext) stNext.addEventListener('click', () => storiesSplide.go('>'));
  }

  // Course Details Accordion
  const accordionItems = document.querySelectorAll('.semester-item');
  // Open first one by default
  if (accordionItems.length > 0) {
    const firstItem = accordionItems[0];
    const content = firstItem.querySelector('.accordion-content');
    const icon = firstItem.querySelector('.accordion-icon');
    const title = firstItem.querySelector('.accordion-title');

    content.classList.remove('max-h-0', 'opacity-0', 'pointer-events-none');
    content.classList.add('max-h-[400px]', 'opacity-100', 'pb-6', 'px-6', 'bg-slate-50');
    firstItem.classList.add('border-[#F58220]/60', 'ring-1', 'ring-[#F58220]/20');
    firstItem.classList.remove('border-slate-200');
    icon.classList.add('bg-[#F58220]', 'text-white', 'border-transparent', 'rotate-180');
    icon.classList.remove('border-slate-200', 'text-slate-400');
    title.classList.add('text-[#F58220]');
    title.classList.remove('text-slate-900');
  }

  accordionItems.forEach((item) => {
    const btn = item.querySelector('.accordion-btn');
    const content = item.querySelector('.accordion-content');
    const icon = item.querySelector('.accordion-icon');
    const title = item.querySelector('.accordion-title');

    btn.addEventListener('click', () => {
      const isOpen = !content.classList.contains('max-h-0');

      // Close all
      accordionItems.forEach(otherItem => {
        const otherContent = otherItem.querySelector('.accordion-content');
        const otherIcon = otherItem.querySelector('.accordion-icon');
        const otherTitle = otherItem.querySelector('.accordion-title');

        otherContent.classList.add('max-h-0', 'opacity-0', 'pointer-events-none');
        otherContent.classList.remove('max-h-[400px]', 'opacity-100', 'pb-6', 'px-6', 'bg-slate-50');

        otherItem.classList.remove('border-[#F58220]/60', 'ring-1', 'ring-[#F58220]/20');
        otherItem.classList.add('border-slate-200');

        otherIcon.classList.remove('bg-[#F58220]', 'text-white', 'border-transparent', 'rotate-180');
        otherIcon.classList.add('border-slate-200', 'text-slate-400');

        otherTitle.classList.remove('text-[#F58220]');
        otherTitle.classList.add('text-slate-900');
      });

      // Open clicked if it was closed
      if (!isOpen) {
        content.classList.remove('max-h-0', 'opacity-0', 'pointer-events-none');
        content.classList.add('max-h-[400px]', 'opacity-100', 'pb-6', 'px-6', 'bg-slate-50');

        item.classList.add('border-[#F58220]/60', 'ring-1', 'ring-[#F58220]/20');
        item.classList.remove('border-slate-200');

        icon.classList.add('bg-[#F58220]', 'text-white', 'border-transparent', 'rotate-180');
        icon.classList.remove('border-slate-200', 'text-slate-400');

        title.classList.add('text-[#F58220]');
        title.classList.remove('text-slate-900');
      }
    });
  });

  // Career Opportunity Card Expansion
  const careerCards = document.querySelectorAll('.career-card');
  careerCards.forEach(card => {
    const expandBtn = card.querySelector('.career-expand-btn');
    const collapseBtn = card.querySelector('.career-collapse-btn');
    const overlay = card.querySelector('.career-overlay');
    const baseBanner = card.querySelector('.career-base-banner');

    if (expandBtn && collapseBtn && overlay && baseBanner) {
      expandBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        // Close others if needed, but not strictly required
        overlay.classList.remove('h-0', 'translate-y-full', 'opacity-0', 'pointer-events-none');
        overlay.classList.add('h-[75%]', 'translate-y-0', 'opacity-100');
        baseBanner.classList.add('opacity-0', 'pointer-events-none');
      });

      collapseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        overlay.classList.add('h-0', 'translate-y-full', 'opacity-0', 'pointer-events-none');
        overlay.classList.remove('h-[75%]', 'translate-y-0', 'opacity-100');
        baseBanner.classList.remove('opacity-0', 'pointer-events-none');
      });
    }
  });




  // --- Modal Logic ---
  const modal = document.getElementById('enrollment-modal');
  const modalContent = document.getElementById('modal-content');
  const closeModalBtn = document.getElementById('close-modal');
  const modalForm = document.getElementById('modal-enrollment-form');
  let firstFocusableElement = null;
  let lastFocusableElement = null;
  let triggerElement = null;

  function preventBodyScroll() {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    document.body.style.overflow = 'hidden';
  }

  function restoreBodyScroll() {
    document.body.style.paddingRight = '';
    document.body.style.overflow = '';
  }

  function trapFocus(e) {
    if (e.key === 'Tab') {
      if (e.shiftKey) { // Shift + Tab
        if (document.activeElement === firstFocusableElement) {
          e.preventDefault();
          lastFocusableElement.focus();
        }
      } else { // Tab
        if (document.activeElement === lastFocusableElement) {
          e.preventDefault();
          firstFocusableElement.focus();
        }
      }
    }
  }

  function openModal() {
    if (!modal) return;
    triggerElement = document.activeElement; // Store trigger

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    modal.setAttribute('aria-hidden', 'false');

    preventBodyScroll();

    // Focus Management
    const focusableContent = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusableContent.length > 0) {
      firstFocusableElement = focusableContent[0];
      lastFocusableElement = focusableContent[focusableContent.length - 1];
      // Focus the name input preferably, or the first element
      const nameInput = modal.querySelector('input[name="name"]');
      if (nameInput) {
        nameInput.focus();
      } else {
        firstFocusableElement.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
  }

  function closeModal() {
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      modal.setAttribute('aria-hidden', 'true');
      restoreBodyScroll();
      document.removeEventListener('keydown', handleKeyDown);

      // Restore focus
      if (triggerElement && typeof triggerElement.focus === 'function') {
        triggerElement.focus();
      }
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      closeModal();
    } else {
      trapFocus(e);
    }
  }

  // Event Listeners
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeModal();
    });
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Application Submitted! (Simulation)');
      closeModal();
      modalForm.reset();
    });
  }

  // Expose to window for inline HTML onclick handlers
  window.openModal = openModal;
});
