document.addEventListener('DOMContentLoaded', () => {

  /* Mobile navigation */
  const burger = document.getElementById('burger');
  const mobileNav = document.getElementById('mobileNav');
  const mq = window.matchMedia('(min-width: 769px)');

  if (burger && mobileNav) {
    burger.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(isOpen));
    });

    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });

    mq.addEventListener('change', (e) => {
      if (e.matches) {
        mobileNav.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* Collection filters */
  const signFilter = document.getElementById('signFilter');
  const elementFilter = document.getElementById('elementFilter');
  const polarityFilter = document.getElementById('polarityFilter');
  const resetFilters = document.getElementById('resetFilters');
  const cards = document.querySelectorAll('.collection-card');

  function applyFilters() {
    const signValue = signFilter.value;
    const elementValue = elementFilter.value;
    const polarityValue = polarityFilter.value;

    cards.forEach(card => {
      const matchesSign = signValue === 'all' || card.dataset.sign === signValue;
      const matchesElement = elementValue === 'all' || card.dataset.element === elementValue;
      const matchesPolarity = polarityValue === 'all' || card.dataset.polarity === polarityValue;

      card.classList.toggle('hidden', !(matchesSign && matchesElement && matchesPolarity));
    });
  }

  if (signFilter && elementFilter && polarityFilter && resetFilters) {
    signFilter.addEventListener('change', applyFilters);
    elementFilter.addEventListener('change', applyFilters);
    polarityFilter.addEventListener('change', applyFilters);

    resetFilters.addEventListener('click', () => {
      signFilter.value = 'all';
      elementFilter.value = 'all';
      polarityFilter.value = 'all';
      applyFilters();
    });
  }

  /* Scroll top button */
  const scrollTopBtn = document.getElementById('scrollTopBtn');

  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      scrollTopBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
    });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* Product slider */
  const productSlides = document.querySelectorAll('.slide');
  const productSlidesContainer = document.querySelector('.slides');
  const productNext = document.querySelector('.slider-btn.next');
  const productPrev = document.querySelector('.slider-btn.prev');
  const productSlider = document.querySelector('.slider');

  if (productSlides.length && productSlidesContainer && productNext && productPrev && productSlider) {
    let currentProductSlide = 0;
    let productAutoplay;
    let productDirection = 1;
    let productStartX = 0;

    function showProductSlide(index) {
      productSlidesContainer.style.transform = `translateX(-${index * 100}%)`;
    }

  function goToNextProductSlide() {
  currentProductSlide = (currentProductSlide + 1) % productSlides.length;
  showProductSlide(currentProductSlide);
}

 function goToPrevProductSlide() {
  currentProductSlide =
    (currentProductSlide - 1 + productSlides.length) % productSlides.length;

  showProductSlide(currentProductSlide);
}

    function startProductAutoplay() {
      productAutoplay = setInterval(goToNextProductSlide, 5000);
    }

    function resetProductAutoplay() {
      clearInterval(productAutoplay);
      startProductAutoplay();
    }

    productNext.addEventListener('click', () => {
      goToNextProductSlide();
      resetProductAutoplay();
    });

    productPrev.addEventListener('click', () => {
      goToPrevProductSlide();
      resetProductAutoplay();
    });

    productSlider.addEventListener('touchstart', (e) => {
      productStartX = e.touches[0].clientX;
    });

    productSlider.addEventListener('touchend', (e) => {
      const endX = e.changedTouches[0].clientX;
      const diff = productStartX - endX;

      if (diff > 50) goToNextProductSlide();
      if (diff < -50) goToPrevProductSlide();

      if (Math.abs(diff) > 50) resetProductAutoplay();
    });

    showProductSlide(currentProductSlide);
    startProductAutoplay();
  }

  /* Lightbox */
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.querySelector('.lightbox__image');
  const lightboxClose = document.querySelector('.lightbox__close');
  const triggers = document.querySelectorAll('.lightbox-trigger');

  if (lightbox && lightboxImage && lightboxClose) {
    function openLightbox(e) {
      e.preventDefault();
      const img = e.currentTarget.querySelector('img');

      if (!img) return;

      lightboxImage.src = img.src;
      lightboxImage.alt = img.alt;
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
    }

    function closeLightbox() {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      lightboxImage.src = '';
    }

    triggers.forEach(trigger => {
      trigger.addEventListener('click', openLightbox);
    });

    lightboxClose.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLightbox();
    });
  }

  /* Reveal animation (smooth + backscroll FIX) */
  const revealElements = document.querySelectorAll(
    'main > section, .collection-card, .contact-card, .text-block, .image-block, .text-section, .slider-text, .gallery-content'
  );

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        } else {
          entry.target.classList.remove('is-visible');
        }
      });
    }, {
      threshold: 0.03,
      rootMargin: '0px 0px 8% 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('is-visible'));
  }

  /* Hero slider */
  const heroSlider = document.querySelector('.hero-slider');
  const heroSlides = document.querySelectorAll('.hero-slide');
  const heroNext = document.querySelector('.hero-arrow--next');
  const heroPrev = document.querySelector('.hero-arrow--prev');

  if (heroSlider && heroSlides.length) {
    let currentHeroSlide = 0;
    let heroInterval;
    let heroStartX = 0;

    function showHeroSlide(index) {
      heroSlides[currentHeroSlide].classList.remove('is-active');
      currentHeroSlide = (index + heroSlides.length) % heroSlides.length;
      heroSlides[currentHeroSlide].classList.add('is-active');
    }

    function nextHeroSlide() {
      showHeroSlide(currentHeroSlide + 1);
    }

    function prevHeroSlide() {
      showHeroSlide(currentHeroSlide - 1);
    }

    function startHeroAutoplay() {
      heroInterval = setInterval(nextHeroSlide, 5000);
    }

    function resetHeroAutoplay() {
      clearInterval(heroInterval);
      startHeroAutoplay();
    }

    heroNext?.addEventListener('click', () => {
      nextHeroSlide();
      resetHeroAutoplay();
    });

    heroPrev?.addEventListener('click', () => {
      prevHeroSlide();
      resetHeroAutoplay();
    });

    heroSlider.addEventListener('touchstart', (e) => {
      heroStartX = e.touches[0].clientX;
    });

    heroSlider.addEventListener('touchend', (e) => {
      const heroEndX = e.changedTouches[0].clientX;
      const diff = heroStartX - heroEndX;

      if (diff > 50) nextHeroSlide();
      if (diff < -50) prevHeroSlide();

      if (Math.abs(diff) > 50) resetHeroAutoplay();
    });

    startHeroAutoplay();
  }

});