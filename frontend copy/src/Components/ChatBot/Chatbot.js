import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import chatbotMessages from "../../Components/ChatBot/messages";
import assistantAvatar from "../../assets/assistant.png";
import chatbotIcon from "../../assets/assistant.png";
import {
  FaTimes,
  FaPaperPlane,
  FaUser,
  FaCapsules,
  FaHeartbeat,
  FaCommentMedical,
  FaBook,
  FaLightbulb,
  FaChartLine,
  FaCog,
  FaHistory,
} from "react-icons/fa";
import { motion } from "framer-motion";

const Chatbot = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [userPreferences, setUserPreferences] = useState({
    learningStyle: "visual",
    expertiseLevel: "beginner",
    interests: [],
  });
  const [showPreferences, setShowPreferences] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const divRef = useRef(null);

  // Load chat history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem("chatHistory");
    if (savedHistory) {
      setMessages(JSON.parse(savedHistory));
    }

    const savedPrefs = localStorage.getItem("userPreferences");
    if (savedPrefs) {
      setUserPreferences(JSON.parse(savedPrefs));
    }
  }, []);

  // Save chat history to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chatHistory", JSON.stringify(messages));
    }
  }, [messages]);

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getResponse = async (input) => {
    // Check predefined messages first
    const message = chatbotMessages.find(
      (msg) => msg.prompt.toLowerCase() === input.toLowerCase()
    )?.message;

    if (message) {
      return message;
    }

    // Check for learning style preferences
    if (input.toLowerCase().includes("how should i learn")) {
      return `Based on your ${
        userPreferences.learningStyle
      } learning style, I recommend ${
        userPreferences.learningStyle === "visual"
          ? "watching video tutorials and using diagrams."
          : userPreferences.learningStyle === "auditory"
          ? "listening to podcasts or discussing concepts with others."
          : "hands-on practice and interactive exercises."
      }`;
    }

    // Check for quiz request
    if (
      input.toLowerCase().includes("quiz me") ||
      input.toLowerCase().includes("give me a quiz")
    ) {
      return generateQuizQuestion();
    }

    try {
      // Enhanced prompt with user context
      const enhancedPrompt = `User is a ${
        userPreferences.expertiseLevel
      } with interests in ${
        userPreferences.interests.join(", ") || "various topics"
      }. 
      They prefer ${
        userPreferences.learningStyle
      } learning. Respond to this: ${input}`;

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyAYlbY24NVBEmXcTuoJj-7BMqFF0V99q18`,
        {
          contents: [{ parts: [{ text: enhancedPrompt }] }],
        }
      );
      return (
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "I'm not sure how to respond to that."
      );
    } catch (error) {
      console.error("Error fetching response:", error);
      return "Sorry, I'm having trouble responding right now.";
    }
  };

  const generateQuizQuestion = () => {
    const questions = [
      {
        question: "What's the most effective way to learn complex concepts?",
        options: [
          "Memorization",
          "Breaking them into smaller parts",
          "Avoiding them",
          "Only reading about them",
        ],
        answer: 1,
        explanation:
          "Breaking complex concepts into smaller, manageable parts makes them easier to understand and remember.",
      },
      {
        question: "Which technique helps with long-term retention?",
        options: [
          "Cramming",
          "Spaced repetition",
          "Only listening once",
          "Avoiding practice",
        ],
        answer: 1,
        explanation:
          "Spaced repetition involves reviewing material at increasing intervals, which significantly improves retention.",
      },
    ];

    const randomQuestion =
      questions[Math.floor(Math.random() * questions.length)];
    return `QUIZ: ${
      randomQuestion.question
    }\n\nOptions:\n${randomQuestion.options
      .map((opt, i) => `${i + 1}. ${opt}`)
      .join("\n")}\n\nReply with the number of the correct answer!`;
  };

  const handleScrollToBottom = () => {
    if (divRef.current) {
      setTimeout(() => {
        divRef.current.scrollTop = divRef.current.scrollHeight;
      }, 100);
    }
  };

  const sendMessage = async (messageText) => {
    const userMessage = {
      text: messageText,
      fromUser: true,
      time: getCurrentTime(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    const botResponseText = await getResponse(messageText);
    const botMessage = {
      text: botResponseText,
      fromUser: false,
      time: getCurrentTime(),
    };

    setMessages((prev) => [...prev, botMessage]);
    setLoading(false);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const messageToSend = input;
    setInput("");
    await sendMessage(messageToSend);
  };

  const handleQuickAction = async (text) => {
    await sendMessage(text);
  };

  const updatePreferences = (key, value) => {
    const newPrefs = { ...userPreferences };
    if (Array.isArray(newPrefs[key])) {
      // Toggle array values
      const index = newPrefs[key].indexOf(value);
      if (index === -1) {
        newPrefs[key].push(value);
      } else {
        newPrefs[key].splice(index, 1);
      }
    } else {
      newPrefs[key] = value;
    }

    setUserPreferences(newPrefs);
    localStorage.setItem("userPreferences", JSON.stringify(newPrefs));
  };

  const clearChatHistory = () => {
    setMessages([]);
    localStorage.removeItem("chatHistory");
  };

  useEffect(() => {
    handleScrollToBottom();
  }, [messages]);

  return (
    <>
      {!isChatbotOpen && (
        <motion.div
          onClick={() => setIsChatbotOpen(true)}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            cursor: "pointer",
            zIndex: 50,
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <img
            src={chatbotIcon}
            alt="Chat Icon"
            style={{
              width: "128px",
              height: "144px",
              borderRadius: "50%",
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}
          />
        </motion.div>
      )}

      <div
        style={{
          position: "fixed",
          bottom: 0,
          right: 0,
          maxWidth: "28rem",
          width: "100%",
          height: "600px",
          zIndex: 50,
          transition: "transform 300ms ease-in-out",
          transform: isChatbotOpen ? "translateY(0)" : "translateY(100%)",
        }}
      >
        <div
          style={{
            backgroundColor: "#ffffff",
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            borderRadius: "1.5rem 1.5rem 0 0",
            border: "1px solid #e5e7eb",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              background: "linear-gradient(to right, #0284c7, #0e7490)",
              padding: "1rem 1.25rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              color: "#ffffff",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <img
                src={assistantAvatar}
                style={{ width: "40px", height: "40px", borderRadius: "50%" }}
                alt="Bot"
              />
              <div
                style={{
                  fontWeight: 600,
                  fontSize: "1.125rem",
                  letterSpacing: "0.025em",
                }}
              >
                LearnBot Assistant
              </div>
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => setShowHistory(!showHistory)}
                style={{ color: "#ffffff", opacity: 0.8 }}
                title="Chat History"
              >
                <FaHistory />
              </button>
              <button
                onClick={() => setShowPreferences(!showPreferences)}
                style={{ color: "#ffffff", opacity: 0.8 }}
                title="Preferences"
              >
                <FaCog />
              </button>
              <button
                onClick={() => setIsChatbotOpen(false)}
                style={{ color: "#ffffff", opacity: 0.8 }}
              >
                <FaTimes />
              </button>
            </div>
          </div>

          {/* Preferences Panel */}
          {showPreferences && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                backgroundColor: "#f3f4f6",
                padding: "1rem",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              <h3 style={{ fontWeight: 600, marginBottom: "0.5rem" }}>
                Learning Preferences
              </h3>

              <div style={{ marginBottom: "0.75rem" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    marginBottom: "0.25rem",
                  }}
                >
                  Learning Style
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  {["visual", "auditory", "kinesthetic"].map((style) => (
                    <button
                      key={style}
                      onClick={() => updatePreferences("learningStyle", style)}
                      style={{
                        padding: "0.25rem 0.75rem",
                        fontSize: "0.75rem",
                        borderRadius: "9999px",
                        backgroundColor:
                          userPreferences.learningStyle === style
                            ? "#059669"
                            : "#ffffff",
                        color:
                          userPreferences.learningStyle === style
                            ? "#ffffff"
                            : "#374151",
                      }}
                    >
                      {style.charAt(0).toUpperCase() + style.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: "0.75rem" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    marginBottom: "0.25rem",
                  }}
                >
                  Expertise Level
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  {["beginner", "intermediate", "advanced"].map((level) => (
                    <button
                      key={level}
                      onClick={() => updatePreferences("expertiseLevel", level)}
                      style={{
                        padding: "0.25rem 0.75rem",
                        fontSize: "0.75rem",
                        borderRadius: "9999px",
                        backgroundColor:
                          userPreferences.expertiseLevel === level
                            ? "#059669"
                            : "#ffffff",
                        color:
                          userPreferences.expertiseLevel === level
                            ? "#ffffff"
                            : "#374151",
                      }}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    marginBottom: "0.25rem",
                  }}
                >
                  Interests
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {["science", "technology", "languages", "history", "art"].map(
                    (interest) => (
                      <button
                        key={interest}
                        onClick={() => updatePreferences("interests", interest)}
                        style={{
                          padding: "0.25rem 0.75rem",
                          fontSize: "0.75rem",
                          borderRadius: "9999px",
                          backgroundColor: userPreferences.interests.includes(
                            interest
                          )
                            ? "#059669"
                            : "#ffffff",
                          color: userPreferences.interests.includes(interest)
                            ? "#ffffff"
                            : "#374151",
                        }}
                      >
                        {interest.charAt(0).toUpperCase() + interest.slice(1)}
                      </button>
                    )
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* History Panel */}
          {showHistory && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                backgroundColor: "#f3f4f6",
                padding: "1rem",
                borderBottom: "1px solid #e5e7eb",
                maxHeight: "160px",
                overflowY: "auto",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "0.5rem",
                }}
              >
                <h3 style={{ fontWeight: 600 }}>Chat History</h3>
                <button
                  onClick={clearChatHistory}
                  style={{
                    fontSize: "0.75rem",
                    color: "#dc2626",
                  }}
                >
                  Clear History
                </button>
              </div>
              {messages.length === 0 ? (
                <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                  No history yet
                </p>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  {messages
                    .filter((m) => m.fromUser)
                    .slice(-5)
                    .map((msg, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          setInput(msg.text);
                          setShowHistory(false);
                        }}
                        style={{
                          fontSize: "0.875rem",
                          padding: "0.5rem",
                          backgroundColor: "#ffffff",
                          borderRadius: "0.375rem",
                          cursor: "pointer",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {msg.text}
                      </div>
                    ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Chat Body */}
          <div
            ref={divRef}
            style={{
              flex: 1,
              backgroundColor: "#f9fafb",
              padding: "0.75rem 1rem",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            {/* Welcome Banner */}
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  backgroundColor: "#d1fae5",
                  color: "#065f46",
                  padding: "1rem",
                  borderRadius: "0.75rem",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  textAlign: "center",
                  boxShadow:
                    "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                }}
              >
                👋 Welcome to <strong>LearnBot</strong> <br />
                Your personalized learning assistant ready to help!
              </motion.div>
            )}

            {/* Quick Action Buttons */}
            {messages.length === 0 && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  paddingTop: "8px",
                }}
              >
                <button
                  onClick={() =>
                    handleQuickAction("Suggest learning resources")
                  }
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "0.5rem 1rem",
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.5rem",
                    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                    fontSize: "0.875rem",
                  }}
                >
                  <FaBook /> Suggest learning resources
                </button>
                <button
                  onClick={() => handleQuickAction("Give me a learning tip")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "0.5rem 1rem",
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.5rem",
                    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                    fontSize: "0.875rem",
                  }}
                >
                  <FaLightbulb /> Get a learning tip
                </button>
                <button
                  onClick={() => handleQuickAction("Quiz me on a random topic")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "0.5rem 1rem",
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.5rem",
                    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                    fontSize: "0.875rem",
                  }}
                >
                  <FaChartLine /> Take a quick quiz
                </button>
              </div>
            )}

            {/* Messages */}
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  justifyContent: msg.fromUser ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    padding: "0.75rem",
                    borderRadius: "1rem",
                    maxWidth: "75%",
                    fontSize: "0.875rem",
                    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                    backgroundColor: msg.fromUser ? "#e5e7eb" : "#075985",
                    color: msg.fromUser ? "#111827" : "#ffffff",
                  }}
                >
                  {msg.text.split("\n").map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                  <p
                    style={{
                      fontSize: "10px",
                      marginTop: "4px",
                      textAlign: "right",
                      opacity: 0.6,
                    }}
                  >
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div
                  style={{
                    backgroundColor: "#164e63",
                    color: "#ffffff",
                    padding: "0.5rem 1rem",
                    borderRadius: "0.5rem",
                    fontSize: "0.875rem",
                    animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                  }}
                >
                  Typing...
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "0.75rem 1rem",
              borderTop: "1px solid #e5e7eb",
              backgroundColor: "#ffffff",
            }}
          >
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              style={{
                flex: 1,
                padding: "0.5rem 1rem",
                fontSize: "0.875rem",
                backgroundColor: "#f3f4f6",
                border: "1px solid #d1d5db",
                borderRadius: "0.5rem",
                outline: "none",
              }}
            />
            <button
              onClick={handleSend}
              style={{
                padding: "0.75rem",
                backgroundColor: "#1e293b",
                color: "#ffffff",
                borderRadius: "9999px",
                boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
              }}
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
