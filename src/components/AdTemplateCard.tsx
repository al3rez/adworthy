
import { FC, useState } from 'react';
import { Heart, Download, Share2 } from 'lucide-react';
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
  
  const gridRowSpan = Math.ceil(template.aspectRatio * 30);
  
  return (
    <div 
      className="rounded-lg overflow-hidden relative group cursor-pointer"
      style={{ gridRowEnd: `span ${gridRowSpan}` }}
      onClick={() => onClick(template)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="w-full h-full overflow-hidden">
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
      
      {/* Overlay with animation */}
      <div 
        className={cn(
          "absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-3 flex flex-col justify-between",
          "opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        )}
      >
        <div className="flex justify-end space-x-1">
          <button className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors">
            <Heart size={15} />
          </button>
          <button className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors">
            <Share2 size={15} />
          </button>
        </div>
        
        <div className="space-y-2">
          <span className="inline-block px-2 py-1 text-xs font-medium bg-white/20 backdrop-blur-md rounded-md text-white">
            {template.category}
          </span>
          <h3 className="text-white font-medium line-clamp-1">{template.title}</h3>
          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white/80 backdrop-blur-md rounded-md text-sm font-medium text-gray-900 hover:bg-white transition-colors">
              <Download size={14} />
              Use Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdTemplateCard;
