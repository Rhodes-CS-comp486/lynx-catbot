import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import Suggestions from '@/components/Suggestions';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useSuggestions } from '@/hooks/useSuggestions';
import { useSuggestionTracker } from './hooks/useSuggestionTracker';
import { useChat } from '@/hooks/useChat';



const ChatbotUI = () => {
  const { categories, subcategories, popularSuggestions, groupedSubcategories, groupedQuestions } = useSuggestions();
  const { messages, isLoading, handleSend } = useChat(categories, subcategories, popularSuggestions, groupedSubcategories);
  const [inputValue, setInputValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [request, setRequest] = useState<Request[]>([]);
  const { updatePopularSuggestions } = useSuggestionTracker();


  React.useEffect(() => {
    console.log(groupedSubcategories)
  }, [groupedSubcategories]);

  React.useEffect(() => {
    console.log(groupedQuestions)
  }, [groupedQuestions]);


  const handleSuggestionClick = (suggestion: string) => {
    const isCategory = categories.includes(suggestion);
    const isSubcategory = selectedCategory && groupedSubcategories[selectedCategory]?.includes(suggestion);
    const isQuestion = selectedCategory && selectedSubcategory && groupedQuestions[selectedSubcategory]?.includes(suggestion);
    const hasSubcategories = isCategory && groupedSubcategories[suggestion]?.length > 0;

    if (isCategory && hasSubcategories) {
      setSelectedCategory((prev) => (prev === suggestion ? null : suggestion));
    } else if (isSubcategory) {
      setSelectedSubcategory((prev) => (prev === suggestion ? null : suggestion));
    } else if (isQuestion) {
      setSelectedQuestion((prev)=>(prev === suggestion ? null : suggestion));
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
    <Card className="flex flex-col h-screen max-w-md mx-auto bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => <ChatMessage key={m.id} text={m.text} sender={m.sender} />)}
        {isLoading && <LoadingSpinner />}
      </CardContent>
      <Suggestions suggestions={suggestionList} onClick={handleSuggestionClick} selectedCategory={selectedCategory} />
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

