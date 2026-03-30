
import { FC, useState } from 'react';
import { Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdTemplateCardProps {
  template: {
    id: string;
    title: string;
    imageUrl: string;
    aspectRatio: number;
    category: string;
  };
  onClick: (template: any) => void;
}

const AdTemplateCard: FC<AdTemplateCardProps> = ({ template, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="relative overflow-hidden rounded-lg cursor-pointer bg-white shadow-sm group font-jakarta"
      onClick={() => onClick(template)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="w-full overflow-hidden">
        <img 
          src={template.imageUrl} 
          alt={template.title}
          className={cn(
            "w-full h-full object-cover transition-transform duration-500",
            isHovered ? "scale-105" : "scale-100"
          )}
          loading="lazy"
        />
      </div>
      
      {/* Action buttons */}
      <div className="absolute right-2 bottom-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button className="w-6 h-6 rounded-full bg-white shadow flex items-center justify-center">
          <Share2 size={12} className="text-gray-600" />
        </button>
      </div>

      {/* Product badge for conversations (if needed) */}
      {template.title && template.title.includes("picky") && (
        <div className="absolute top-3 left-3">
          <div className="bg-white rounded-full px-3 py-1 text-xs font-medium flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <span className="text-gray-800">Is The Farmer's Dog good for picky eaters?</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdTemplateCard;
