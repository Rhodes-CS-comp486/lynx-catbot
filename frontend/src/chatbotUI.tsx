import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import Suggestions from '@/components/Suggestions';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useSuggestions } from '@/hooks/useSuggestions';
import { useChat } from '@/hooks/useChat';

const ChatbotUI = () => {
  const { categories, subcategories, popularSuggestions, groupedSubcategories } = useSuggestions();
  const { messages, isLoading, handleSend } = useChat(categories, subcategories, popularSuggestions);
  const [inputValue, setInputValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleSuggestionClick = (suggestion: string) => {
    const isCategory = categories.includes(suggestion);
    const hasSubcategories = groupedSubcategories[suggestion]?.size > 0;
    if (isCategory && hasSubcategories) {
      setSelectedCategory((prev) => (prev === suggestion ? null : suggestion));
    } else {
      handleSend(suggestion);
      setInputValue("");
      setSelectedCategory(null);
    }
  };

  let suggestionList: string[];
  if (selectedCategory && groupedSubcategories[selectedCategory]) {
    suggestionList = Array.from(groupedSubcategories[selectedCategory]);
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

  // const suggestionList = [...new Set([
  //   ...popularSuggestions.map(s => s.suggestion_text),
  //   ...categories,
  //   ...subcategories
  // ])];

  return (
    <Card className="flex flex-col h-screen max-w-md mx-auto bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => <ChatMessage key={m.id} text={m.text} sender={m.sender} />)}
        {isLoading && <LoadingSpinner />}
      </CardContent>
      {selectedCategory && (
        <div
          className="text-sm text-blue-600 font-medium px-4 py-2 cursor-pointer"
          onClick={() => setSelectedCategory(null)}
        >
          ← Back to all suggestions
        </div>
      )}
      <Suggestions suggestions={suggestionList} onClick={handleSuggestionClick} />
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
  );
};

export default ChatbotUI;