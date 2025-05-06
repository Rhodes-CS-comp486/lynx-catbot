import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useSuggestions } from '@/hooks/useSuggestions';
import { useSuggestionTracker } from './hooks/useSuggestionTracker';
import { useChat } from '@/hooks/useChat';
import { motion, AnimatePresence } from 'framer-motion';
import SplashScreen from '@/components/SplashScreen'; // Import the new SplashScreen component

const ChatbotUI = () => {
  const [showSplash, setShowSplash] = useState(true);
  const { categories, subcategories, popularSuggestions, groupedSubcategories } = useSuggestions();
  const { messages, isLoading, handleSend } = useChat(categories, subcategories, popularSuggestions, groupedSubcategories);
  const [inputValue, setInputValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const { updatePopularSuggestions } = useSuggestionTracker();
  const messagesEndRef = useRef(null);
  const [showAllSuggestions, setShowAllSuggestions] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messageContainerRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // This will run after the splash screen animation completes
  const handleSplashComplete = () => {
    setShowSplash(false);
    setTimeout(() => setIsVisible(true), 300); // Start the main UI animation
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (showSuggestions) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [showSuggestions]);

  const handleSuggestionClick = (suggestion) => {
    const isCategory = categories.includes(suggestion);
    const isSubcategory = selectedCategory && groupedSubcategories[selectedCategory]?.includes(suggestion);
    const hasSubcategories = isCategory && groupedSubcategories[suggestion]?.length > 0;

    if (isCategory && hasSubcategories) {
      setSelectedCategory((prev) => (prev === suggestion ? null : suggestion));
    } else if (isSubcategory) {
      setSelectedSubcategory((prev) => (prev === suggestion ? null : suggestion));
    }

    handleSend(suggestion);
  };

  let suggestionList;
  if (selectedCategory && groupedSubcategories[selectedCategory]) {
    suggestionList = groupedSubcategories[selectedCategory];
  } else {
    suggestionList = [
      ...new Set([
        ...popularSuggestions.map((s) => s.suggestion_text),
        ...categories,
      ])
    ];
  }

  const displayedSuggestions = showAllSuggestions ? suggestionList : suggestionList.slice(0, 10);

  const handleKeyPress = (e) => {
    setShowSuggestions(false);

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setShowSuggestions(true);
    }, 10000);

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(inputValue);
      setInputValue("");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-800 p-4">
      {/* Show splash screen when showSplash is true */}
      {showSplash && (
        <SplashScreen onComplete={handleSplashComplete} />
      )}

      {/* Main UI will only animate in after splash screen is complete */}
      {!showSplash && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isVisible ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          <Card className="flex flex-col h-[90vh] w-full bg-white/30 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl overflow-hidden">
            <CardContent ref={messageContainerRef} className="flex-1 overflow-y-auto p-4 flex flex-col space-y-4">
              <AnimatePresence initial={false}>
                {messages.map((m) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChatMessage text={m.text} sender={m.sender} />
                  </motion.div>
                ))}
              </AnimatePresence>

              {isLoading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <LoadingSpinner />
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </CardContent>

            <AnimatePresence initial={false}>
              {showSuggestions && (
                <motion.div
                  key="suggestion-wrapper"
                  initial={false}
                  animate={{ opacity: showSuggestions ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  className={`transition-opacity duration-300 px-4 pb-3 min-h-[120px] ${showSuggestions ? 'pointer-events-auto' : 'pointer-events-none'
                    }`}
                >
                  <div className="flex flex-wrap gap-2 px-4 pb-3">
                    {selectedCategory ? (
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="w-full"
                      >
                        <div className="text-sm font-semibold mb-2 text-gray-600 ">
                          {selectedCategory} Subtopics
                        </div>
                        <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1">
                          {groupedSubcategories[selectedCategory].map((sub) => (
                            <motion.button
                              key={sub}
                              onClick={() => handleSuggestionClick(sub)}
                              whileTap={{ scale: 0.95 }}
                              className="px-3 py-1 rounded-full !bg-white !text-gray-800 hover:bg-blue-100 transition-all duration-200 shadow-sm"

                            >
                              {sub}
                            </motion.button>
                          ))}
                        </div>
                        <button
                          onClick={() => setSelectedCategory(null)}
                          className="text-sm !bg-white text-blue-600 underline mt-3"
                        >
                          Back to categories
                        </button>
                      </motion.div>
                    ) : (
                      displayedSuggestions.map((suggestion) => (
                        <motion.button
                          key={suggestion}
                          onClick={() => handleSuggestionClick(suggestion)}
                          whileTap={{ scale: 0.95 }}
                          className="px-3 py-1 rounded-full !bg-white !text-gray-800 hover:bg-blue-100 transition-all duration-200 shadow-sm"
                        >
                          {suggestion}
                        </motion.button>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <ChatInput
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onSend={() => {
                handleSend(inputValue);
                setInputValue("");
                setSelectedCategory(null);
              }}
              onKeyPress={handleKeyPress}
            />
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default ChatbotUI;