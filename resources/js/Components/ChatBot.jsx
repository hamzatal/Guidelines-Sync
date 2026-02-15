import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, MessageCircle, Brain, BookOpen } from "lucide-react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

const ChatBot = ({ isChatOpen, toggleChat }) => {
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      text: "مرحبًا، أنا مساعد Guidelines Sync لمساعدتك في تنسيق رسالتك حسب قواعد المجلة.",
      sender: "bot",
      language: "ar",
    },
    {
      text: "Hi, I'm the Guidelines Sync assistant. Ask me anything about formatting your thesis or manuscript for your target journal.",
      sender: "bot",
      language: "en",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const detectLanguage = (message) => {
    return /[ء-ي]/.test(message) ? "ar" : "en";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();
    const userLanguage = detectLanguage(userMessage);
    setCurrentLanguage(userLanguage);

    setMessages((prev) => [
      ...prev,
      { text: userMessage, sender: "user", language: userLanguage },
    ]);
    setInputMessage("");
    setIsLoading(true);

    try {
      await axios.get("/sanctum/csrf-cookie");
      const response = await axios.post("/chatbot", {
        message: userMessage,
      });

      // توحيد شكل الأخطاء من الباك إند
      if (response.data.status === "error") {
        const errorMessage =
          userLanguage === "ar"
            ? "عذراً، تعذر الحصول على رد من المساعد الآن. حاول مرة أخرى بعد قليل."
            : "Sorry, the assistant could not respond right now. Please try again in a moment.";

        setMessages((prev) => [
          ...prev,
          { text: errorMessage, sender: "bot", language: userLanguage },
        ]);
      } else {
        const botMessage = response.data.response;
        const botLanguage = response.data.language || userLanguage;

        const botText =
          typeof botMessage === "string"
            ? botMessage
            : JSON.stringify(botMessage);

        setMessages((prev) => [
          ...prev,
          {
            text: botText,
            sender: "bot",
            language: botLanguage,
          },
        ]);
      }
    } catch (error) {
      console.error("Error:", error);
      const fallback =
        userLanguage === "ar"
          ? "عذرًا، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى بعد قليل."
          : "Sorry, a connection error occurred. Please try again shortly.";
      setMessages((prev) => [
        ...prev,
        {
          text: fallback,
          sender: "bot",
          language: userLanguage,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = async (suggestion) => {
    const suggestionText =
      suggestion.text[currentLanguage] || suggestion.text.en;

    setMessages((prev) => [
      ...prev,
      { text: suggestionText, sender: "user", language: currentLanguage },
    ]);
    setIsLoading(true);

    try {
      await axios.get("/sanctum/csrf-cookie");
      const response = await axios.post("/chatbot", {
        message:
          suggestion.prompt[currentLanguage] || suggestion.prompt.en,
      });

      if (response.data.status === "error") {
        const errorMessage =
          currentLanguage === "ar"
            ? "عذراً، تعذر الحصول على رد من المساعد الآن. حاول مرة أخرى بعد قليل."
            : "Sorry, the assistant could not respond right now. Please try again in a moment.";

        setMessages((prev) => [
          ...prev,
          { text: errorMessage, sender: "bot", language: currentLanguage },
        ]);
      } else {
        const botMessage = response.data.response;
        const botLanguage = response.data.language || currentLanguage;

        const botText =
          typeof botMessage === "string"
            ? botMessage
            : JSON.stringify(botMessage);

        setMessages((prev) => [
          ...prev,
          {
            text: botText,
            sender: "bot",
            language: botLanguage,
          },
        ]);
      }
    } catch (error) {
      console.error("Error:", error);
      const fallback =
        currentLanguage === "ar"
          ? "عذرًا، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى بعد قليل."
          : "Sorry, a connection error occurred. Please try again shortly.";
      setMessages((prev) => [
        ...prev,
        {
          text: fallback,
          sender: "bot",
          language: currentLanguage,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const formatMessage = (messageText) => {
    return (
      <div className="text-slate-100 text-sm leading-relaxed">
        <ReactMarkdown
          components={{
            h1: ({ node, ...props }) => (
              <h1 className="text-base font-semibold mt-2 mb-1 text-slate-50" {...props} />
            ),
            h2: ({ node, ...props }) => (
              <h2 className="text-sm font-semibold mt-2 mb-1 text-slate-100" {...props} />
            ),
            h3: ({ node, ...props }) => (
              <h3 className="text-xs font-semibold mt-1 mb-1 text-slate-200" {...props} />
            ),
            p: ({ node, ...props }) => (
              <p className="mb-1.5 text-[13px] text-slate-100" {...props} />
            ),
            ul: ({ node, ...props }) => (
              <ul className="list-disc pl-4 mb-1.5 space-y-1" {...props} />
            ),
            li: ({ node, ...props }) => (
              <li className="text-[13px]" {...props} />
            ),
            strong: ({ node, ...props }) => (
              <strong className="font-semibold text-sky-300" {...props} />
            ),
            code: ({ node, ...props }) => (
              <code
                className="bg-slate-800/80 px-1 py-0.5 rounded text-xs font-mono text-sky-200"
                {...props}
              />
            ),
          }}
        >
          {messageText}
        </ReactMarkdown>
      </div>
    );
  };

  const suggestions = [
    {
      text: { en: "Citation styles", ar: "أنماط الاقتباس" },
      prompt: {
        en: "What citation styles does Guidelines Sync support?",
        ar: "ما هي أنماط الاقتباس التي يدعمها Guidelines Sync؟",
      },
    },
    {
      text: { en: "Journal rules", ar: "قواعد المجلات" },
      prompt: {
        en: "How can Guidelines Sync help me match my thesis to a journal's formatting rules?",
        ar: "كيف يساعدني Guidelines Sync في مطابقة رسالتي مع قواعد تنسيق مجلة معينة؟",
      },
    },
    {
      text: { en: "Upload files", ar: "رفع الملفات" },
      prompt: {
        en: "What file formats can I upload to Guidelines Sync?",
        ar: "ما هي صيغ الملفات التي يمكن رفعها في Guidelines Sync؟",
      },
    },
    {
      text: { en: "Get started", ar: "كيف أبدأ" },
      prompt: {
        en: "How do I start using Guidelines Sync to format my thesis or dissertation?",
        ar: "كيف أبدأ باستخدام Guidelines Sync لتنسيق رسالتي أو أطروحتي؟",
      },
    },
  ];

  return (
    <>
      {/* زر الشات العائم - دارك وبسيط */}
      <motion.button
        onClick={toggleChat}
        whileHover={{ y: -3, boxShadow: "0 14px 35px rgba(15,23,42,0.6)" }}
        whileTap={{ scale: 0.97 }}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-slate-900/90 border border-slate-700 px-4 py-2 shadow-xl backdrop-blur-sm hover:border-sky-400 transition-colors"
      >
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-sky-500 text-white">
          <MessageCircle className="w-4 h-4" />
        </div>
        <div className="hidden sm:flex flex-col items-start">
          <span className="text-xs font-semibold text-slate-50">
            Research Assistant
          </span>
          <span className="text-[11px] text-slate-400">
            Formatting & journals support
          </span>
        </div>
      </motion.button>

      {/* نافذة الشات - دارك مود */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
            className="fixed bottom-20 right-4 sm:right-6 z-50 w-[360px] max-w-[95vw] h-[540px] sm:h-[580px] flex flex-col bg-slate-950/95 border border-slate-800 rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.85)] overflow-hidden backdrop-blur-md"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/90">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-500 flex items-center justify-center text-white">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-50">
                    Guidelines Sync Assistant
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    {currentLanguage === "ar"
                      ? "متصل لمساعدتك في تنسيق الرسائل"
                      : "Online to help with formatting"}
                  </span>
                </div>
              </div>
              <button
                onClick={toggleChat}
                className="p-1 rounded-md text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-950">
              {messages
                .filter(
                  (msg) =>
                    !msg.language || msg.language === currentLanguage
                )
                .map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${
                      msg.sender === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    {msg.sender === "bot" && (
                      <div className="mr-2 mt-1 flex-shrink-0 w-7 h-7 rounded-full bg-sky-500 text-white flex items-center justify-center">
                        <Brain className="w-4 h-4" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                        msg.sender === "user"
                          ? "bg-sky-600 text-slate-50 rounded-br-sm"
                          : "bg-slate-900/90 text-slate-100 border border-slate-800 rounded-bl-sm"
                      }`}
                      dir={msg.language === "ar" ? "rtl" : "ltr"}
                    >
                      {formatMessage(msg.text)}
                    </div>
                  </div>
                ))}

              {isLoading && (
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <div className="w-6 h-6 rounded-full bg-sky-500 text-white flex items-center justify-center mr-1">
                    <Brain className="w-3 h-3 animate-pulse" />
                  </div>
                  <span>
                    {currentLanguage === "ar"
                      ? "يعمل على إعداد الرد..."
                      : "Preparing an answer..."}
                  </span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            <div className="px-4 py-2 border-t border-slate-800 bg-slate-900/90">
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSuggestionClick(s)}
                    className="text-[11px] px-3 py-1 rounded-full border border-slate-700 text-slate-200 bg-slate-900 hover:bg-sky-900/50 hover:border-sky-500 hover:text-sky-200 transition-colors"
                  >
                    {s.text[currentLanguage] || s.text.en}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="px-4 py-3 border-t border-slate-800 bg-slate-950/90"
            >
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    currentLanguage === "ar"
                      ? "اكتب سؤالك حول التنسيق أو المجلات..."
                      : "Ask about formatting or journal rules..."
                  }
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-800 bg-slate-900 text-sm text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                  dir={currentLanguage === "ar" ? "rtl" : "ltr"}
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-sky-500 text-white hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;
