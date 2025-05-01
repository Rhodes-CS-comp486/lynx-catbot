import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import Suggestions from '@/components/Suggestions';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useSuggestions } from '@/hooks/useSuggestions';
import { useSuggestionTracker } from './hooks/useSuggestionTracker';
import { useChat } from '@/hooks/useChat';
import { motion, AnimatePresence } from 'framer-motion';

const ChatbotUI = () => {
  const { categories, subcategories, popularSuggestions, groupedSubcategories } = useSuggestions();
  const { messages, isLoading, handleSend } = useChat(categories, subcategories, popularSuggestions, groupedSubcategories);
  const [inputValue, setInputValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [request, setRequest] = useState<Request[]>([]);
  const { updatePopularSuggestions } = useSuggestionTracker();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // React.useEffect(() => {
  //   console.log(groupedSubcategories)
  // }, [groupedSubcategories]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSuggestionClick = (suggestion: string) => {
    const isCategory = categories.includes(suggestion);
    const isSubcategory = selectedCategory && groupedSubcategories[selectedCategory]?.includes(suggestion);
    const hasSubcategories = isCategory && groupedSubcategories[suggestion]?.length > 0;

    if (isCategory && hasSubcategories) {
      setSelectedCategory((prev) => (prev === suggestion ? null : suggestion));
    } else if (isSubcategory) {
      setSelectedSubcategory((prev) => (prev === suggestion ? null : suggestion));
    }
    // updatePopularSuggestions(suggestion);
    handleSend(suggestion)

    // setTimeout(() => {
    //   setSelectedCategory(null);
    //   setSelectedSubcategory(null);
    // }, 5000);
  }

  let suggestionList: string[];
  if (selectedCategory && groupedSubcategories[selectedCategory]) {
    suggestionList = groupedSubcategories[selectedCategory];
  } else {
    suggestionList = [
      ...new Set([
        ...popularSuggestions.map((s: any) => s.suggestion_text),
        ...categories,
      ])
    ];
  }

  const handleKeyPress = (e: any) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(inputValue);
      setInputValue("");
    }
  };


  return (
    <Card className="flex flex-col h-screen max-w-md mx-auto bg-gray-400 border border-gray-200 rounded-lg overflow-hidden">
      <CardContent className="flex-1 overflow-y-auto p-4 flex flex-col space-y-4">
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

      <motion.div
        key={selectedCategory}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Suggestions
          suggestions={suggestionList}
          onClick={handleSuggestionClick}
          selectedCategory={selectedCategory}
        />
      </motion.div>

      <ChatInput
        value={inputValue}
        onChange={(e: any) => setInputValue(e.target.value)}
        onSend={() => {
          handleSend(inputValue);
          setInputValue("");
          setSelectedCategory(null);
        }}
        onKeyPress={handleKeyPress}
      />
    </Card>
  );
};

export default ChatbotUI;

