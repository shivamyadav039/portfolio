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
  const openModalBtns = document.querySelectorAll(".open-modal-btn");
  const closeModalBtns = document.querySelectorAll(".close-modal-btn");

  function openModal() {
    if (!modal || !modalBackdrop || !modalContent) return;
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

  openModalBtns.forEach((btn) => btn.addEventListener("click", openModal));
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
    if (!BACKEND_URL) throw new Error("No backend yet");
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
      return "Shivam has built a School ERP Management System, Fake News Detection using BERT, a Face Recognition Attendance System, and an AI Health Assistant (in progress).";
    }
    if (q.includes("skill") || q.includes("stack") || q.includes("tech")) {
      return "Shivam works with Python, C++, Java, C, SQL, TensorFlow, PyTorch, OpenCV, Scikit-learn, LangChain, FastAPI, MongoDB, Node.js, and more.";
    }
    if (q.includes("education") || q.includes("college") || q.includes("university")) {
      return "Shivam is pursuing B.Tech CSE with specialization in AI & ML at Lovely Professional University, Punjab (expected graduation: 2026).";
    }
    if (q.includes("outlier") || q.includes("job") || q.includes("experience")) {
      return "Shivam is a Math Trainee at Outlier.ai, solving advanced math and reasoning tasks to help train large language models.";
    }
    if (q.includes("contact") || q.includes("reach")) {
      return "You can contact Shivam at <b>shivamyadav7745@gmail.com</b> or on LinkedIn: <a href='https://www.linkedin.com/in/shivam-yadav39/' target='_blank' class='underline text-sky-400'>linkedin.com/in/shivam-yadav39/</a>.";
    }
    return "I'm Shivam's portfolio assistant. Ask me about his skills, projects, education, experience, or how to contact him!";
  }

  async function askBackendAssistant(question) {
    if (!BACKEND_URL) throw new Error("No backend configured");
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