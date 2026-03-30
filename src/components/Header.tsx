
import { FC } from 'react';
import { Search, Plus, BellDot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const Header: FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border py-3 px-4 md:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <div className="mr-6 flex items-center">
            <img 
              src="/lovable-uploads/0e65446c-c906-4ab5-9982-6f1414453c98.png" 
              alt="Adworthy Logo" 
              className="h-8"
            />
          </div>
          
          <div className="relative hidden md:flex items-center">
            <div className="absolute left-3 text-muted-foreground">
              <Search size={18} />
            </div>
            <Input 
              className="pl-10 w-[280px] h-9 bg-secondary/80 border-none" 
              placeholder="Search templates..." 
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="text-sm font-medium">
            <Plus size={16} className="mr-1" />
            Create New
          </Button>
          <Button size="icon" variant="ghost" className="text-muted-foreground">
            <BellDot size={20} />
          </Button>
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              A
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default Header;
