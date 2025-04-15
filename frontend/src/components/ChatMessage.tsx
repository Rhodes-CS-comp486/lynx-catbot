import { Card } from '@/components/ui/card';
import { User, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

interface Props {
  text: string;
  sender: "user" | "bot";
}

const ChatMessage: React.FC<Props> = ({ text, sender }) => (
  <div className={`flex ${sender === "user" ? "justify-end" : "justify-start"}`}>
    <div className={`flex items-start space-x-2 max-w-xs ${sender === "user" ? "flex-row-reverse space-x-reverse" : ""}`}>
      <Card className={`p-1 rounded-full ${sender === "user" ? "bg-blue-500" : "bg-gray-300"}`}>
        {sender === "user" ? <User size={16} className="text-white" /> : <Bot size={16} className="text-gray-700" />}
      </Card>
      <Card className={`p-3 rounded-lg ${sender === "user" ? "bg-blue-500 text-white" : "bg-white border border-gray-200"}`}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={{
            p: ({ children }) => <p className="mb-2 leading-relaxed">{children}</p>,
            a: ({ href, children }) => (
              <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                {children}
              </a>
            ),
            code: ({ children }) => (
              <code className="bg-gray-100 text-sm px-1 py-0.5 rounded">{children}</code>
            ),
            pre: ({ children }) => (
              <pre className="bg-gray-900 text-white text-sm p-2 rounded overflow-x-auto">{children}</pre>
            ),
            ul: ({ children }) => <ul className="list-disc list-inside">{children}</ul>,
            li: ({ children }) => <li className="ml-4">{children}</li>,
            strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
          }}
        >
          {text}
        </ReactMarkdown>
      </Card>
    </div>
  </div>
);

export default ChatMessage;