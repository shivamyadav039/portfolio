document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // Section reveal on scroll
    const sections = document.querySelectorAll('.section-reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => {
        observer.observe(section);
    });

    // Modal Logic
    const modal = document.getElementById('project-modal');
    const modalBackdrop = document.getElementById('modal-backdrop');
    const modalContent = document.getElementById('modal-content');
    
    const openModalBtn = document.querySelector('.open-modal-btn');
    const closeModalBtn = document.querySelector('.close-modal-btn');

    function openModal() {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
            modalBackdrop.classList.remove('opacity-0');
            modalBackdrop.classList.add('opacity-100');
            modalContent.classList.remove('scale-95', 'opacity-0');
            modalContent.classList.add('scale-100', 'opacity-100');
        }, 10);
    }

    function closeModal() {
        modalBackdrop.classList.remove('opacity-100');
        modalBackdrop.classList.add('opacity-0');
        modalContent.classList.remove('scale-100', 'opacity-100');
        modalContent.classList.add('scale-95', 'opacity-0');
        setTimeout(() => {
             modal.classList.add('hidden');
             modal.classList.remove('flex');
             document.body.style.overflow = 'auto';
        }, 300);
    }

    openModalBtn.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', closeModal);

    // --- Gemini API Integration ---

    // PASTE YOUR GEMINI API KEY HERE!
    const GEMINI_API_KEY = "AIzaSyA6Q6BPHEelwULqEa2NLtZKS50N1kyhUT8"; 

    async function callGemini(payload, maxRetries = 5) {
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
        let delay = 1000;
        for (let i = 0; i < maxRetries; i++) {
            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return await response.json();
            } catch (error) {
                if (i === maxRetries - 1) throw error;
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 2;
            }
        }
    }

    // 1. Project Idea Generator
    const generateIdeasBtn = document.getElementById('generate-ideas-btn');
    const ideasContainer = document.getElementById('project-ideas-container');

    generateIdeasBtn.addEventListener('click', async () => {
        generateIdeasBtn.disabled = true;
        generateIdeasBtn.innerHTML = `<span class="flex items-center justify-center"><i data-lucide="loader-2" class="animate-spin mr-2"></i> Generating...</span>`;
        lucide.createIcons();

        const userQuery = "Based on the profile of an AI/ML engineering student skilled in Python, PyTorch, BERT, and NLP who has completed a fake news detection project, generate three unique and innovative project ideas. For each project, provide a 'title' and a brief 'description' (2-3 sentences).";
        const payload = {
            contents: [{ parts: [{ text: userQuery }] }],
            systemInstruction: { parts: [{ text: "You are an expert AI/ML project ideation assistant." }] },
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: "OBJECT", properties: {
                        projects: { type: "ARRAY", items: {
                            type: "OBJECT", properties: {
                                title: { type: "STRING" },
                                description: { type: "STRING" }
                            }, required: ["title", "description"]
                        }}
                    }, required: ["projects"]
                }
            }
        };

        try {
            const result = await callGemini(payload);
            const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
                const parsedJson = JSON.parse(text);
                displayProjectIdeas(parsedJson.projects);
            } else {
                ideasContainer.innerHTML = '<p class="text-red-400">Sorry, I couldn\'t generate ideas right now. Please try again later.</p>';
            }
        } catch (error) {
            console.error("Error generating project ideas:", error);
            ideasContainer.innerHTML = '<p class="text-red-400">An error occurred while generating ideas.</p>';
        } finally {
            generateIdeasBtn.disabled = false;
            generateIdeasBtn.innerHTML = 'Generate Project Ideas';
        }
    });

    function displayProjectIdeas(projects) {
        ideasContainer.innerHTML = '';
        projects.forEach(project => {
            const projectEl = document.createElement('div');
            projectEl.className = 'glass-effect rounded-lg p-6 mb-4 transition-all duration-300 border border-transparent hover:border-[#007aff]';
            projectEl.innerHTML = `
                <h4 class="text-xl font-semibold text-white mb-2">${project.title}</h4>
                <p class="text-gray-400">${project.description}</p>
            `;
            ideasContainer.appendChild(projectEl);
        });
    }
    
    // 2. AI Assistant
    const aiChatBox = document.getElementById('ai-chat-box');
    const aiUserInput = document.getElementById('ai-user-input');
    const aiSendBtn = document.getElementById('ai-send-btn');

    async function askAiAssistant() {
        const userQuery = aiUserInput.value.trim();
        if (!userQuery) return;

        appendMessage(userQuery, 'user');
        aiUserInput.value = '';
        aiSendBtn.disabled = true;
        appendMessage('<i data-lucide="loader-2" class="animate-spin"></i>', 'ai', true);

        const systemPrompt = `You are a helpful and professional AI assistant for Shivam Yadav's portfolio website. Answer questions based ONLY on the following information. Be concise and friendly. If a question is outside this scope, politely decline to answer.
            - Name: Shivam Yadav
            - Role: AI & Machine Learning Engineer, specializing in Natural Language Processing (NLP).
            - Education: Pursuing a Bachelor of Technology in Computer Science & Engineering (AI & ML) at Lovely Professional University, expected graduation in 2026.
            - Key Project: 'Fake News Detection using NLP'. The project's goal was to classify news articles as real or fake. He used Python, PyTorch, and the BERT model, achieving a validation accuracy of approximately 92%.
            - Core Skills: Python, PyTorch, Scikit-learn, Natural Language Processing (NLP), BERT, Pandas, Git, GitHub, and general Machine Learning principles.`;

        const payload = {
            contents: [{ parts: [{ text: userQuery }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] },
        };

        try {
            const result = await callGemini(payload);
            const responseText = result.candidates?.[0]?.content?.parts?.[0]?.text;
            document.getElementById('ai-loading-indicator')?.remove();
            if (responseText) {
                appendMessage(responseText, 'ai');
            } else {
                appendMessage("Sorry, I couldn't process that. Please try again.", 'ai');
            }
        } catch (error) {
             console.error("Error with AI Assistant:", error);
             document.getElementById('ai-loading-indicator')?.remove();
             appendMessage("Apologies, I'm having trouble connecting right now.", 'ai');
        } finally {
            aiSendBtn.disabled = false;
        }
    }

    function appendMessage(content, sender, isLoading = false) {
        const messageWrapper = document.createElement('div');
        messageWrapper.className = `flex mb-2 ${sender === 'user' ? 'justify-end' : 'justify-start'}`;
        const messageEl = document.createElement('div');
        messageEl.className = `max-w-[80%] p-3 rounded-lg ${sender === 'user' ? 'bg-[#007aff] text-white' : 'bg-gray-700 text-gray-200'}`;
        if (isLoading) messageEl.id = 'ai-loading-indicator';
        messageEl.innerHTML = content;
        messageWrapper.appendChild(messageEl);
        aiChatBox.appendChild(messageWrapper);
        lucide.createIcons();
        aiChatBox.scrollTop = aiChatBox.scrollHeight;
    }

    aiSendBtn.addEventListener('click', askAiAssistant);
    aiUserInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') askAiAssistant(); });
});
document.addEventListener("DOMContentLoaded", () => {
    // ===== Mobile Menu =====
    const menuBtn = document.getElementById("mobile-menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");
  
    if (menuBtn) {
      menuBtn.addEventListener("click", () => {
        mobileMenu.classList.toggle("hidden");
      });
    }
  
    // ===== Lucide Icons =====
    if (window.lucide) {
      lucide.createIcons();
    }
  
    // ===== Section Reveal on Scroll =====
    const reveals = document.querySelectorAll(".section-reveal");
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.15 }
    );
    reveals.forEach((section) => revealObserver.observe(section));
  
    // ===== Modal =====
    const modal = document.getElementById("project-modal");
    const backdrop = document.getElementById("modal-backdrop");
    const content = document.getElementById("modal-content");
    const openBtns = document.querySelectorAll(".open-modal-btn");
    const closeBtns = document.querySelectorAll(".close-modal-btn");
  
    openBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        modal.classList.add("active");
        setTimeout(() => {
          backdrop.style.opacity = "1";
          content.style.opacity = "1";
          content.style.transform = "scale(1)";
        }, 10);
      });
    });
  
    closeBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        backdrop.style.opacity = "0";
        content.style.opacity = "0";
        content.style.transform = "scale(0.95)";
        setTimeout(() => modal.classList.remove("active"), 300);
      });
    });
  
    if (backdrop) {
      backdrop.addEventListener("click", () => {
        closeBtns[0]?.click();
      });
    }
  
    // ===== Generate Project Ideas (Mock Example) =====
    const generateBtn = document.getElementById("generate-ideas-btn");
    const ideasContainer = document.getElementById("project-ideas-container");
  
    if (generateBtn) {
      generateBtn.addEventListener("click", () => {
        const ideas = [
          "AI-driven Resume Analyzer using NLP",
          "Smart Health Chatbot for Early Diagnosis",
          "AI-based Legal Contract Summarizer",
          "Fake News Detection with Multi-lingual Support",
          "AI Assistant for HR Policy Compliance"
        ];
  
        ideasContainer.innerHTML = `
          <ul class="list-disc pl-6 space-y-2 text-gray-300">
            ${ideas.map((idea) => `<li>${idea}</li>`).join("")}
          </ul>
        `;
      });
    }
  
    // ===== AI Assistant Chat (Mock Example) =====
    const chatBox = document.getElementById("ai-chat-box");
    const userInput = document.getElementById("ai-user-input");
    const sendBtn = document.getElementById("ai-send-btn");
  
    function appendMessage(sender, text) {
      const msg = document.createElement("div");
      msg.className = sender === "AI" ? "text-gray-400 mb-2" : "text-[#007aff] mb-2";
      msg.textContent = `${sender}: ${text}`;
      chatBox.appendChild(msg);
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  
    if (sendBtn) {
      sendBtn.addEventListener("click", () => {
        const question = userInput.value.trim();
        if (!question) return;
        appendMessage("You", question);
        userInput.value = "";
  
        // Simple mock response
        setTimeout(() => {
          appendMessage("AI", "That's a great question! Shivam specializes in NLP, BERT, and ML projects.");
        }, 800);
      });
    }
  });
  