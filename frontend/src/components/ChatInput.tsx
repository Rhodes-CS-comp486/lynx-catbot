import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { CardFooter } from '@/components/ui/card';

interface Props {
  value: string;
  onChange: (e: any) => void;
  onSend: () => void;
  onKeyPress: (e: any) => void;
}

const ChatInput: React.FC<Props> = ({ value, onChange, onSend, onKeyPress }) => (
  <CardFooter className="flex space-x-2">
    <Input
      value={value}
      onChange={onChange}
      onKeyPress={onKeyPress}
      placeholder="Type your message..."
      className="flex-1"
    />
    <Button type="button" onClick={onSend} size="icon" className="bg-black-500 hover:bg-blue-600">
      <Send size={18} className="text-white" />
    </Button>
  </CardFooter>
);

export default ChatInput;