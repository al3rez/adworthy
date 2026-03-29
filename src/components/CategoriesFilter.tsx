
import { FC } from 'react';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface CategoriesFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategoriesFilter: FC<CategoriesFilterProps> = ({ 
  categories, 
  selectedCategory, 
  onSelectCategory 
}) => {
  return (
    <div className="mb-6 overflow-x-auto no-scrollbar">
      <div className="flex space-x-2 pb-2">
        <Button
          size="sm"
          variant={selectedCategory === 'all' ? 'default' : 'outline'}
          className="text-sm font-medium whitespace-nowrap"
          onClick={() => onSelectCategory('all')}
        >
          All Templates
        </Button>
        
        {categories.map((category) => (
          <Button
            key={category}
            size="sm"
            variant={selectedCategory === category ? 'default' : 'outline'}
            className="text-sm font-medium whitespace-nowrap"
            onClick={() => onSelectCategory(category)}
          >
            {category}
          </Button>
        ))}
        
        <Button size="sm" variant="outline" className="text-sm font-medium whitespace-nowrap ml-auto">
          <Search size={14} className="mr-1.5" />
          More Filters
        </Button>
      </div>
    </div>
  );
};

export default CategoriesFilter;
