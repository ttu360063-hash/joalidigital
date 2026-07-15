// ===================================================
// OGUSMÃO DIGITAL — Animations & Interactions Engine
// ===================================================
// Vanilla JS — zero dependências
// ===================================================

(() => {
  'use strict';

  // ── Constantes ────────────────────────────────────
  const ACCENT = '#D7FF00';
  const ACCENT_RGB = [215, 255, 0];
  const TYPEWRITER_WORDS = ['conversões.', 'resultados.', 'vendas.', 'clientes.', 'lucro.'];
  const TYPEWRITER_SPEED = 80;       // ms entre caracteres (digitando)
  const TYPEWRITER_DELETE = 50;      // ms entre caracteres (apagando)
  const TYPEWRITER_PAUSE = 2200;     // ms de pausa na palavra completa
  const TESTIMONIALS = [
    {
      text: '"A Ogusmão Digital mudou completamente a forma como nos comunicamos com nossos clientes. Em 4 meses triplicamos os leads qualificados vindos do Instagram."',
      name: 'Rafael Mendes',
      role: 'CEO',
      company: 'Vértice Imóveis',
      emoji: '🧑‍💼'
    },
    {
      text: '"Profissionalismo incrível! Nossa identidade visual ficou impecável e as redes sociais decolaram. Recomendo de olhos fechados."',
      name: 'Carla Andrade',
      role: 'Fundadora',
      company: 'StudioBelle',
      emoji: '👩‍💻'
    },
    {
      text: '"O tráfego pago gerenciado pela Ogusmão trouxe um ROI de 450% no primeiro trimestre. Resultados que falam por si."',
      name: 'Lucas Ferreira',
      role: 'Diretor Comercial',
      company: 'CT Fitness',
      emoji: '💪'
    },
    {
      text: '"Desde que começamos a trabalhar juntos, nosso faturamento online cresceu 280%. A equipe é extremamente dedicada e criativa."',
      name: 'Ana Beatriz',
      role: 'Proprietária',
      company: 'Café & Prosa',
      emoji: '☕'
    }
  ];

  // ── Utilidades ────────────────────────────────────
  function lerp(a, b, t) { return a + (b - a) * t; }

  function isTouchDevice() {
    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(hover: none) and (pointer: coarse)').matches
    );
  }

  function throttle(fn, ms) {
    let last = 0;
    return function (...args) {
      const now = Date.now();
      if (now - last >= ms) {
        last = now;
        fn.apply(this, args);
      }
    };
  }

  // ─────────────────────────────────────────────────
  // 1. CUSTOM CURSOR
  // ─────────────────────────────────────────────────
  function initCursor() {
    if (isTouchDevice()) return;

    const dot = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    if (!dot || !ring) return;

    // Remover estilos inline do export
    dot.removeAttribute('style');
    ring.removeAttribute('style');

    let mouseX = -100, mouseY = -100;
    let ringX = -100, ringY = -100;
    let isVisible = false;
    let rafId = null;

    // Rastrear posição do mouse
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) {
        isVisible = true;
        dot.classList.remove('is-hidden');
        ring.classList.remove('is-hidden');
      }
    });

    // Esconder quando sai da janela
    document.addEventListener('mouseleave', () => {
      isVisible = false;
      dot.classList.add('is-hidden');
      ring.classList.add('is-hidden');
    });

    document.addEventListener('mouseenter', () => {
      isVisible = true;
      dot.classList.remove('is-hidden');
      ring.classList.remove('is-hidden');
    });

    // Hover em elementos interativos
    const interactiveSelector = 'a, button, [role="button"], input, textarea, select, label[for]';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactiveSelector)) {
        dot.classList.add('is-hovering');
        ring.classList.add('is-hovering');
      }
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(interactiveSelector)) {
        dot.classList.remove('is-hovering');
        ring.classList.remove('is-hovering');
      }
    });

    // Feedback de clique
    document.addEventListener('mousedown', () => ring.classList.add('is-clicking'));
    document.addEventListener('mouseup', () => ring.classList.remove('is-clicking'));

    // Loop de animação com interpolação suave
    function animate() {
      ringX = lerp(ringX, mouseX, 0.12);
      ringY = lerp(ringY, mouseY, 0.12);

      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';

      rafId = requestAnimationFrame(animate);
    }

    // Iniciar escondido
    dot.classList.add('is-hidden');
    ring.classList.add('is-hidden');
    animate();

    document.body.classList.add('has-cursor');
  }

  // ─────────────────────────────────────────────────
  // 2. TYPEWRITER EFFECT
  // ─────────────────────────────────────────────────
  function initTypewriter() {
    const heroH1 = document.querySelector('#inicio h1');
    if (!heroH1) return;

    const glowSpan = heroH1.querySelector('.neon-glow');
    if (!glowSpan) return;

    // Encontrar o span com o texto da palavra
    const wordSpan = glowSpan.querySelector('span:first-child');
    // Encontrar ou criar o cursor
    let cursorSpan = glowSpan.querySelector('span:last-child');
    if (!wordSpan) return;

    // Substituir classe de pulse pelo blink do CSS
    if (cursorSpan) {
      cursorSpan.className = 'typewriter-cursor';
      cursorSpan.textContent = '|';
    }

    let wordIndex = 0;
    let charIndex = TYPEWRITER_WORDS[0].length;
    let isDeleting = false;
    let timeout = null;

    function tick() {
      const currentWord = TYPEWRITER_WORDS[wordIndex];

      if (isDeleting) {
        charIndex--;
        wordSpan.textContent = currentWord.substring(0, charIndex);

        if (charIndex === 0) {
          isDeleting = false;
          wordIndex = (wordIndex + 1) % TYPEWRITER_WORDS.length;
          timeout = setTimeout(tick, 350);
          return;
        }
        timeout = setTimeout(tick, TYPEWRITER_DELETE);
      } else {
        charIndex++;
        wordSpan.textContent = currentWord.substring(0, charIndex);

        if (charIndex === currentWord.length) {
          isDeleting = true;
          timeout = setTimeout(tick, TYPEWRITER_PAUSE);
          return;
        }
        timeout = setTimeout(tick, TYPEWRITER_SPEED);
      }
    }

    // Iniciar após breve pausa
    setTimeout(() => {
      isDeleting = true;
      tick();
    }, TYPEWRITER_PAUSE);
  }

  // ─────────────────────────────────────────────────
  // 3. SCROLL REVEAL (IntersectionObserver)
  // ─────────────────────────────────────────────────
  function initScrollReveal() {
    // Coletar todos os elementos que devem ser animados
    const revealTargets = [];

    // Títulos de seção e labels
    document.querySelectorAll('.section-label, section h2').forEach(el => {
      if (!el.closest('#inicio')) {
        revealTargets.push({ el, type: 'reveal-up', delay: 0 });
      }
    });

    // Cards de serviço (staggered)
    document.querySelectorAll('#servicos .grid > div').forEach((el, i) => {
      revealTargets.push({ el, type: 'reveal-up', delay: i * 80 });
    });

    // Itens de portfólio (staggered)
    document.querySelectorAll('#portfolio .break-inside-avoid').forEach((el, i) => {
      revealTargets.push({ el, type: 'reveal-scale', delay: i * 60 });
    });

    // Filtros de portfólio
    const filterWrap = document.querySelector('#portfolio .flex.flex-wrap.gap-2.mb-10');
    if (filterWrap) {
      revealTargets.push({ el: filterWrap, type: 'reveal-up', delay: 0 });
    }

    // Botão "Ver todos os projetos"
    document.querySelectorAll('#portfolio .btn-outline').forEach(el => {
      revealTargets.push({ el, type: 'reveal-fade', delay: 200 });
    });

    // "Como Funciona" — desktop steps (staggered)
    document.querySelectorAll('#sobre .hidden.lg\\:block .flex-1').forEach((el, i) => {
      revealTargets.push({ el, type: 'reveal-up', delay: i * 120 });
    });

    // "Como Funciona" — mobile steps
    document.querySelectorAll('#sobre .lg\\:hidden > .flex.gap-6').forEach((el, i) => {
      revealTargets.push({ el, type: 'reveal-left', delay: i * 100 });
    });

    // Timeline line (desktop)
    const timelineLine = document.querySelector('#sobre .hidden.lg\\:block .absolute.top-8');
    if (timelineLine) {
      revealTargets.push({ el: timelineLine, type: 'reveal-fade', delay: 0 });
    }

    // Depoimentos header
    const depoHeader = document.querySelector('#depoimentos .text-center.mb-16');
    if (depoHeader) {
      revealTargets.push({ el: depoHeader, type: 'reveal-up', delay: 0 });
    }

    // CTA section content
    const ctaContent = document.querySelector('#contato > div > div');
    if (ctaContent) {
      revealTargets.push({ el: ctaContent, type: 'reveal-up', delay: 0 });
    }

    // Clientes (marquee header text)
    const clientesText = document.querySelector('section.py-16 .text-center p');
    if (clientesText) {
      revealTargets.push({ el: clientesText, type: 'reveal-fade', delay: 0 });
    }

    // Preparar elementos: remover estilos inline e adicionar classes
    revealTargets.forEach(({ el, type, delay }) => {
      // Limpar estilos inline conflitantes do export estático
      el.style.removeProperty('opacity');
      el.style.removeProperty('transform');
      // Adicionar classes de reveal
      el.classList.add('reveal', type);
      if (delay > 0) {
        el.style.transitionDelay = delay + 'ms';
      }
    });

    // Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealTargets.forEach(({ el }) => observer.observe(el));
  }

  // ─────────────────────────────────────────────────
  // 4. HERO PARALLAX (Mouse-based)
  // ─────────────────────────────────────────────────
  function initHeroParallax() {
    if (isTouchDevice()) return;

    const hero = document.querySelector('#inicio');
    if (!hero) return;

    // Encontrar os cards flutuantes no hero
    // Seletores baseados na estrutura do HTML
    const cardsContainer = hero.querySelector('.relative.hidden.lg\\:flex');
    if (!cardsContainer) return;

    const innerContainer = cardsContainer.querySelector('.relative.w-\\[480px\\]');
    if (!innerContainer) return;

    // Pegar todos os filhos posicionados absolutamente (os cards)
    const cards = innerContainer.querySelectorAll(':scope > div[class*="absolute"]');
    if (!cards.length) return;

    // Definir velocidades de parallax diferentes para cada card (profundidade)
    const speeds = [0.02, 0.035, 0.03, 0.045, 0.025];

    let mouseX = 0, mouseY = 0;
    let currentX = 0, currentY = 0;
    let rafId = null;

    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      // Posição normalizada de -1 a 1 relativa ao centro do hero
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    });

    function animate() {
      currentX = lerp(currentX, mouseX, 0.06);
      currentY = lerp(currentY, mouseY, 0.06);

      cards.forEach((card, i) => {
        const speed = speeds[i % speeds.length];
        const x = currentX * speed * 100;
        const y = currentY * speed * 100;
        // Preservar rotações existentes adicionando translate
        card.style.transform = `translate(${x}px, ${y}px)`;
      });

      rafId = requestAnimationFrame(animate);
    }

    animate();

    // Parar quando hero sai da viewport
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting && rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        } else if (entry.isIntersecting && !rafId) {
          animate();
        }
      });
    }, { threshold: 0 });

    heroObserver.observe(hero);
  }

  // ─────────────────────────────────────────────────
  // 5. PARTICLE CANVAS (Hero background)
  // ─────────────────────────────────────────────────
  function initParticles() {
    const hero = document.querySelector('#inicio');
    if (!hero) return;

    const canvas = hero.querySelector('canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles = [];
    let animationId = null;
    let width, height;

    const PARTICLE_COUNT = isTouchDevice() ? 30 : 55;
    const MAX_DISTANCE = 130;
    const PARTICLE_SPEED = 0.35;

    function resize() {
      width = hero.offsetWidth;
      height = hero.offsetHeight;
      canvas.width = width * (window.devicePixelRatio || 1);
      canvas.height = height * (window.devicePixelRatio || 1);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    }

    function createParticle() {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * PARTICLE_SPEED,
        vy: (Math.random() - 0.5) * PARTICLE_SPEED,
        radius: Math.random() * 1.8 + 0.5,
        opacity: Math.random() * 0.4 + 0.1
      };
    }

    function initParticleArray() {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(createParticle());
      }
    }

    function drawParticles() {
      ctx.clearRect(0, 0, width, height);

      // Atualizar posições
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around nas bordas
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
      });

      // Desenhar linhas entre partículas próximas
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < MAX_DISTANCE) {
            const alpha = (1 - dist / MAX_DISTANCE) * 0.12;
            ctx.strokeStyle = `rgba(${ACCENT_RGB[0]}, ${ACCENT_RGB[1]}, ${ACCENT_RGB[2]}, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Desenhar partículas (pontos)
      particles.forEach(p => {
        ctx.fillStyle = `rgba(${ACCENT_RGB[0]}, ${ACCENT_RGB[1]}, ${ACCENT_RGB[2]}, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationId = requestAnimationFrame(drawParticles);
    }

    // Inicializar
    resize();
    initParticleArray();
    drawParticles();

    // Responsive
    window.addEventListener('resize', throttle(() => {
      resize();
      initParticleArray();
    }, 250));

    // Parar quando fora da viewport
    const canvasObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting && animationId) {
          cancelAnimationFrame(animationId);
          animationId = null;
        } else if (entry.isIntersecting && !animationId) {
          drawParticles();
        }
      });
    }, { threshold: 0 });

    canvasObserver.observe(hero);
  }

  // ─────────────────────────────────────────────────
  // 6. STATS COUNTER ANIMATION
  // ─────────────────────────────────────────────────
  function initStatsCounter() {
    const heroSection = document.querySelector('#inicio');
    const darkStatsSection = document.querySelector('section.py-20.bg-\\[\\#1A1A1A\\]');
    
    let statElements = [];

    // 1. Números do Hero
    if (heroSection) {
      statElements.push(
        heroSection.querySelector('[data-admin="stat-empresas"]'),
        heroSection.querySelector('[data-admin="stat-satisfacao"]'),
        ...Array.from(heroSection.querySelectorAll('.text-\\[\\#D7FF00\\]')).filter(el => el.textContent.includes('+300%'))
      );
    }

    // 2. Números da seção escura (4 blocos)
    if (darkStatsSection) {
      statElements.push(
        ...darkStatsSection.querySelectorAll('.font-black.text-\\[\\#D7FF00\\]')
      );
    }

    statElements = statElements.filter(Boolean);

    if (!statElements.length) return;

    // Parsear os valores originais
    const stats = [];
    statElements.forEach(el => {
      const originalText = el.textContent.trim();
      // Extrair número e sufixo/prefixo
      // Regex para capturar tudo antes, os dígitos, e tudo depois
      const match = originalText.match(/^([^\d]*)(\d+)(.*)$/);
      if (match) {
        stats.push({
          el,
          prefix: match[1],
          target: parseInt(match[2], 10),
          suffix: match[3],
          originalText,
          counted: false
        });
        // Iniciar em 0
        el.textContent = match[1] + '0' + match[3];
      }
    });

    function animateCount(stat) {
      if (stat.counted) return;
      stat.counted = true;

      const duration = 2000;
      const start = performance.now();

      function easeOutExpo(t) {
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      }

      function step(timestamp) {
        const elapsed = timestamp - start;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutExpo(progress);
        const current = Math.round(stat.target * easedProgress);

        stat.el.textContent = stat.prefix + current + stat.suffix;

        if (progress < 1) {
          requestAnimationFrame(step);
        }
      }

      requestAnimationFrame(step);
    }

    // Observer para triggerar quando visível
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Animar apenas os stats que estão DENTRO desta seção específica
            const sectionStats = stats.filter(stat => entry.target.contains(stat.el));
            
            sectionStats.forEach((stat, i) => {
              setTimeout(() => animateCount(stat), i * 200);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (heroSection) observer.observe(heroSection);
    if (darkStatsSection) observer.observe(darkStatsSection);
  }

  // ─────────────────────────────────────────────────
  // 7. TESTIMONIALS CAROUSEL
  // ─────────────────────────────────────────────────
  function initTestimonials() {
    const section = document.querySelector('#depoimentos');
    if (!section) return;

    const contentWrapper = section.querySelector('.relative.min-h-\\[280px\\]');
    if (!contentWrapper) return;

    // Encontrar os botões de navegação
    const prevBtn = section.querySelector('button[aria-label*="anterior"]');
    const nextBtn = section.querySelector('button[aria-label*="róximo"]') ||
                    section.querySelector('button[aria-label*="Próximo"]');
    const dots = section.querySelectorAll('button[aria-label*="depoimento"]');

    let currentIndex = 0;
    let autoPlayInterval = null;
    let isAnimating = false;

    function renderTestimonial(index, direction = 'next') {
      if (isAnimating) return;
      isAnimating = true;

      const testimonial = TESTIMONIALS[index];
      const slide = contentWrapper.querySelector('.w-full');
      if (!slide) {
        isAnimating = false;
        return;
      }

      // Animar saída
      slide.classList.add('exiting');
      slide.classList.add('testimonial-slide');

      setTimeout(() => {
        // Atualizar conteúdo
        const textEl = slide.querySelector('p');
        const nameEl = slide.querySelector('.text-white.font-bold');
        const roleEl = slide.querySelector('.text-white\\/40');
        const emojiEl = slide.querySelector('.w-12.h-12');

        if (textEl) textEl.textContent = testimonial.text;
        if (nameEl) nameEl.textContent = testimonial.name;
        if (roleEl) roleEl.innerHTML = `${testimonial.role} · <span class="text-[#D7FF00]">${testimonial.company}</span>`;
        if (emojiEl) emojiEl.textContent = testimonial.emoji;

        // Animar entrada
        slide.classList.remove('exiting');
        slide.classList.add('entering');

        setTimeout(() => {
          slide.classList.remove('entering', 'testimonial-slide');
          isAnimating = false;
        }, 550);
      }, 350);

      // Atualizar dots
      updateDots(index);
      currentIndex = index;
    }

    function updateDots(activeIndex) {
      dots.forEach((dot, i) => {
        if (i === activeIndex) {
          dot.className = dot.className
            .replace('w-1.5', 'w-8')
            .replace('bg-white/20', 'bg-[#D7FF00]');
          if (!dot.className.includes('w-8')) {
            dot.classList.remove('w-1.5');
            dot.classList.add('w-8');
          }
          dot.style.width = '32px';
          dot.style.background = ACCENT;
        } else {
          dot.style.width = '6px';
          dot.style.background = 'rgba(255,255,255,0.2)';
        }
      });
    }

    function goNext() {
      const next = (currentIndex + 1) % TESTIMONIALS.length;
      renderTestimonial(next, 'next');
    }

    function goPrev() {
      const prev = (currentIndex - 1 + TESTIMONIALS.length) % TESTIMONIALS.length;
      renderTestimonial(prev, 'prev');
    }

    function startAutoPlay() {
      stopAutoPlay();
      autoPlayInterval = setInterval(goNext, 5500);
    }

    function stopAutoPlay() {
      if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
      }
    }

    // Event listeners
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        goNext();
        startAutoPlay(); // Reset autoplay timer
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        goPrev();
        startAutoPlay();
      });
    }

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        if (i !== currentIndex) {
          renderTestimonial(i);
          startAutoPlay();
        }
      });
    });

    // Pausar autoplay no hover
    section.addEventListener('mouseenter', stopAutoPlay);
    section.addEventListener('mouseleave', startAutoPlay);

    // Inicializar
    updateDots(0);
    startAutoPlay();
  }

  // ─────────────────────────────────────────────────
  // 8. HEADER SCROLL STATE & ACTIVE NAV
  // ─────────────────────────────────────────────────
  function initHeaderScroll() {
    const header = document.querySelector('header');
    if (!header) return;

    const navButtons = header.querySelectorAll('nav button');
    const sections = ['inicio', 'servicos', 'portfolio', 'sobre', 'depoimentos', 'contato'];
    const sectionElements = sections.map(id => document.getElementById(id)).filter(Boolean);

    let ticking = false;

    function onScroll() {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const scrollY = window.scrollY;

        // Header background
        if (scrollY > 60) {
          header.classList.add('is-scrolled');
        } else {
          header.classList.remove('is-scrolled');
        }

        // Active nav item
        let activeIndex = 0;
        sectionElements.forEach((section, i) => {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 150) {
            activeIndex = i;
          }
        });

        navButtons.forEach((btn, i) => {
          if (i === activeIndex) {
            btn.className = btn.className
              .replace('text-white/70', 'text-[#D7FF00]')
              .replace('hover:text-white', '');
            // Mostrar indicador
            const indicator = btn.querySelector('span');
            if (indicator) indicator.style.width = '100%';
          } else {
            if (!btn.className.includes('text-white/70')) {
              btn.className = btn.className
                .replace('text-[#D7FF00]', 'text-white/70');
              if (!btn.className.includes('hover:text-white')) {
                btn.className += ' hover:text-white';
              }
            }
            const indicator = btn.querySelector('span');
            if (indicator) indicator.style.width = '';
          }
        });

        ticking = false;
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // Initial check
  }

  // ─────────────────────────────────────────────────
  // 9. SMOOTH SCROLL NAVIGATION
  // ─────────────────────────────────────────────────
  function initSmoothScroll() {
    const header = document.querySelector('header');
    const headerHeight = header ? header.offsetHeight : 80;

    // Desktop nav buttons
    const navButtons = document.querySelectorAll('header nav button');
    const sectionIds = ['inicio', 'servicos', 'portfolio', 'sobre', 'depoimentos', 'contato'];

    navButtons.forEach((btn, i) => {
      btn.addEventListener('click', () => {
        const target = document.getElementById(sectionIds[i]);
        if (target) {
          const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });

    // Links com href="#xxx"
    document.querySelectorAll('a[href*="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        const hashIndex = href.indexOf('#');
        if (hashIndex === -1) return;

        const targetId = href.substring(hashIndex + 1);
        const target = document.getElementById(targetId);
        if (target) {
          e.preventDefault();
          const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;
          window.scrollTo({ top, behavior: 'smooth' });

          // Fechar mobile menu se aberto
          const mobileMenu = document.querySelector('.mobile-menu-overlay');
          if (mobileMenu) mobileMenu.classList.remove('is-open');
        }
      });
    });
  }

  // ─────────────────────────────────────────────────
  // 10. MOBILE MENU
  // ─────────────────────────────────────────────────
  function initMobileMenu() {
    const menuToggle = document.querySelector('header button.lg\\:hidden');
    if (!menuToggle) return;

    // Criar overlay do menu mobile
    const overlay = document.createElement('div');
    overlay.className = 'mobile-menu-overlay';

    // Botão de fechar
    const closeBtn = document.createElement('button');
    closeBtn.className = 'mobile-menu-close';
    closeBtn.innerHTML = '✕';
    closeBtn.setAttribute('aria-label', 'Fechar menu');
    overlay.appendChild(closeBtn);

    // Links do menu
    const menuItems = [
      { label: 'Início', target: '#inicio' },
      { label: 'Serviços', target: '#servicos' },
      { label: 'Portfólio', target: '#portfolio' },
      { label: 'Sobre', target: '#sobre' },
      { label: 'Depoimentos', target: '#depoimentos' },
      { label: 'Contato', target: '#contato' }
    ];

    menuItems.forEach(item => {
      const link = document.createElement('a');
      link.href = item.target;
      link.className = 'menu-item';
      link.textContent = item.label;
      overlay.appendChild(link);
    });

    // Botão CTA no menu mobile
    const ctaLink = document.createElement('a');
    ctaLink.href = '#contato';
    ctaLink.className = 'menu-item btn-primary';
    ctaLink.style.fontSize = '16px';
    ctaLink.style.marginTop = '16px';
    ctaLink.textContent = 'Solicitar orçamento →';
    overlay.appendChild(ctaLink);

    document.body.appendChild(overlay);

    // Toggle
    menuToggle.addEventListener('click', () => {
      overlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    });

    function closeMenu() {
      overlay.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    closeBtn.addEventListener('click', closeMenu);

    // Fechar ao clicar em um link
    overlay.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });

    // Fechar com Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
  }

  // ─────────────────────────────────────────────────
  // 11. PORTFOLIO FILTERS
  // ─────────────────────────────────────────────────
  function initPortfolioFilters() {
    const section = document.querySelector('#portfolio');
    if (!section) return;

    const filterButtons = section.querySelectorAll('.flex.flex-wrap.gap-2.mb-10 button');
    const portfolioItems = section.querySelectorAll('.break-inside-avoid');
    if (!filterButtons.length || !portfolioItems.length) return;

    // Mapear filtros
    const filterMap = {
      'Todos': null,
      'Social Media': 'Social Media',
      'Tráfego Pago': 'Tráfego Pago',
      'Identidade Visual': 'Identidade Visual',
      'Sites': 'Sites',
      'Vídeos': 'Vídeos'
    };

    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const filterName = btn.textContent.trim();
        const filterValue = filterMap[filterName];

        // Atualizar estilo dos botões
        filterButtons.forEach(b => {
          b.style.background = 'rgba(255,255,255,0.05)';
          b.style.color = 'rgba(255,255,255,0.6)';
        });
        btn.style.background = ACCENT;
        btn.style.color = '#0D0D0D';

        // Filtrar items
        portfolioItems.forEach(item => {
          const category = item.querySelector('.text-\\[10px\\]');
          const categoryText = category ? category.textContent.trim() : '';

          if (!filterValue || categoryText === filterValue) {
            item.classList.remove('is-hidden');
            item.classList.add('is-visible', 'portfolio-item');
          } else {
            item.classList.add('is-hidden', 'portfolio-item');
            item.classList.remove('is-visible');
          }
        });
      });
    });
  }

  // ─────────────────────────────────────────────────
  // 12. SERVICE CARDS TILT EFFECT
  // ─────────────────────────────────────────────────
  function initServiceCardEffects() {
    if (isTouchDevice()) return;

    const cards = document.querySelectorAll('#servicos .grid > div');
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -3;
        const rotateY = ((x - centerX) / centerX) * 3;

        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;

        // Efeito de glow que segue o cursor
        const glowEl = card.querySelector('[class*="box-shadow"]') || card.querySelector('.absolute.inset-0.opacity-0');
        if (glowEl) {
          glowEl.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(215,255,0,0.08), transparent 60%)`;
          glowEl.style.opacity = '1';
        }
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        const glowEl = card.querySelector('[class*="box-shadow"]') || card.querySelector('.absolute.inset-0.opacity-0');
        if (glowEl) {
          glowEl.style.opacity = '0';
          glowEl.style.background = '';
        }
      });
    });
  }

  // ─────────────────────────────────────────────────
  // 13. SCROLL PROGRESS INDICATOR
  // ─────────────────────────────────────────────────
  function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      height: 2px;
      background: linear-gradient(90deg, #D7FF00, rgba(215,255,0,0.6));
      z-index: 9999;
      transform-origin: left;
      transform: scaleX(0);
      transition: none;
      pointer-events: none;
      width: 100%;
      box-shadow: 0 0 8px rgba(215,255,0,0.4);
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;
      progressBar.style.transform = `scaleX(${progress})`;
    }, { passive: true });
  }

  // ─────────────────────────────────────────────────
  // 14. HERO ENTRANCE ANIMATION (Page Load)
  // ─────────────────────────────────────────────────
  function initHeroEntrance() {
    const hero = document.querySelector('#inicio');
    if (!hero) return;

    // Selecionar os elementos principais do hero para animar na entrada
    const heroContent = hero.querySelector('.relative.z-10');
    if (!heroContent) return;

    const leftCol = heroContent.querySelector('.grid > div:first-child');
    if (!leftCol) return;

    // Elementos a animar
    const elements = leftCol.querySelectorAll(':scope > *');
    elements.forEach((el, i) => {
      // Remover estilos inline do export
      el.style.removeProperty('opacity');
      el.style.removeProperty('transform');
      el.classList.add('hero-animate');
      el.style.animationDelay = `${0.15 + i * 0.15}s`;
    });

    // Cards do lado direito
    const rightCol = heroContent.querySelector('.relative.hidden.lg\\:flex');
    if (rightCol) {
      rightCol.style.removeProperty('opacity');
      rightCol.style.removeProperty('transform');
      rightCol.classList.add('hero-animate');
      rightCol.style.animationDelay = '0.5s';
    }

    // Scroll indicator
    const scrollIndicator = hero.querySelector('.absolute.bottom-8');
    if (scrollIndicator) {
      scrollIndicator.style.removeProperty('opacity');
      scrollIndicator.classList.add('hero-animate');
      scrollIndicator.style.animationDelay = '1s';
    }
  }

  // ─────────────────────────────────────────────────
  // INICIALIZAÇÃO
  // ─────────────────────────────────────────────────
  function init() {
    // Ordem importa: cursor primeiro, depois animações visuais
    initCursor();
    initHeroEntrance();
    initTypewriter();
    initParticles();
    initHeroParallax();
    initScrollReveal();
    initStatsCounter();
    initTestimonials();
    initHeaderScroll();
    initSmoothScroll();
    initMobileMenu();
    initPortfolioFilters();
    initServiceCardEffects();
    initScrollProgress();

    // Log de inicialização
    console.log(
      '%c⚡ Ogusmão Digital %c— Animations loaded',
      'color: #D7FF00; font-weight: bold; font-size: 14px; background: #0D0D0D; padding: 4px 8px; border-radius: 4px;',
      'color: #888; font-size: 12px;'
    );
  }

  // Aguardar DOM pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
