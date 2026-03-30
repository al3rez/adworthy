
import { FC, useState } from 'react';
import { FolderIcon, LayoutGridIcon, BarChartIcon, ChevronDownIcon, PlusIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Sidebar as ShadcnSidebar, 
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent
} from '@/components/ui/sidebar';

interface CollectionItem {
  id: string;
  name: string;
  isActive?: boolean;
}

const Sidebar: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collectionsOpen, setCollectionsOpen] = useState(true);
  
  const collections: CollectionItem[] = [
    { id: 'accessories', name: 'Accessories' },
    { id: 'personal-care', name: 'Personal Care' },
    { id: 'travel', name: 'Travel - Reviews' },
    { id: 'uniforms', name: 'BTC Uniforms' },
    { id: 'press', name: 'Press Features' },
    { id: 'clothing', name: 'Clothing - Headlines' },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <ShadcnSidebar>
      <SidebarHeader className="flex items-center px-4 py-2">
        <div className="flex items-center justify-between w-full">
          <div className="font-semibold text-lg bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
            AdMosaic
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={isActive('/')} 
                  onClick={() => navigate('/')}
                >
                  <LayoutGridIcon size={18} />
                  <span>Explore</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={isActive('/analyze')} 
                  onClick={() => navigate('/analyze')}
                >
                  <BarChartIcon size={18} />
                  <span>Analyze</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <div className="flex items-center justify-between px-2">
            <SidebarGroupLabel 
              className="flex items-center cursor-pointer"
              onClick={() => setCollectionsOpen(!collectionsOpen)}
            >
              Collections
              <ChevronDownIcon 
                size={16} 
                className={cn(
                  "ml-1 transition-transform",
                  collectionsOpen ? "transform rotate-180" : ""
                )}
              />
            </SidebarGroupLabel>
            <button className="h-5 w-5 rounded-md flex items-center justify-center hover:bg-sidebar-accent">
              <PlusIcon size={14} />
            </button>
          </div>
          
          {collectionsOpen && (
            <SidebarGroupContent>
              <SidebarMenu>
                {collections.map((collection) => (
                  <SidebarMenuItem key={collection.id}>
                    <SidebarMenuButton 
                      isActive={collection.isActive}
                      onClick={() => navigate(`/collections/${collection.id}`)}
                    >
                      <FolderIcon size={16} />
                      <span>{collection.name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          )}
        </SidebarGroup>
      </SidebarContent>
    </ShadcnSidebar>
  );
};

export default Sidebar;
