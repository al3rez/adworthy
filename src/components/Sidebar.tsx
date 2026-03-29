import { FC } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Zap, LogOut } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Sidebar: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  
  return (
    <div className="bg-gradient-to-bl from-rose-50 to-teal-50 border-r-[1px] border-r-lightgrey overflow-y-auto fixed top-0 left-0 h-screen w-80 flex flex-col items-center pt-9 text-[#536772] font-jakarta">
      <div className="flex flex-col items-center gap-10 mb-10">
        <div className="flex items-center justify-between w-60">
          <div className="flex items-center gap-2">
            <img 
              src="adworthy-v2.svg" 
              alt="Adworthy Logo" 
              className="h-8"
            />
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-4 text-daisygrey">
          <div 
            className={`p-3 cursor-pointer font-extrabold w-64 flex items-center gap-3 rounded-xl ${location.pathname === '/dashboard' || location.pathname === '/' ? 'shadow-one bg-black text-white' : ''}`}
            onClick={() => navigate('/dashboard')}
          >
            <Home size={20} />
            <p>Explore</p>
          </div>
          
          <div 
            className={`p-3 cursor-pointer font-extrabold w-64 flex items-center gap-3 rounded-xl ${location.pathname === '/analyze' ? 'shadow-one bg-black text-white' : ''}`}
            onClick={() => navigate('/analyze')}
          >
            <Zap size={20} />
            <p>Analyze</p>
          </div>
        </div>
      </div>
      
      {/* Spacer to push the user profile to the bottom */}
      <div className="flex-grow"></div>
      
      {user && (
        <div className="w-full px-7 flex items-center justify-between py-6 border-t-[1px] border-lightgrey mt-auto">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.user_metadata.avatar_url || ''} />
              <AvatarFallback className="bg-primary text-white">
                {user.email ? user.email.substring(0, 2).toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col justify-center">
              <p className="text-xs w-[11rem] max-w-[11rem] truncate font-bold text-black">
                {user.user_metadata.full_name || user.email}
              </p>
              <p className="text-[0.65rem] w-[11rem] max-w-[11rem] truncate">
                {user.email}
              </p>
            </div>
          </div>
          <button 
            onClick={() => signOut()}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Sign out"
          >
            <LogOut size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
