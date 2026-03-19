require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Serve static files from root


// ====== Gemini Setup ======
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// ========== ROUTE: Project Ideas ==========
app.post("/ideas", async (req, res) => {
  try {
    const prompt =
      "Based on an AI/ML student skilled in Python, PyTorch, NLP and BERT " +
      "who has built a Fake News Detection project, generate three project ideas. " +
      "Return ONLY valid JSON of the form: {\"projects\": [{\"title\":\"...\",\"description\":\"...\"}, ...]}";

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    let json;

    try {
      json = JSON.parse(text);
    } catch {
      // if Gemini wraps it in ```json ... ```
      const cleaned = text.replace(/```json|```/g, "").trim();
      json = JSON.parse(cleaned);
    }

    res.json(json);
  } catch (err) {
    console.error("Error in /ideas:", err);
    res.status(500).json({ error: "Failed to generate ideas" });
  }
});

// ========== ROUTE: AI Assistant ==========
app.post("/assistant", async (req, res) => {
  try {
    const question = req.body.question || "";

    const systemPrompt = `
You are a helpful portfolio assistant for Shivam Yadav.
Answer based ONLY on this info and keep it short and friendly:

- Name: Shivam Yadav
- Role: AI & Machine Learning Engineer (NLP-focused)
- Education: B.Tech CSE (AI & ML), Lovely Professional University, Punjab (Expected 2026)
- Experience: Math Trainee @ Outlier.ai (advanced math & reasoning for LLM training)
- Key Projects:
  - School ERP Management System (Node.js, Express, MongoDB)
  - Fake News Detection using BERT (Python, PyTorch, NLP)
  - Face Recognition Attendance System (OpenCV, Tkinter)
  - AI Medical Health Assistant (NLP + Streamlit, in progress)
- Skills: Python, C++, Java, C, SQL, TensorFlow, PyTorch, OpenCV, Scikit-learn, LangChain, FastAPI, MongoDB, Node.js, Git, GitHub
- Contact: Email - shivamyadav7745@gmail.com, LinkedIn - linkedin.com/in/shivam-yadav39

If question is outside this scope, reply:
"I'm only trained on Shivam's profile, projects and skills. I can't answer that."
`;

    const result = await model.generateContent([
      { role: "user", parts: [{ text: systemPrompt + "\n\nUser: " + question }] },
    ]);

    const answer = result.response.text();
    res.json({ answer });
  } catch (err) {
    console.error("Error in /assistant:", err);
    res.status(500).json({ error: "Failed to generate answer" });
  }
});

// ========== START SERVER ==========
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("Shivam portfolio backend listening on port", PORT);
});