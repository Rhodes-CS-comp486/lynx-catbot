import { Card } from '@/components/ui/card';

interface Props {
  suggestions: string[];
  onClick: (text: string) => void;
  
}

const Suggestions: React.FC<Props> = ({ suggestions, onClick }) => (
  <div className="flex flex-wrap gap-2 mb-2 m-5">
    {suggestions.slice(0, 6).map((s, i) => (
      <Card key={i} onClick={() => onClick(s)} className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full border border-gray-200 cursor-pointer">
        {s}
      </Card>
    ))}
  </div>
);

export default Suggestions;