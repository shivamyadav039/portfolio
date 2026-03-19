/**
 * ============================================================
 *  SECTION PAGE OVERLAY SYSTEM
 *  Immersive full-screen section pages with floating particles
 * ============================================================
 */

(function () {
  'use strict';

  // ═══════════════════════════════════════════════════════
  //  SECTION DEFINITIONS
  // ═══════════════════════════════════════════════════════
  const SECTIONS = [
    {
      id: 'about',
      label: 'About Me',
      subtitle: '// who i am',
      accent: '#60a5fa',
      icons: ['🧠', '🎓', '💡', '🔬', '⚡', '🌐', '📐', '🤖'],
      build: buildAboutContent,
    },
    {
      id: 'projects',
      label: 'Projects',
      subtitle: '// what i built',
      accent: '#c084fc',
      icons: ['🚀', '⚙️', '🔗', '📊', '🧬', '💻', '🔐', '🛸'],
      build: buildProjectsContent,
    },
    {
      id: 'skills',
      label: 'Technical Skills',
      subtitle: '// my toolkit',
      accent: '#34d399',
      icons: ['⚡', '🐍', '🧮', '🔧', '📦', '🌿', '💾', '🖥️'],
      build: buildSkillsContent,
    },
    {
      id: 'experience',
      label: 'Journey',
      subtitle: "// where i've been",
      accent: '#fbbf24',
      icons: ['📅', '🏆', '🌟', '📜', '🎯', '🧭', '💼', '🔑'],
      build: buildExperienceContent,
    },
    {
      id: 'contact',
      label: 'Get In Touch',
      subtitle: '// let\'s connect',
      accent: '#22d3ee',
      icons: ['✉️', '💬', '📡', '🤝', '🔔', '🌍', '📱', '💌'],
      build: buildContactContent,
    },
  ];

  // ═══════════════════════════════════════════════════════
  //  FLOATING PARTICLE ENGINE
  // ═══════════════════════════════════════════════════════
  function createParticleCanvas(container, accentColor) {
    const canvas = document.createElement('canvas');
    canvas.className = 'section-overlay-canvas';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let w, h, particles = [], animId;
    const COUNT = 80;

    function resize() {
      w = canvas.width = container.offsetWidth;
      h = canvas.height = container.offsetHeight;
    }

    function hexToRgb(hex) {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `${r},${g},${b}`;
    }

    function randomParticle() {
      const isAccent = Math.random() < 0.22;
      const size = Math.random() * 3.5 + 0.5;
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size,
        opacity: Math.random() * 0.6 + 0.1,
        maxOpacity: Math.random() * 0.6 + 0.2,
        color: isAccent ? hexToRgb(accentColor) : '200,220,255',
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.03,
        connected: [],
      };
    }

    function init() {
      resize();
      particles = Array.from({ length: COUNT }, randomParticle);
    }

    function drawConnections() {
      const MAX_DIST = 130;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * 0.15;
            ctx.strokeStyle = `rgba(${particles[i].color},${alpha})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    }

    function tick() {
      ctx.clearRect(0, 0, w, h);
      drawConnections();

      particles.forEach(p => {
        p.pulse += p.pulseSpeed;
        const opacityFactor = 0.5 + 0.5 * Math.sin(p.pulse);
        const currentOpacity = p.opacity * opacityFactor;

        // Glow
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
        gradient.addColorStop(0, `rgba(${p.color},${currentOpacity})`);
        gradient.addColorStop(1, `rgba(${p.color},0)`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fill();

        // Core dot
        ctx.fillStyle = `rgba(${p.color},${Math.min(currentOpacity * 2, 1)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Move
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
      });

      animId = requestAnimationFrame(tick);
    }

    const obs = new ResizeObserver(resize);
    obs.observe(container);

    return {
      start() { init(); tick(); },
      stop() { cancelAnimationFrame(animId); obs.disconnect(); canvas.remove(); },
    };
  }

  // ═══════════════════════════════════════════════════════
  //  FLOATING EMOJI / ICON ELEMENTS
  // ═══════════════════════════════════════════════════════
  const ANIMATIONS = [
    'floatOrbit1 12s ease-in-out infinite',
    'floatOrbit2 16s ease-in-out infinite',
    'floatOrbit3 10s ease-in-out infinite',
    'floatDrift 8s ease-in-out infinite',
    'floatBounce 7s ease-in-out infinite',
    'pulsateGlow 5s ease-in-out infinite',
  ];

  function createFloatingIcons(container, icons) {
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'position:absolute;inset:0;z-index:2;pointer-events:none;overflow:hidden;';
    container.appendChild(wrapper);

    icons.forEach((icon, i) => {
      const el = document.createElement('div');
      el.className = 'floating-icon';
      el.textContent = icon;
      el.style.cssText = `
        left: ${10 + Math.random() * 80}%;
        top: ${10 + Math.random() * 80}%;
        font-size: ${1.5 + Math.random() * 3}rem;
        opacity: 0;
        animation: ${ANIMATIONS[i % ANIMATIONS.length]};
        animation-delay: ${Math.random() * 4}s;
        transition: opacity 0.8s ease ${0.3 + i * 0.08}s;
      `;
      wrapper.appendChild(el);
    });

    return wrapper;
  }

  // ═══════════════════════════════════════════════════════
  //  ORB BLOBS
  // ═══════════════════════════════════════════════════════
  function createOrbs(bgEl, accentColor) {
    const orbs = [
      { w: 400, h: 400, x: '-10%', y: '-10%', color: accentColor, delay: '0s' },
      { w: 300, h: 300, x: '70%', y: '60%', color: accentColor, delay: '3s' },
      { w: 200, h: 200, x: '50%', y: '20%', color: '#ffffff', delay: '6s' },
    ];
    orbs.forEach(o => {
      const div = document.createElement('div');
      div.className = 'overlay-orb';
      div.style.cssText = `
        width:${o.w}px; height:${o.h}px;
        left:${o.x}; top:${o.y};
        background:${o.color};
        animation-delay:${o.delay};
      `;
      bgEl.appendChild(div);
    });
  }

  // ═══════════════════════════════════════════════════════
  //  OVERLAY BUILDER
  // ═══════════════════════════════════════════════════════
  function buildOverlay(section) {
    const overlay = document.createElement('div');
    overlay.className = 'section-overlay';
    overlay.setAttribute('data-section', section.id);
    overlay.id = `overlay-${section.id}`;

    // Background
    const bg = document.createElement('div');
    bg.className = 'section-overlay-bg';
    createOrbs(bg, section.accent);
    overlay.appendChild(bg);

    // Grid
    const grid = document.createElement('div');
    grid.className = 'overlay-grid';
    overlay.appendChild(grid);

    // Particle canvas
    const particleEngine = createParticleCanvas(overlay, section.accent);

    // Floating icons
    const iconsWrapper = createFloatingIcons(overlay, section.icons);

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'overlay-close-btn';
    closeBtn.setAttribute('aria-label', 'Close section');
    closeBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
    overlay.appendChild(closeBtn);

    // Content panel
    const panel = document.createElement('div');
    panel.className = 'overlay-content-panel';

    // Header
    const header = document.createElement('div');
    header.className = 'overlay-section-content';
    header.innerHTML = `
      <p class="overlay-page-subtitle overlay-accent">${section.subtitle}</p>
      <h2 class="overlay-page-title">${section.label}</h2>
    `;
    panel.appendChild(header);

    // Section-specific content
    section.build(panel, section);

    overlay.appendChild(panel);
    document.body.appendChild(overlay);

    // State
    let engine = null;

    function open() {
      overlay.classList.remove('closing');
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
      if (!engine) {
        engine = particleEngine;
        engine.start();
      }
      // Activate floating icons
      overlay.querySelectorAll('.floating-icon').forEach(el => {
        el.style.opacity = '1';
      });
    }

    function close() {
      overlay.classList.add('closing');
      overlay.classList.remove('open');
      overlay.querySelectorAll('.floating-icon').forEach(el => {
        el.style.opacity = '0';
      });
      setTimeout(() => {
        overlay.classList.remove('closing');
        document.body.style.overflow = '';
      }, 600);
      // Reset skill bars for re-animation next open
      overlay.querySelectorAll('.skill-pill-fill').forEach(bar => {
        bar.style.width = '0%';
      });
    }

    closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });

    // ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('open')) close();
    });

    // Animate skill bars on open
    overlay.addEventListener('transitionend', () => {
      if (overlay.classList.contains('open')) {
        overlay.querySelectorAll('.skill-pill-fill').forEach(bar => {
          bar.style.width = bar.dataset.width || '80%';
        });
      }
    }, { once: false });

    return { overlay, open, close };
  }

  // ═══════════════════════════════════════════════════════
  //  SECTION CONTENT BUILDERS
  // ═══════════════════════════════════════════════════════

  function buildAboutContent(panel) {
    const content = document.createElement('div');
    content.className = 'overlay-section-content max-w-4xl mx-auto w-full';
    content.innerHTML = `
      <div class="grid md:grid-cols-2 gap-6">
        <div class="overlay-card">
          <div class="flex items-center gap-3 mb-4">
            <div style="width:2.5rem;height:2.5rem;border-radius:50%;background:rgba(96,165,250,0.15);display:flex;align-items:center;justify-content:center;">
              <svg width="18" height="18" fill="none" stroke="#60a5fa" stroke-width="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <h3 style="font-size:1.1rem;font-weight:600;color:#fff;">Who I Am</h3>
          </div>
          <p style="color:rgba(255,255,255,0.65);font-size:0.9rem;line-height:1.8;">
            I am an AI & Machine Learning student at LPU and a Data Analyst at Deccan AI, specializing in fine-tuning and training large language models. I chose this field because of its potential to solve complex real-world problems through mathematical reasoning and automated intelligence. My career goal is to design robust, ethical AI systems that empower businesses and individuals globally.
          </p>
        </div>
        <div class="overlay-card">
          <div class="flex items-center gap-3 mb-4">
            <div style="width:2.5rem;height:2.5rem;border-radius:50%;background:rgba(96,165,250,0.15);display:flex;align-items:center;justify-content:center;">
              <svg width="18" height="18" fill="none" stroke="#60a5fa" stroke-width="2" viewBox="0 0 24 24"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
            </div>
            <h3 style="font-size:1.1rem;font-weight:600;color:#fff;">Education</h3>
          </div>
          <p style="color:rgba(255,255,255,0.65);font-size:0.9rem;line-height:1.8;">
            Pursuing <span style="color:#fff;font-weight:600;">B.Tech CSE (AI &amp; ML)</span> at
            <span style="color:#60a5fa;font-weight:500;">Lovely Professional University, Punjab</span>.
            Expected graduation: 2027.
          </p>
          <div style="margin-top:1rem;padding-top:1rem;border-top:1px solid rgba(255,255,255,0.07);">
            <p style="font-size:0.75rem;color:rgba(255,255,255,0.35);letter-spacing:0.08em;text-transform:uppercase;">Year</p>
            <p style="color:#fff;font-weight:600;font-size:1rem;">2023 – 2027</p>
          </div>
        </div>
        <div class="overlay-card">
          <div class="flex items-center gap-3 mb-4">
            <div style="width:2.5rem;height:2.5rem;border-radius:50%;background:rgba(96,165,250,0.15);display:flex;align-items:center;justify-content:center;">
              <svg width="18" height="18" fill="none" stroke="#60a5fa" stroke-width="2" viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 6v6l4 2"/></svg>
            </div>
            <h3 style="font-size:1.1rem;font-weight:600;color:#fff;">Outlier.ai</h3>
          </div>
          <p style="color:rgba(96,165,250,0.8);font-size:0.8rem;margin-bottom:0.75rem;">Math Trainee · Nov 2024 – Present</p>
          <ul style="color:rgba(255,255,255,0.65);font-size:0.85rem;line-height:1.7;list-style-type:none;padding:0;">
            <li>→ Designing &amp; solving advanced math tasks for LLM training.</li>
            <li>→ Focus on algebra, probability, and logic.</li>
          </ul>
        </div>
        <div class="overlay-card">
          <div class="flex items-center gap-3 mb-4">
            <div style="width:2.5rem;height:2.5rem;border-radius:50%;background:rgba(52,211,153,0.15);display:flex;align-items:center;justify-content:center;">
              <svg width="18" height="18" fill="none" stroke="#34d399" stroke-width="2" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
            </div>
            <h3 style="font-size:1.1rem;font-weight:600;color:#fff;">Deccan AI</h3>
          </div>
          <p style="color:rgba(52,211,153,0.8);font-size:0.8rem;margin-bottom:0.75rem;">Data Analyst · March 2026 – Present</p>
          <ul style="color:rgba(255,255,255,0.65);font-size:0.85rem;line-height:1.7;list-style-type:none;padding:0;">
            <li>→ Analyzing data for LLM training methodologies.</li>
            <li>→ Improving model accuracy and performance.</li>
          </ul>
        </div>
      </div>
    `;
    panel.appendChild(content);
  }

  function buildProjectsContent(panel) {
    const projects = [
      {
        title: 'Fake News Detection (BERT)',
        badge: 'NLP',
        badgeColor: '#c084fc',
        desc: 'Robust pipeline to classify news as real or fake using transformers, achieving ~92% validation accuracy.',
        tags: ['Python', 'PyTorch', 'BERT', 'Hugging Face'],
        icon: '🧠',
        image: 'assets/fake-news-premium.jpg',
        github: 'https://github.com/shivamyadav039/FakeNewsDetection',
        live: 'https://fakenewsdetection-1-zimg.onrender.com/'
      },
      {
        title: 'School ERP Management System',
        badge: 'Full-Stack',
        badgeColor: '#34d399',
        desc: 'Web-based ERP for schools handling students, staff, fees, attendance, and analytics with role-based authentication.',
        tags: ['Node.js', 'Express', 'MongoDB', 'EJS'],
        icon: '🏫',
        image: 'assets/erp.png',
        github: 'https://github.com/shivamyadav039/school-erp-project039',
        live: 'https://school-erp-project039.vercel.app'
      },
      {
        title: 'Face Recognition Attendance',
        badge: 'Computer Vision',
        badgeColor: '#818cf8',
        desc: 'Desktop app to mark attendance in real time using face recognition with OpenCV and Tkinter UI.',
        tags: ['Python', 'OpenCV', 'Tkinter', 'LBPH'],
        icon: '👁️',
        image: 'assets/attendance-premium.webp',
        github: 'https://github.com/shivamyadav039/AttendanceMangemantSystemFRS'
      },
    ];

    const content = document.createElement('div');
    content.className = 'overlay-section-content max-w-5xl mx-auto w-full';
    content.innerHTML = `
      <div class="grid md:grid-cols-3 gap-5">
        ${projects.map(p => `
          <div class="overlay-card overlay-project-card" style="display:flex;flex-direction:column;justify-content:space-between;height:100%;">
            <div>
              ${p.image ? `<div style="height:140px;border-radius:0.75rem;overflow:hidden;margin-bottom:1rem;border:1px solid rgba(255,255,255,0.1);"><img src="${p.image}" alt="${p.title}" style="width:100%;height:100%;object-fit:cover;transition:transform 0.5s ease;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'"/></div>` : `<div style="font-size:2.5rem;margin-bottom:1rem;">${p.icon}</div>`}
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.75rem;gap:0.5rem;flex-wrap:wrap;">
                <h3 style="font-size:1rem;font-weight:700;color:#fff;flex:1;">${p.title}</h3>
                <span style="font-size:0.65rem;font-weight:600;padding:0.2rem 0.6rem;border-radius:999px;background:rgba(0,0,0,0.3);border:1px solid ${p.badgeColor}40;color:${p.badgeColor};">${p.badge}</span>
              </div>
              <p style="color:rgba(255,255,255,0.55);font-size:0.85rem;line-height:1.7;margin-bottom:1rem;">${p.desc}</p>
              <div style="display:flex;flex-wrap:wrap;gap:0.4rem;margin-bottom:1rem;">
                ${p.tags.map(t => `<span style="font-size:0.7rem;padding:0.2rem 0.55rem;border-radius:999px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);color:rgba(255,255,255,0.7);">${t}</span>`).join('')}
              </div>
            </div>
            <div style="display:flex;align-items:center;gap:0.75rem;margin-top:auto;padding-top:1rem;">
              ${p.github ? `<a href="${p.github}" target="_blank" style="display:inline-flex;align-items:center;justify-content:center;padding:0.5rem;border-radius:0.5rem;background:rgba(255,255,255,0.05);color:#fff;text-decoration:none;transition:all 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.1)'" onmouseout="this.style.background='rgba(255,255,255,0.05)'" title="GitHub Code"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg></a>` : ''}
              ${p.live ? `<a href="${p.live}" target="_blank" style="display:inline-flex;align-items:center;justify-content:center;padding:0.5rem;border-radius:0.5rem;background:rgba(${parseInt(p.badgeColor.slice(1,3),parseInt(p.badgeColor.slice(3,5),16),parseInt(p.badgeColor.slice(5,7),16),0.15)};color:${p.badgeColor};text-decoration:none;transition:all 0.2s;flex:1;font-size:0.8rem;font-weight:600;gap:0.4rem;" onmouseover="this.style.background='rgba(255,255,255,0.1)'" onmouseout="this.style.background='transparent'">Live Demo <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg></a>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
      <div class="overlay-section-content" style="margin-top:2rem;text-align:center;">
        <p style="color:rgba(255,255,255,0.35);font-size:0.85rem;">More projects coming soon... 🚀</p>
      </div>
    `;
    panel.appendChild(content);
  }

  function buildSkillsContent(panel) {
    // Tech brand logos as inline SVG — each skill with color & icon
    const SKILL_LOGOS = {
      'Python': { color: '#3776AB', bg: 'rgba(55,118,171,0.15)', svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.9 2C8.3 2 8.5 3.5 8.5 3.5V7h3.5v.5H5.5S2 7.1 2 11s3.3 3.8 3.3 3.8H7V12.7s-.1-3.2 3.2-3.2h5.5s3-.05 3-2.9V5.1S19.2 2 11.9 2zm-1.3 1.8a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" fill="#3776AB"/><path d="M12.1 22c3.6 0 3.4-1.5 3.4-1.5V17h-3.5v-.5h6.5S22 16.9 22 13s-3.3-3.8-3.3-3.8H17v2.1s.1 3.2-3.2 3.2H8.3s-3 .05-3 2.9v2.6S5.8 22 12.1 22zm1.3-1.8a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" fill="#FDCA40"/></svg>` },
      'C++': { color: '#00599C', bg: 'rgba(0,89,156,0.15)', svg: `<svg viewBox="0 0 24 24" fill="#00599C" xmlns="http://www.w3.org/2000/svg"><path d="M22.394 6c-.167-.29-.398-.543-.652-.69L12.926 0a1.307 1.307 0 0 0-1.258 0L2.88 5.3c-.254.147-.49.4-.655.692C2.07 6.28 2 6.608 2 6.9v10.4c0 .285.07.614.22.9.165.29.4.54.652.69l8.816 5.3c.385.22.87.22 1.255 0l8.816-5.3c.254-.147.49-.4.652-.69.147-.286.216-.614.216-.9V6.9c0-.292-.07-.62-.237-.9zM12 17.5a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11zm0-1.5a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm4.5-4h-1v1h-1v-1h-1v-1h1v-1h1v1h1v1zm3 0h-1v1h-1v-1h-1v-1h1v-1h1v1h1v1z"/></svg>` },
      'Java': { color: '#ED8B00', bg: 'rgba(237,139,0,0.15)', svg: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M8.851 18.56s-.917.534.653.714c1.902.218 2.874.187 4.969-.211 0 0 .552.346 1.321.646-4.699 2.013-10.633-.118-6.943-1.149m-.575-2.627s-1.028.761.542.924c2.032.209 3.636.227 6.413-.308 0 0 .384.389.987.602-5.679 1.661-12.007.13-7.942-1.218m4.84-8.72s1.561 1.861-.842 2.97c-3.025 1.469-6.861-.677-5.888-2.596 0 0 .297.744 1.987 1.032 1.849.323 3.97-.133 4.743-.406M19.314 21s.679.559-.748.991c-2.712.822-11.287 1.069-13.669.033-.856-.373.75-.89 1.254-.998.527-.115.828-.093.828-.093-.953-.672-6.157 1.318-2.644 1.887 9.58 1.554 17.462-.7 14.979-1.82M9.292 12.78s-4.362 1.037-1.544 1.414c1.189.159 3.561.123 5.772-.062 1.806-.152 3.618-.478 3.618-.478s-.637.272-1.097.588c-4.429 1.165-12.986.623-10.522-.569 2.082-1.013 3.773-.893 3.773-.893M17.116 17.584c4.503-2.34 2.421-4.589.968-4.285-.355.074-.515.138-.515.138s.132-.207.385-.297c2.875-1.011 5.086 2.981-.929 4.562 0-.001.07-.062.091-.118m-5.062-12.64s2.028 2.026-.923 5.116c-2.41 2.481-.55 3.898-.001 5.515-1.833-1.654-3.177-3.108-2.274-4.464 1.329-1.982 5.005-2.941 3.198-6.167M9.737 20.706c4.324.277 10.959-.153 11.12-2.19 0 0-.302.775-3.572 1.391-3.688.694-8.239.613-10.937.168 0-.001.553.457 3.389.631" fill="#ED8B00"/></svg>` },
      'SQL': { color: '#CC2927', bg: 'rgba(204,41,39,0.15)', svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="12" cy="5" rx="9" ry="3" stroke="#CC2927" stroke-width="1.5"/><path d="M3 5v4c0 1.657 4.03 3 9 3s9-1.343 9-3V5" stroke="#CC2927" stroke-width="1.5"/><path d="M3 9v4c0 1.657 4.03 3 9 3s9-1.343 9-3V9" stroke="#CC2927" stroke-width="1.5"/><path d="M3 13v4c0 1.657 4.03 3 9 3s9-1.343 9-3v-4" stroke="#CC2927" stroke-width="1.5"/></svg>` },
      'C': { color: '#A8B9CC', bg: 'rgba(168,185,204,0.15)', svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" stroke="#A8B9CC" stroke-width="1.5"/><path d="M14.5 9a4.5 4.5 0 1 0 0 6" stroke="#A8B9CC" stroke-width="1.5" stroke-linecap="round"/></svg>` },
      'TensorFlow': { color: '#FF6F00', bg: 'rgba(255,111,0,0.15)', svg: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M1.292 5.856L11.54 0v24l-4.095-2.378V7.603l-6.153 3.564zm21.416 6.436l-4.092-2.375v8.638l-4.097 2.378V0l10.24 5.856z" fill="#FF6F00"/></svg>` },
      'PyTorch': { color: '#EE4C2C', bg: 'rgba(238,76,44,0.15)', svg: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12.005 0L4.952 7.053a9.865 9.865 0 0 0 0 14.01 9.866 9.866 0 0 0 14.01 0 9.866 9.866 0 0 0 0-14.01L16.947 9.08a4.366 4.366 0 0 1 0 6.18 4.367 4.367 0 0 1-6.18 0 4.367 4.367 0 0 1 0-6.18l1.238-1.24zm3.032 4.156a1.316 1.316 0 1 1 0 2.631 1.316 1.316 0 0 1 0-2.631z" fill="#EE4C2C"/></svg>` },
      'OpenCV': { color: '#5C3EE8', bg: 'rgba(92,62,232,0.15)', svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" stroke="#5C3EE8" stroke-width="1.5"/><circle cx="12" cy="12" r="3" fill="#5C3EE8"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2" stroke="#5C3EE8" stroke-width="1.5" stroke-linecap="round"/></svg>` },
      'Scikit-learn': { color: '#F89939', bg: 'rgba(248,153,57,0.15)', svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#F89939" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>` },
      'LangChain': { color: '#1C3C3C', bg: 'rgba(28,60,60,0.2)', svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="#34d399" stroke-width="1.5" stroke-linecap="round"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="#34d399" stroke-width="1.5" stroke-linecap="round"/></svg>` },
      'Git & GitHub': { color: '#F05032', bg: 'rgba(240,80,50,0.15)', svg: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11.999 1C5.926 1 1 5.925 1 12c0 4.86 3.152 8.983 7.523 10.437.55.101.75-.238.75-.53 0-.26-.009-.95-.014-1.863-3.06.664-3.706-1.475-3.706-1.475-.501-1.271-1.222-1.61-1.222-1.61-.999-.682.075-.668.075-.668 1.105.078 1.686 1.134 1.686 1.134.981 1.681 2.575 1.195 3.202.914.1-.71.384-1.195.698-1.47-2.442-.278-5.01-1.222-5.01-5.437 0-1.201.428-2.182 1.132-2.952-.114-.278-.491-1.397.108-2.91 0 0 .923-.295 3.025 1.128A10.536 10.536 0 0 1 12 6.32c.935.004 1.876.126 2.754.37 2.1-1.423 3.023-1.128 3.023-1.128.6 1.513.223 2.632.11 2.91.705.77 1.13 1.751 1.13 2.952 0 4.226-2.572 5.156-5.022 5.428.395.34.747 1.01.747 2.037 0 1.47-.014 2.657-.014 3.017 0 .295.199.637.756.528C19.851 20.979 23 16.859 23 12c0-6.075-4.926-11-11.001-11z" fill="#F05032"/></svg>` },
      'FastAPI': { color: '#009688', bg: 'rgba(0,150,136,0.15)', svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="#009688" stroke-width="1.5"/><path d="M13 3L5 13h7l-1 8 8-10h-7l1-8z" fill="#009688"/></svg>` },
      'MongoDB': { color: '#47A248', bg: 'rgba(71,162,72,0.15)', svg: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.193 9.555c-1.264-5.58-4.252-7.414-4.573-8.115-.28-.394-.53-.954-.735-1.44-.036.495-.055.685-.523 1.184-.723.566-4.438 3.682-4.74 10.02-.282 5.912 4.27 9.435 4.888 9.884l.07.05A73.49 73.49 0 0 1 11.91 24h.481c.114-1.032.284-2.056.51-3.07.417-.296.604-.463.85-.693a11.342 11.342 0 0 0 3.639-8.464c.01-.814-.103-1.662-.197-2.218zm-5.336 8.195s0-8.291.275-8.29c.213 0 .49 10.695.49 10.695-.381-.045-.765-1.76-.765-2.405z" fill="#47A248"/></svg>` },
      'Node.js': { color: '#339933', bg: 'rgba(51,153,51,0.15)', svg: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11.998 24a1.39 1.39 0 0 1-.696-.186l-2.218-1.31c-.333-.186-.169-.251-.059-.29.44-.153.531-.186.997-.452.048-.027.1-.016.145.01l1.705 1.012c.063.034.15.034.207 0l6.638-3.835c.063-.036.102-.108.102-.184V7.252c0-.077-.039-.148-.104-.185l-6.635-3.83a.188.188 0 0 0-.207 0L5.242 7.068c-.066.038-.106.11-.106.185v7.666c0 .074.04.145.105.18l1.819 1.05c.988.494 1.594-.088 1.594-.674V8.42c0-.107.086-.19.193-.19h.845c.104 0 .19.083.19.19v7.054c0 1.318-.718 2.073-1.968 2.073-.384 0-.686 0-1.532-.415l-1.74-1.003a1.4 1.4 0 0 1-.698-1.209V7.252c0-.498.266-.963.696-1.21l6.638-3.835a1.453 1.453 0 0 1 1.396 0l6.638 3.835c.43.247.697.712.697 1.21v7.666c0 .498-.267.96-.697 1.208l-6.638 3.835a1.39 1.39 0 0 1-.7.186z" fill="#339933"/><path d="M14.207 16.982c-2.9 0-3.508-1.332-3.508-2.448 0-.107.086-.191.192-.191h.862c.095 0 .174.068.19.162.13.878.515 1.32 2.264 1.32 1.393 0 1.985-.315 1.985-1.055 0-.426-.169-.742-2.332-1.053-1.808-.253-2.926-.82-2.926-2.271 0-1.496 1.261-2.386 3.377-2.386 2.374 0 3.552.823 3.7 2.597a.191.191 0 0 1-.19.207h-.865a.192.192 0 0 1-.187-.156c-.232-1.027-.794-1.357-2.458-1.357-1.812 0-2.022.63-2.022 1.104 0 .573.249.74 2.261 1.063 2.011.32 2.997.872 2.997 2.255-.003 1.62-1.35 2.509-3.34 2.509z" fill="#339933"/></svg>` },
      'Hugging Face': { color: '#FFD21E', bg: 'rgba(255,210,30,0.15)', svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="#FFD21E" stroke-width="1.5"/><path d="M8 14s1.5 2 4 2 4-2 4-2" stroke="#FFD21E" stroke-width="1.5" stroke-linecap="round"/><circle cx="9" cy="10" r="1.5" fill="#FFD21E"/><circle cx="15" cy="10" r="1.5" fill="#FFD21E"/></svg>` },
      'Keras': { color: '#D00000', bg: 'rgba(208,0,0,0.15)', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></svg>` },
      'Data Structures & Algorithms': { color: '#10b981', bg: 'rgba(16,185,129,0.15)', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 11a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1 1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1Z"/><path d="M10 11a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1 1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1Z"/><path d="M16 11a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1 1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1Z"/><path d="M22 11a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1 1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1Z"/><path d="M4 14v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg>` },
      'Django': { color: '#092E20', bg: 'rgba(9,46,32,0.15)', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></svg>` },
      'HTML5': { color: '#E34F26', bg: 'rgba(227,79,38,0.15)', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></svg>` },
      'CSS3': { color: '#1572B6', bg: 'rgba(21,114,182,0.15)', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></svg>` },
      'Data Analysis': { color: '#10b981', bg: 'rgba(16,185,129,0.15)', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12V7a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 7v10a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l4-2.29"/><circle cx="12" cy="12" r="3"/><path d="M14.5 14.5L19 19"/></svg>` },
      'LLM Training': { color: '#8b5cf6', bg: 'rgba(139,92,246,0.15)', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 14a4 4 0 1 1 4-4 4 4 0 0 1-4 4z"/><path d="M12 6v2m0 8v2m-5-5H5m14 0h-2"/></svg>` },
      'Prompt Engineering': { color: '#ec4899', bg: 'rgba(236,72,153,0.15)', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M8 9h8m-8 4h5"/></svg>` },
      'NLP (Transformers)': { color: '#6366f1', bg: 'rgba(99,102,241,0.15)', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 8V4m0 16v-4m-4-4H4m16 0h-4M5.6 5.6l2.8 2.8m7.2 7.2l2.8 2.8M5.6 18.4l2.8-2.8m7.2-7.2l2.8-2.8"/></svg>` },
      'FastAPI & Streamlit': { color: '#06b6d4', bg: 'rgba(6,182,212,0.15)', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>` },
      'Linux (Ubuntu)': { color: '#f97316', bg: 'rgba(249,115,22,0.15)', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>` },
      'C++ & Java': { color: '#3b82f6', bg: 'rgba(59,130,246,0.15)', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/></svg>` },
      'VS Code & Postman': { color: '#22d3ee', bg: 'rgba(34,211,238,0.15)', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><path d="M9 3v18m6-18v18M3 9h18m-18 6h18"/></svg>` },
      'Oracle Cloud': { color: '#f43f5e', bg: 'rgba(244,63,94,0.15)', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.5 19c.6 0 1.1-.1 1.6-.4m.9-2.6c0-2.7-2-5-4.7-5.5-.7-1.5-2.2-2.5-4-2.5-2.2 0-4.1 1.5-4.6 3.6-1.5.3-2.6 1.7-2.6 3.4 0 1.9 1.6 3.5 3.5 3.5h10z"/></svg>` },
    };

    const skillGroups = [
      {
        label: 'AI & Model Development',
        accentColor: '#818cf8',
        skills: [
          { name: 'Python', level: 95 },
          { name: 'PyTorch', level: 90 },
          { name: 'TensorFlow', level: 85 },
          { name: 'OpenCV', level: 88 },
          { name: 'Scikit-learn', level: 92 },
          { name: 'Keras', level: 80 },
          { name: 'Hugging Face', level: 85 },
        ],
      },
      {
        label: 'Data, Algorithms & LLMs',
        accentColor: '#34d399',
        skills: [
          { name: 'Data Structures & Algorithms', level: 90 },
          { name: 'Data Analysis', level: 94 },
          { name: 'LLM Training', level: 90 },
          { name: 'Prompt Engineering', level: 95 },
          { name: 'NLP (Transformers)', level: 92 },
        ],
      },
      {
        label: 'Web & Backend Development',
        accentColor: '#60a5fa',
        skills: [
          { name: 'FastAPI & Streamlit', level: 90 },
          { name: 'Django', level: 85 },
          { name: 'Node.js', level: 82 },
          { name: 'HTML5', level: 95 },
          { name: 'CSS3', level: 92 },
          { name: 'MongoDB', level: 85 },
          { name: 'SQL', level: 88 },
        ],
      },
      {
        label: 'Core Programming & Tools',
        accentColor: '#fbbf24',
        skills: [
          { name: 'C++', level: 92 },
          { name: 'Java', level: 88 },
          { name: 'C', level: 85 },
          { name: 'Git & GitHub', level: 95 },
          { name: 'Linux (Ubuntu)', level: 90 },
          { name: 'Oracle Cloud', level: 82 },
          { name: 'VS Code & Postman', level: 92 },
        ],
      },
    ];

    const content = document.createElement('div');
    content.className = 'overlay-section-content max-w-5xl mx-auto w-full';
    content.innerHTML = `
      <div style="display:flex;flex-direction:column;gap:2.5rem;">
        ${skillGroups.map(group => `
          <div>
            <h3 style="font-size:0.75rem;letter-spacing:0.12em;text-transform:uppercase;color:${group.accentColor};margin-bottom:1.25rem;font-weight:600;">${group.label}</h3>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:0.85rem;">
              ${group.skills.map(s => {
      const logo = SKILL_LOGOS[s.name] || { color: '#fff', bg: 'rgba(255,255,255,0.08)', svg: `<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/></svg>` };
      return `
                <div class="overlay-card" style="padding:1.1rem;display:flex;flex-direction:column;align-items:center;gap:0.7rem;text-align:center;border-color:${logo.color}25;background:${logo.bg};">
                  <div style="width:3rem;height:3rem;padding:0.6rem;border-radius:0.85rem;background:${logo.bg};border:1px solid ${logo.color}40;display:flex;align-items:center;justify-content:center;">
                    ${logo.svg}
                  </div>
                  <div style="width:100%;">
                    <p style="font-size:0.82rem;font-weight:700;color:#fff;margin-bottom:0.4rem;">${s.name}</p>
                    <div class="skill-pill-bar">
                      <div class="skill-pill-fill" data-width="${s.level}%" style="background:linear-gradient(90deg,${logo.color}80,${logo.color});"></div>
                    </div>
                    <p style="font-size:0.65rem;color:${logo.color};margin-top:0.25rem;font-weight:600;">${s.level}%</p>
                  </div>
                </div>
              `}).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    `;
    panel.appendChild(content);
  }

  function buildExperienceContent(panel) {
    const content = document.createElement('div');
    content.className = 'overlay-section-content max-w-4xl mx-auto w-full';
    content.innerHTML = `
      <div class="grid md:grid-cols-2 gap-8">
        <!-- Timeline -->
        <div>
          <h3 style="font-size:0.8rem;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.35);margin-bottom:2rem;">Experience & Education</h3>
          <div class="overlay-timeline">
            <div class="overlay-timeline-item" style="color:#fbbf24;">
              <p style="font-size:0.72rem;color:rgba(255,255,255,0.35);margin-bottom:0.25rem;">March 2026 – Present</p>
              <h4 style="font-size:1rem;font-weight:700;color:#fff;margin-bottom:0.25rem;">Data Analyst LLM Training — Deccan AI</h4>
              <p style="font-size:0.82rem;color:#fbbf24;margin-bottom:0.5rem;">Remote</p>
              <p style="font-size:0.85rem;color:rgba(255,255,255,0.55);line-height:1.7;">
                Analyzing data and training methodologies to improve LLM accuracy and performance.
              </p>
            </div>
            <div class="overlay-timeline-item" style="color:#fbbf24;">
              <p style="font-size:0.72rem;color:rgba(255,255,255,0.35);margin-bottom:0.25rem;">Nov 2024 – Present</p>
              <h4 style="font-size:1rem;font-weight:700;color:#fff;margin-bottom:0.25rem;">Math Trainee — Outlier.ai</h4>
              <p style="font-size:0.82rem;color:#fbbf24;margin-bottom:0.5rem;">Remote</p>
              <p style="font-size:0.85rem;color:rgba(255,255,255,0.55);line-height:1.7;">
                Solving advanced math & reasoning tasks to help train large language models. Focus on algebra, logic, probability.
              </p>
            </div>
            <div class="overlay-timeline-item" style="color:#fbbf24;">
              <p style="font-size:0.72rem;color:rgba(255,255,255,0.35);margin-bottom:0.25rem;">2023 – 2027 (Expected)</p>
              <h4 style="font-size:1rem;font-weight:700;color:#fff;margin-bottom:0.25rem;">B.Tech CSE — AI & ML</h4>
              <p style="font-size:0.82rem;color:#fbbf24;margin-bottom:0.5rem;">Lovely Professional University, Punjab</p>
              <p style="font-size:0.85rem;color:rgba(255,255,255,0.55);line-height:1.7;">
                Building strong fundamentals in algorithms, ML, deep learning, and software engineering.
              </p>
            </div>
          </div>
        </div>

        <!-- Certifications -->
        <div>
          <h3 style="font-size:0.8rem;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.35);margin-bottom:2rem;">Certifications</h3>
          <div style="display:flex;flex-direction:column;gap:1rem;">
            <!-- Oracle Cloud AI -->
            <a href="https://www.linkedin.com/in/shivam-yadav39/overlay/Certifications/64771030/treasury/?profileId=ACoAAEc_ZQMBelrQiMwMsRjxEzIVYnQnrPCax2Y" target="_blank" style="text-decoration:none;">
              <div class="overlay-card hover-lift">
                <div style="display:flex;align-items:flex-start;gap:1.2rem;">
                  <div style="font-size:1.6rem;filter:drop-shadow(0 0 8px rgba(96,165,250,0.3));">☁️</div>
                  <div>
                    <p style="font-size:0.9rem;font-weight:700;color:#fff;margin-bottom:0.25rem;">Oracle Cloud Infrastructure 2025 AI Foundations</p>
                    <p style="font-size:0.75rem;color:rgba(255,255,255,0.45);text-transform:uppercase;letter-spacing:0.04em;">Oracle · 2025</p>
                  </div>
                </div>
              </div>
            </a>

            <!-- Essentials Automation -->
            <a href="https://certificates.automationanywhere.com/74c6ec4f-32ed-4484-9db0-b464a426c08a#acc.xvQZpMBS" target="_blank" style="text-decoration:none;">
              <div class="overlay-card hover-lift">
                <div style="display:flex;align-items:flex-start;gap:1.2rem;">
                  <div style="font-size:1.6rem;filter:drop-shadow(0 0 8px rgba(52,211,153,0.3));">🤖</div>
                  <div>
                    <p style="font-size:0.9rem;font-weight:700;color:#fff;margin-bottom:0.25rem;">Essentials Automation Certification</p>
                    <p style="font-size:0.75rem;color:rgba(255,255,255,0.45);text-transform:uppercase;letter-spacing:0.04em;">Automation Anywhere</p>
                  </div>
                </div>
              </div>
            </a>

            <!-- Master Gen AI -->
            <a href="https://www.linkedin.com/in/shivam-yadav39/overlay/Certifications/64537320/treasury/?profileId=ACoAAEc_ZQMBelrQiMwMsRjxEzIVYnQnrPCax2Y" target="_blank" style="text-decoration:none;">
              <div class="overlay-card hover-lift">
                <div style="display:flex;align-items:flex-start;gap:1.2rem;">
                  <div style="font-size:1.6rem;filter:drop-shadow(0 0 8px rgba(139,92,246,0.3));">🧠</div>
                  <div>
                    <p style="font-size:0.9rem;font-weight:700;color:#fff;margin-bottom:0.25rem;">Master Generative AI & Tools</p>
                    <p style="font-size:0.75rem;color:rgba(255,255,255,0.45);text-transform:uppercase;letter-spacing:0.04em;">LinkedIn Learning · 2024</p>
                  </div>
                </div>
              </div>
            </a>

            <!-- ChatGPT-4 Prompt Eng -->
            <a href="https://www.linkedin.com/in/shivam-yadav39/overlay/Certifications/64257044/treasury/?profileId=ACoAAEc_ZQMBelrQiMwMsRjxEzIVYnQnrPCax2Y" target="_blank" style="text-decoration:none;">
              <div class="overlay-card hover-lift">
                <div style="display:flex;align-items:flex-start;gap:1.2rem;">
                  <div style="font-size:1.6rem;filter:drop-shadow(0 0 8px rgba(245,158,11,0.3));">⚡</div>
                  <div>
                    <p style="font-size:0.9rem;font-weight:700;color:#fff;margin-bottom:0.25rem;">ChatGPT-4 Prompt Engineering</p>
                    <p style="font-size:0.75rem;color:rgba(255,255,255,0.45);text-transform:uppercase;letter-spacing:0.04em;">Udemy · 2024</p>
                  </div>
                </div>
              </div>
            </a>

            <!-- Intro to Gen AI -->
            <a href="https://www.coursera.org/account/accomplishments/certificate/7YXQ8CC1VIJO" target="_blank" style="text-decoration:none;">
              <div class="overlay-card hover-lift">
                <div style="display:flex;align-items:flex-start;gap:1.2rem;">
                  <div style="font-size:1.6rem;filter:drop-shadow(0 0 8px rgba(239,68,68,0.3));">🎓</div>
                  <div>
                    <p style="font-size:0.9rem;font-weight:700;color:#fff;margin-bottom:0.25rem;">Intro to Generative AI by Google</p>
                    <p style="font-size:0.75rem;color:rgba(255,255,255,0.45);text-transform:uppercase;letter-spacing:0.04em;">Google Cloud · Coursera</p>
                  </div>
                </div>
              </div>
            </a>

            <!-- Career Direction -->
            <div class="overlay-card" style="margin-top:0.5rem;border-left:2px solid #22d3ee;">
              <div style="display:flex;align-items:flex-start;gap:1.2rem;">
                <div style="font-size:1.6rem;">🧭</div>
                <div>
                  <p style="font-size:0.9rem;font-weight:700;color:#fff;margin-bottom:0.25rem;">Career Direction</p>
                  <p style="font-size:0.8rem;color:rgba(255,255,255,0.6);line-height:1.7;">
                    Project Builder → Product Engineer → AI Systems Designer
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    panel.appendChild(content);
  }

  function buildContactContent(panel) {
    const content = document.createElement('div');
    content.className = 'overlay-section-content max-w-3xl mx-auto w-full';
    content.innerHTML = `
      <div class="grid md:grid-cols-2 gap-6">
        <!-- Info -->
        <div style="display:flex;flex-direction:column;gap:1rem;">
          <div class="overlay-card">
            <div style="display:flex;align-items:center;gap:1rem;">
              <div style="width:2.5rem;height:2.5rem;border-radius:50%;background:rgba(34,211,238,0.12);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                <svg width="18" height="18" fill="none" stroke="#22d3ee" stroke-width="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 9.81a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.06 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z"/></svg>
              </div>
              <div>
                <p style="font-size:0.7rem;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:0.08em;">Phone</p>
                <p style="font-size:0.95rem;color:#fff;font-weight:600;">+91 9648005320</p>
              </div>
            </div>
          </div>

          <div class="overlay-card">
            <div style="display:flex;align-items:center;gap:1rem;">
              <div style="width:2.5rem;height:2.5rem;border-radius:50%;background:rgba(34,211,238,0.12);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                <svg width="18" height="18" fill="none" stroke="#22d3ee" stroke-width="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </div>
              <div>
                <p style="font-size:0.7rem;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:0.08em;">Email</p>
                <p style="font-size:0.92rem;color:#fff;font-weight:600;">shivamyadav7745@gmail.com</p>
              </div>
            </div>
          </div>

          <div class="overlay-card">
            <p style="font-size:0.7rem;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:1rem;">Social</p>
            <div style="display:flex;gap:1rem;">
              <a href="https://github.com/shivamyadav039" target="_blank" style="display:inline-flex;align-items:center;gap:0.5rem;padding:0.6rem 1rem;border-radius:999px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);color:#fff;font-size:0.82rem;font-weight:600;text-decoration:none;transition:all 0.2s;" onmouseover="this.style.borderColor='rgba(34,211,238,0.5)'" onmouseout="this.style.borderColor='rgba(255,255,255,0.12)'">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0a12 12 0 0 0-3.79 23.4c.6.11.82-.26.82-.58v-2c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.08-.74.08-.73.08-.73 1.2.09 1.83 1.23 1.83 1.23 1.07 1.83 2.8 1.3 3.48 1 .11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1-.32 3.3 1.23A11.5 11.5 0 0 1 12 6.8c1.02 0 2.04.14 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.21.69.82.57A12 12 0 0 0 12 0z"/></svg>
                GitHub
              </a>
              <a href="https://www.linkedin.com/in/shivam-yadav39/" target="_blank" style="display:inline-flex;align-items:center;gap:0.5rem;padding:0.6rem 1rem;border-radius:999px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);color:#fff;font-size:0.82rem;font-weight:600;text-decoration:none;transition:all 0.2s;" onmouseover="this.style.borderColor='rgba(34,211,238,0.5)'" onmouseout="this.style.borderColor='rgba(255,255,255,0.12)'">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        <!-- Form -->
        <form style="display:flex;flex-direction:column;gap:0.9rem;" onsubmit="return false;">
          <input class="overlay-input" type="text" placeholder="Your Name" required />
          <input class="overlay-input" type="email" placeholder="Your Email" required />
          <textarea class="overlay-input" rows="4" placeholder="Your Message" style="resize:vertical;" required></textarea>
          <button type="submit" style="padding:0.85rem;border-radius:999px;background:linear-gradient(90deg,#06b6d4,#0ea5e9);color:#fff;font-weight:700;font-size:0.9rem;border:none;cursor:pointer;transition:all 0.25s;font-family:'Poppins',sans-serif;" onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 12px 30px rgba(6,182,212,0.4)'" onmouseout="this.style.transform='none';this.style.boxShadow='none'">
            Send Message ✉️
          </button>
        </form>
      </div>
    `;
    panel.appendChild(content);
  }

  // ═══════════════════════════════════════════════════════
  //  INIT: Build all overlays & bind nav links
  // ═══════════════════════════════════════════════════════
  const overlayMap = {};

  function init() {
    SECTIONS.forEach(section => {
      const ctrl = buildOverlay(section);
      overlayMap[section.id] = ctrl;
    });

    // Bind ALL nav links (both desktop and mobile)
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      const href = link.getAttribute('href');
      const sectionId = href.replace('#', '');
      if (overlayMap[sectionId]) {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          // Close any other open overlay first
          Object.values(overlayMap).forEach(c => {
            if (c.overlay.classList.contains('open')) c.close();
          });
          overlayMap[sectionId].open();
        });
      }
    });

    // Also bind the hero "View Projects" button
    const heroProjectsBtn = document.querySelector('a[href="#projects"]');
    if (heroProjectsBtn && overlayMap['projects']) {
      heroProjectsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        overlayMap['projects'].open();
      });
    }

    // Animate skill bars when skills overlay transitions in
    const skillsOverlay = document.getElementById('overlay-skills');
    if (skillsOverlay) {
      skillsOverlay.addEventListener('transitionend', function (e) {
        if (skillsOverlay.classList.contains('open') && e.propertyName === 'clip-path') {
          setTimeout(() => {
            skillsOverlay.querySelectorAll('.skill-pill-fill').forEach(bar => {
              bar.style.width = bar.dataset.width || bar.getAttribute('data-width') || '80%';
            });
          }, 300);
        }
      });
    }
  }

  // Run after DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
