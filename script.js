document.addEventListener("DOMContentLoaded", () => {
  // ========== CONFIG ==========

  // TODO: AFTER backend deployment, replace with your real backend URL:
  // Example: "https://shivam-portfolio-api.onrender.com"
  const BACKEND_URL = ""; // Empty string means use relative path (same origin)

  // ========== LUCIDE ICONS ==========
  if (window.lucide) {
    lucide.createIcons();
  }

  // ========== PARTICLES ==========
  if (typeof window.initParticles === 'function') {
    window.initParticles("particle-container");
  }

  // ========== HERO CANVAS ANIMATION ==========
  (function initHeroCanvas() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, pts = [], animId;
    const N = 55;

    function resize() {
      const parent = canvas.parentElement;
      w = canvas.width = parent.offsetWidth;
      h = canvas.height = parent.offsetHeight;
    }

    function mkPt() {
      const palette = [
        [0, 122, 255],   // blue
        [139, 92, 246],  // violet
        [34, 211, 238],  // cyan
        [236, 72, 153],  // pink
        [52, 211, 153],  // green
      ];
      const c = palette[Math.floor(Math.random() * palette.length)];
      return {
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2.5 + 0.5,
        c: c, a: Math.random() * 0.5 + 0.2,
        pulse: Math.random() * Math.PI * 2,
        ps: 0.015 + Math.random() * 0.02,
      };
    }

    function init() { resize(); pts = Array.from({ length: N }, mkPt); }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      // connections
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 120) {
            const alpha = (1 - d / 120) * 0.12;
            ctx.strokeStyle = `rgba(${pts[i].c.join(',')},${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      }
      // dots
      pts.forEach(p => {
        p.pulse += p.ps;
        const a = p.a * (0.5 + 0.5 * Math.sin(p.pulse));
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        grad.addColorStop(0, `rgba(${p.c.join(',')},${a})`);
        grad.addColorStop(1, `rgba(${p.c.join(',')},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = `rgba(${p.c.join(',')},${Math.min(a * 2.5, 1)})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
      });
      animId = requestAnimationFrame(draw);
    }
    new ResizeObserver(resize).observe(canvas.parentElement);
    init(); draw();
  })();

  // ========== TYPING EFFECT ==========
  const typingElement = document.getElementById("typing-text");
  const phrases = [
    "Building Intelligent Systems",
    "Solving Complex Problems",
    "Designing Scalable Backends",
    "Crafting AI Solutions"
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 100;

  function typeEffect() {
    if (!typingElement) return;

    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 50;
    } else {
      typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 100;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      isDeleting = true;
      typeSpeed = 2000; // Pause at end
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typeSpeed = 500; // Pause before new phrase
    }

    setTimeout(typeEffect, typeSpeed);
  }

  // Start typing effect if element exists
  if (typingElement) {
    typeEffect();
  }

  // ========== NAVBAR SCROLL EFFECT ==========
  const header = document.querySelector("header");
  const headerInner = header ? header.querySelector(".container") : null;

  function handleScroll() {
    if (!header) return;
    if (window.scrollY > 20) {
      header.classList.add("scrolled");
      if (headerInner && headerInner.classList.contains("py-3")) {
        headerInner.classList.replace("py-3", "py-2");
      }
    } else {
      header.classList.remove("scrolled");
      if (headerInner && headerInner.classList.contains("py-2")) {
        headerInner.classList.replace("py-2", "py-3");
      }
    }
  }

  window.addEventListener("scroll", handleScroll);
  handleScroll(); // Check on load

  // ========== PROJECT CARD HOVER EFFECT ==========
  const cards = document.querySelectorAll(".project-card");
  cards.forEach(card => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    });
  });

  // ========== MOBILE MENU ==========
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.add("hidden");
      });
    });
  }

  // ========== SECTION REVEAL ==========
  const sections = document.querySelectorAll(".section-reveal");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  sections.forEach((section) => revealObserver.observe(section));

  // ========== PROJECT MODAL ==========
  const modal = document.getElementById("project-modal");
  const modalBackdrop = document.getElementById("modal-backdrop");
  const modalContent = document.getElementById("modal-content");
  const closeModalBtns = document.querySelectorAll(".close-modal-btn");
  const projectCards = document.querySelectorAll(".project-card");

  const projectDetails = {
    "fake-news": {
      title: "Fake News Detection using NLP",
      subtitle: "End-to-end real vs fake news classification pipeline",
      objective: "Develop an intelligent system to automatically detect fake news articles using deep learning and modern transformer-based NLP. Useful for filtering out misinformation on social platforms.",
      features: [
        "Merged and cleaned large news datasets, removed noise and performed tokenization.",
        "Fine-tuned a pre-trained BERT model for binary classification.",
        "Used stratified splitting, careful evaluation and confusion matrix analysis.",
        "Achieved ~92% validation accuracy on carefully curated evaluation data."
      ],
      tech: ["Python", "PyTorch", "Hugging Face", "BERT", "Scikit-learn", "Pandas"],
      github: "https://github.com/shivamyadav039/FakeNewsDetection",
      live: "https://fakenewsdetection-1-zimg.onrender.com/"
    },
    "school-erp": {
      title: "School ERP Management System",
      subtitle: "Web-based ERP for schools handling students, staff, fees, attendance, and analytics",
      objective: "Create a centralized management system for educational institutions to streamline administrative tasks and improve communication. Used by schools to digitize operations.",
      features: [
        "Secure role-based authentication system for admins, teachers, and students.",
        "Comprehensive modules for fee tracking, attendance management, and timetable scheduling.",
        "Interactive analytics dashboard for insights into student performance.",
        "Responsive UI accessible across devices."
      ],
      tech: ["Node.js", "Express", "MongoDB", "EJS", "HTML / CSS"],
      github: "https://github.com/shivamyadav039/school-erp-project039",
      live: "https://school-erp-project039.vercel.app"
    },
    "face-recognition": {
      title: "Face Recognition Attendance",
      subtitle: "Desktop app to mark attendance in real time using face recognition",
      objective: "Automate the attendance tracking process using computer vision to eliminate manual entry and proxy attendance. Useful for classrooms and offices.",
      features: [
        "Real-time face detection and recognition using Haar Cascades and LBPH.",
        "Interactive GUI built with Tkinter for dataset collection and model training.",
        "Automatic linking of recognized faces to student IDs and database records.",
        "Exportable attendance reports in Excel/CSV formats."
      ],
      tech: ["Python", "OpenCV", "Tkinter", "LBPH"],
      github: "https://github.com/shivamyadav039/AttendanceMangemantSystemFRS",
      live: null
    }
  };

  function openModal(projectId) {
    if (!modal || !modalBackdrop || !modalContent) return;

    const data = projectDetails[projectId];
    if (data) {
      document.getElementById("modal-title").textContent = data.title;
      document.getElementById("modal-subtitle").textContent = data.subtitle;
      document.getElementById("modal-objective").textContent = data.objective;
      
      const featuresList = document.getElementById("modal-features");
      if (featuresList) {
        featuresList.innerHTML = data.features.map(f => `<li>${f}</li>`).join("");
      }
      
      const techList = document.getElementById("modal-tech");
      if (techList) {
        techList.innerHTML = data.tech.map(t => `<span class="tag">${t}</span>`).join("");
      }

      // Update Links
      const githubLink = document.getElementById("modal-github");
      const liveLink = document.getElementById("modal-live");
      
      if (githubLink) {
        if (data.github) {
          githubLink.href = data.github;
          githubLink.style.display = "flex";
        } else {
          githubLink.style.display = "none";
        }
      }
      
      if (liveLink) {
        if (data.live) {
          liveLink.href = data.live;
          liveLink.style.display = "flex";
        } else {
          liveLink.style.display = "none";
        }
      }
    }

    modal.classList.remove("hidden");
    modal.classList.add("flex");
    document.body.style.overflow = "hidden";

    setTimeout(() => {
      modalBackdrop.classList.remove("opacity-0");
      modalBackdrop.classList.add("opacity-100");
      modalContent.classList.remove("scale-95", "opacity-0");
      modalContent.classList.add("scale-100", "opacity-100");
    }, 10);
  }

  function closeModal() {
    if (!modal || !modalBackdrop || !modalContent) return;
    modalBackdrop.classList.remove("opacity-100");
    modalBackdrop.classList.add("opacity-0");
    modalContent.classList.remove("scale-100", "opacity-100");
    modalContent.classList.add("scale-95", "opacity-0");

    setTimeout(() => {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
      document.body.style.overflow = "auto";
    }, 250);
  }

  projectCards.forEach((card) => {
    card.addEventListener("click", (e) => {
      // Prevent opening modal if clicking a real external link or a child button that has another action
      if (e.target.closest('a[href]:not([href="#"])')) {
        return;
      }
      e.preventDefault();
      const projectId = card.getAttribute("data-project");
      if (projectId) openModal(projectId);
    });
  });

  closeModalBtns.forEach((btn) => btn.addEventListener("click", closeModal));
  if (modalBackdrop) modalBackdrop.addEventListener("click", closeModal);

  // =========================================================
  // 1️⃣ PROJECT IDEA GENERATOR – Gemini via BACKEND (with fallback)
  // =========================================================

  const generateIdeasBtn = document.getElementById("generate-ideas-btn");
  const ideasContainer = document.getElementById("project-ideas-container");

  const localIdeaFallback = [
    {
      title: "Multi-lingual Fake News Radar",
      description:
        "Extend your fake news detector to support Hindi + English using multilingual transformers like XLM-R, with dashboards and API endpoints.",
    },
    {
      title: "AI Health Symptom Triage Assistant",
      description:
        "A privacy-friendly chatbot that suggests possible diagnoses or actions based on symptoms, powered by NLP and medical datasets.",
    },
    {
      title: "Smart Campus Attendance & Insight Hub",
      description:
        "Combine face recognition, attendance analytics and anomaly detection with live dashboards for teachers and administrators.",
    },
  ];

  function renderIdeas(projects) {
    if (!ideasContainer) return;
    ideasContainer.innerHTML = "";
    projects.forEach((project) => {
      const card = document.createElement("div");
      card.className =
        "glass-effect rounded-xl p-5 mb-4 border border-transparent hover:border-[#007aff] transition-all duration-300";
      card.innerHTML = `
        <h4 class="text-lg font-semibold text-white mb-1">${project.title}</h4>
        <p class="text-gray-300 text-sm">${project.description}</p>
      `;
      ideasContainer.appendChild(card);
    });
  }

  async function fetchProjectIdeasFromBackend() {
    // if (!BACKEND_URL) throw new Error("No backend yet");
    const res = await fetch(`${BACKEND_URL}/ideas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    if (!res.ok) throw new Error("Backend error");
    return await res.json(); // expected { projects: [...] }
  }

  if (generateIdeasBtn && ideasContainer) {
    generateIdeasBtn.addEventListener("click", async () => {
      generateIdeasBtn.disabled = true;
      generateIdeasBtn.innerHTML =
        '<span class="flex items-center justify-center"><i data-lucide="loader-2" class="w-4 h-4 animate-spin mr-2"></i>Generating...</span>';
      lucide.createIcons();

      try {
        const data = await fetchProjectIdeasFromBackend();
        renderIdeas(data.projects || localIdeaFallback);
      } catch (err) {
        console.warn("Using local project ideas fallback:", err.message);
        renderIdeas(localIdeaFallback);
      } finally {
        generateIdeasBtn.disabled = false;
        generateIdeasBtn.innerHTML = "Generate Project Ideas";
        lucide.createIcons();
      }
    });
  }

  // =========================================================
  // 2️⃣ AI ASSISTANT CHAT – Gemini via BACKEND (with fallback)
  // =========================================================

  const aiChatBox = document.getElementById("ai-chat-box");
  const aiUserInput = document.getElementById("ai-user-input");
  const aiSendBtn = document.getElementById("ai-send-btn");

  function appendChatMessage(sender, text) {
    if (!aiChatBox) return;
    const wrapper = document.createElement("div");
    wrapper.className =
      "flex mb-2 " + (sender === "user" ? "justify-end" : "justify-start");

    const bubble = document.createElement("div");
    bubble.className =
      "max-w-[80%] text-sm p-3 rounded-2xl chat-bubble " +
      (sender === "user"
        ? "user text-white rounded-br-none"
        : "ai text-gray-100 rounded-bl-none");

    bubble.innerHTML = text;
    wrapper.appendChild(bubble);
    aiChatBox.appendChild(wrapper);
    aiChatBox.scrollTop = aiChatBox.scrollHeight;
  }

  function getLocalAssistantReply(question) {
    const q = question.toLowerCase();

    if (q.includes("project") || q.includes("erp")) {
      return "Shivam has built a School ERP Management System, Fake News Detection using BERT, a Face Recognition Attendance System, and an AI Health Assistant. He also holds certifications in AI Foundations and Automation.";
    }
    if (q.includes("skill") || q.includes("stack") || q.includes("tech")) {
      return "Shivam is proficient in Python, C++, Java, C, HTML5, CSS3, Data Structures & Algorithms (DSA), and frameworks like Django, Node.js, FastAPI, TensorFlow, PyTorch, Keras, and Scikit-learn.";
    }
    if (q.includes("education") || q.includes("college") || q.includes("university") || q.includes("who")) {
      return "Shivam is an AI & Machine Learning student at LPU (graduating 2027) and a Data Analyst at Deccan AI. He specializes in fine-tuning LLMs and building intelligent systems that blend mathematical rigor with scalable AI solutions.";
    }
    if (q.includes("goal") || q.includes("career") || q.includes("future")) {
      return "Shivam's career goal is to design robust, ethical AI systems that solve complex real-world problems through mathematical reasoning and automated intelligence, empowering businesses and individuals globally.";
    }
    if (q.includes("outlier") || q.includes("job") || q.includes("experience") || q.includes("deccan")) {
      return "Shivam currently contributes to LLM training at Deccan AI and Outlier.ai. He focuses on data analysis, prompt engineering, and improving model reasoning/robustness through advanced reasoning tasks.";
    }
    if (q.includes("contact") || q.includes("reach")) {
      return "You can contact Shivam at <b>shivamyadav7745@gmail.com</b> or on LinkedIn: <a href='https://www.linkedin.com/in/shivam-yadav39/' target='_blank' class='underline text-sky-400'>linkedin.com/in/shivam-yadav39/</a>.";
    }
    return "I'm Shivam's portfolio assistant. Ask me about his skills, projects, education, experience, or how to contact him!";
  }

  async function askBackendAssistant(question) {
    // if (!BACKEND_URL) throw new Error("No backend configured");
    const res = await fetch(`${BACKEND_URL}/assistant`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
    if (!res.ok) throw new Error("Backend error");
    const data = await res.json(); // expected { answer: "..." }
    return data.answer;
  }

  async function handleAiQuestion() {
    if (!aiUserInput || !aiChatBox || !aiSendBtn) return;
    const text = aiUserInput.value.trim();
    if (!text) return;

    appendChatMessage("user", text);
    aiUserInput.value = "";
    aiSendBtn.disabled = true;

    // loading bubble
    const loadingId = "ai-loading-bubble-" + Date.now();
    appendChatMessage(
      "ai",
      `<span id="${loadingId}" class="inline-flex items-center gap-2">
        <span>Thinking</span>
        <span class="w-2 h-2 bg-sky-400 rounded-full animate-pulse inline-block"></span>
      </span>`
    );

    try {
      let answer;
      try {
        // Try real backend (Gemini)
        answer = await askBackendAssistant(text);
      } catch (e) {
        console.warn("Backend failed, using local fallback:", e.message);
        answer = getLocalAssistantReply(text);
      }

      // Remove loading bubble
      const el = document.getElementById(loadingId);
      if (el && el.parentElement && el.parentElement.parentElement) {
        el.parentElement.parentElement.remove();
      }

      appendChatMessage("ai", answer);
    } catch (err) {
      console.error(err);
      appendChatMessage(
        "ai",
        "Something went wrong while answering. Please try again."
      );
    } finally {
      aiSendBtn.disabled = false;
    }
  }

  if (aiSendBtn && aiUserInput) {
    aiSendBtn.addEventListener("click", handleAiQuestion);
    aiUserInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") handleAiQuestion();
    });
  }
});