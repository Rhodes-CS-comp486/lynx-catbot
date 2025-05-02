import React, { useRef, useEffect } from 'react';
import { CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

interface Props {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

const ChatInput: React.FC<Props> = ({ value, onChange, onSend, onKeyPress }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 160) + 'px'; // max 10rem
    }
  }, [value]);

  return (
    <CardFooter className="flex space-x-2 items-end">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyPress}
        placeholder="Type your message..."
        rows={1}
        className="flex-1 resize-none overflow-y-hidden focus:overflow-y-auto max-h-40 rounded-md px-4 py-2 text-base shadow-sm bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"


      />
      <Button type="button" onClick={onSend} size="icon" className="!bg-red-600 hover:!bg-red-400">
        <Send size={18} className="text-white" />
      </Button>
    </CardFooter>
  );
};

export default ChatInput;
