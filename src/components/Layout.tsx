import React from 'react';
import Sidebar from '@/components/Sidebar';
import { Home } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Filter } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  headerActions?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children, title, headerActions }) => {
  return (
    <div className="min-h-screen bg-white flex">
      <Sidebar />
      
      <div className="flex-1 pl-80">
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-lightgrey py-4 px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Home size={20} className="text-black" />
              <h1 className="text-xl font-bold text-black font-jakarta">{title}</h1>
            </div>
            
            <div className="flex items-center gap-4">
              {headerActions}
              
              <div className="relative flex items-center">
                <div className="absolute left-3 text-[#536772]">
                  <Filter size={16} />
                </div>
                <Input 
                  className="pl-10 w-[250px] h-10 bg-gray-50 border-none rounded-xl font-jakarta" 
                  placeholder="Search..." 
                />
              </div>
            </div>
          </div>
        </div>
        
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout; 