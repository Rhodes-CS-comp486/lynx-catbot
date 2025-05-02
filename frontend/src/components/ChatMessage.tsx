import { Card } from '@/components/ui/card';
import { User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

interface Props {
  text: string;
  sender: 'user' | 'bot';
}

const ChatMessage: React.FC<Props> = ({ text, sender }) => {
  const isUser = sender === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} w-full`}>
      <div
        className={`flex items-start gap-2 max-w-[80%] ${isUser ? 'flex-row-reverse' : ''
          }`}
      >
        {/* Avatar */}
        <Card
          className={`p-1 rounded-full shrink-0 ${isUser ? 'bg-red-600' : 'bg-white border border-gray-200'
            }`}
        >
          {isUser ? (
            <User size={18} className="text-white" />
          ) : (
            <img
              src="https://cdn-icons-png.flaticon.com/512/4712/4712107.png"
              alt="Bot"
              className="w-6 h-6 rounded-full object-cover"
            />
          )}
        </Card>

        {/* Message Bubble */}
        <Card
          className={`pt-5 pb-4 px-4 text-base leading-relaxed ${isUser
              ? 'bg-red-600 text-white border-none rounded-xl rounded-br-none'
              : 'bg-white text-gray-900 border border-gray-200 rounded-xl rounded-bl-none'
            }`}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              p: ({ children }) => (
                <p className="mb-2 mt-1 text-base">{children}</p>
              ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  {children}
                </a>
              ),
              code: ({ children }) => (
                <code className="bg-gray-100 text-sm px-1 py-0.5 rounded font-mono">
                  {children}
                </code>
              ),
              pre: ({ children }) => (
                <pre className="bg-gray-900 text-white text-sm p-2 rounded overflow-x-auto font-mono">
                  {children}
                </pre>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside mt-2">{children}</ul>
              ),
              li: ({ children }) => <li className="ml-4">{children}</li>,
              strong: ({ children }) => (
                <strong className="font-semibold">{children}</strong>
              ),
            }}
          >
            {text}
          </ReactMarkdown>
        </Card>
      </div>
    </div>
  );
};

export default ChatMessage;
