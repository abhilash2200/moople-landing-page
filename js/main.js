document.addEventListener('DOMContentLoaded', () => {
  // Header Scroll Effect
  const header = document.getElementById('main-header');
  const headerTitle = document.getElementById('header-title');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
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
  });

  // Enrollment Form
  const form = document.getElementById('enrollment-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Application Submitted! (Simulation)');
    });
  }

  // Generic Carousel Logic
  const initCarousel = (containerId, prevId, nextId, scrollAmountFunc) => {
    const container = document.getElementById(containerId);
    const prevBtn = document.getElementById(prevId);
    const nextBtn = document.getElementById(nextId);

    if (container && prevBtn && nextBtn) {
      const scroll = (direction) => {
        const scrollAmount = scrollAmountFunc ? scrollAmountFunc(container) : container.clientWidth / 2;
        const scrollTo = direction === 'left' ? container.scrollLeft - scrollAmount : container.scrollLeft + scrollAmount;
        container.scrollTo({ left: scrollTo, behavior: 'smooth' });
      };

      prevBtn.addEventListener('click', () => scroll('left'));
      nextBtn.addEventListener('click', () => scroll('right'));
    }
  };

  // Software Carousel
  initCarousel('software-list', 'software-prev', 'software-next', (c) => c.clientWidth / 2);

  // Career Carousel
  initCarousel('career-list', 'career-prev', 'career-next', (c) => c.clientWidth / 2);

  // Students Speak Carousel
  initCarousel('stories-list', 'stories-prev', 'stories-next', (c) => {
    return window.innerWidth < 768 ? c.clientWidth : c.clientWidth / 2;
  });

  // Course Details Accordion
  const accordionItems = document.querySelectorAll('.semester-item');
  // Open first one by default
  if (accordionItems.length > 0) {
    const firstItem = accordionItems[0];
    const content = firstItem.querySelector('.accordion-content');
    const icon = firstItem.querySelector('.accordion-icon');
    const title = firstItem.querySelector('.accordion-title');

    content.classList.remove('max-h-0', 'opacity-0', 'pointer-events-none');
    content.classList.add('max-h-[400px]', 'opacity-100', 'pb-6', 'px-6');
    firstItem.classList.add('border-[#F58220]/60', 'ring-1', 'ring-[#F58220]/20', 'bg-zinc-900/80');
    firstItem.classList.remove('border-white/5');
    icon.classList.add('bg-[#F58220]', 'text-white', 'border-transparent', 'rotate-180');
    icon.classList.remove('border-white/20', 'text-white/40');
    title.classList.add('text-[#F58220]');
    title.classList.remove('text-white');
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
        otherContent.classList.remove('max-h-[400px]', 'opacity-100', 'pb-6', 'px-6');

        otherItem.classList.remove('border-[#F58220]/60', 'ring-1', 'ring-[#F58220]/20', 'bg-zinc-900/80');
        otherItem.classList.add('border-white/5');

        otherIcon.classList.remove('bg-[#F58220]', 'text-white', 'border-transparent', 'rotate-180');
        otherIcon.classList.add('border-white/20', 'text-white/40');

        otherTitle.classList.remove('text-[#F58220]');
        otherTitle.classList.add('text-white');
      });

      // Open clicked if it was closed
      if (!isOpen) {
        content.classList.remove('max-h-0', 'opacity-0', 'pointer-events-none');
        content.classList.add('max-h-[400px]', 'opacity-100', 'pb-6', 'px-6');

        item.classList.add('border-[#F58220]/60', 'ring-1', 'ring-[#F58220]/20', 'bg-zinc-900/80');
        item.classList.remove('border-white/5');

        icon.classList.add('bg-[#F58220]', 'text-white', 'border-transparent', 'rotate-180');
        icon.classList.remove('border-white/20', 'text-white/40');

        title.classList.add('text-[#F58220]');
        title.classList.remove('text-white');
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

  // Video Player Logic
  const videoCards = document.querySelectorAll('.video-card');
  videoCards.forEach(card => {
    const video = card.querySelector('video');
    const playBtn = card.querySelector('.play-btn');
    const overlay = card.querySelector('.video-overlay'); // click to pause area
    const progressBar = card.querySelector('.progress-bar-fill');
    const timeDisplay = card.querySelector('.time-display');
    const playIcon = card.querySelector('.play-icon'); // small icon in controls

    // Ensure playIcon exists
    const playControlBtn = playIcon ? playIcon.parentElement : null;

    let isPlaying = false;

    const togglePlay = () => {
      if (video.paused) {
        video.play();
        isPlaying = true;
        playBtn.style.display = 'none';
        if (overlay) overlay.style.display = 'block';
        if (playIcon) playIcon.innerHTML = `<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />`;
      } else {
        video.pause();
        isPlaying = false;
        playBtn.style.display = 'flex';
        if (overlay) overlay.style.display = 'none';
        if (playIcon) playIcon.innerHTML = `<path d="M8 5v14l11-7z" />`;
      }
    };

    if (playBtn) playBtn.addEventListener('click', togglePlay);
    if (overlay) overlay.addEventListener('click', togglePlay);
    if (playControlBtn) playControlBtn.addEventListener('click', togglePlay);

    if (video) {
      video.addEventListener('timeupdate', () => {
        if (video.duration) {
          const percent = (video.currentTime / video.duration) * 100;
          if (progressBar) progressBar.style.width = `${percent}%`;

          const currentMinutes = Math.floor(video.currentTime / 60);
          const currentSeconds = Math.floor(video.currentTime % 60);
          const durationStr = video.getAttribute('data-duration') || '0:00';
          if (timeDisplay) timeDisplay.textContent = `${currentMinutes}:${currentSeconds < 10 ? '0' : ''}${currentSeconds} / ${durationStr}`;
        }
      });

      video.addEventListener('ended', () => {
        isPlaying = false;
        playBtn.style.display = 'flex';
        if (overlay) overlay.style.display = 'none';
        if (progressBar) progressBar.style.width = '0%';
        if (playIcon) playIcon.innerHTML = `<path d="M8 5v14l11-7z" />`;
      });
    }
  });

  // Enquire Buttons Scroll
  const enquireBtns = document.querySelectorAll('button');
  enquireBtns.forEach(btn => {
    if (btn.innerText.includes('Enquire Now') || btn.innerText.includes('Admission Open') || btn.innerText.includes('Enroll Today') || btn.innerText.includes('REACH OUT')) {
      btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  });
});
