
import { FC, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Home, Zap, Settings, LogOut, User, LogIn } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

const Sidebar: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userModalOpen, setUserModalOpen] = useState(false);
  const { user, signOut } = useAuth();
  
  const handleSignOut = async () => {
    await signOut();
    setUserModalOpen(false);
    navigate('/auth');
  };
  
  return (
    <div className="bg-gradient-to-bl from-rose-50 to-teal-50 border-r-[1px] border-r-lightgrey overflow-y-auto fixed top-0 left-0 h-screen w-80 flex flex-col items-center pt-9 text-[#536772] font-jakarta">
      <div className="flex flex-col items-center gap-10 mb-10">
        <div className="flex items-center justify-between w-60">
          <div className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/0e65446c-c906-4ab5-9982-6f1414453c98.png" 
              alt="Adworthy Logo" 
              className="h-8"
            />
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-4 text-daisygrey">
          <div 
            className={`p-3 cursor-pointer font-extrabold w-64 flex items-center gap-3 rounded-xl ${location.pathname === '/' ? 'shadow-one bg-black text-white' : ''}`}
            onClick={() => navigate('/')}
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
          
          {!user && (
            <div 
              className={`p-3 cursor-pointer font-extrabold w-64 flex items-center gap-3 rounded-xl ${location.pathname === '/auth' ? 'shadow-one bg-black text-white' : ''}`}
              onClick={() => navigate('/auth')}
            >
              <LogIn size={20} />
              <p>Sign In</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Spacer to push the user profile to the bottom */}
      <div className="flex-grow"></div>
      
      {user ? (
        <div 
          onClick={() => setUserModalOpen(true)}
          className="w-full cursor-pointer px-7 flex items-center justify-between gap-3 py-6 border-t-[1px] border-lightgrey mt-auto"
        >
          <div className="flex gap-2">
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
        </div>
      ) : (
        <div 
          onClick={() => navigate('/auth')}
          className="w-full cursor-pointer px-7 flex items-center justify-between gap-3 py-6 border-t-[1px] border-lightgrey mt-auto"
        >
          <div className="flex gap-2">
            <div className="rounded-lg shadow-one h-10 w-10 flex items-center justify-center bg-cloud text-2xl">
              <User size={20} />
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-xs w-[11rem] max-w-[11rem] truncate font-bold text-black">
                Sign In
              </p>
              <p className="text-[0.65rem] w-[11rem] max-w-[11rem] truncate">
                Access your account
              </p>
            </div>
          </div>
        </div>
      )}

      {/* User Profile Modal as widget near the sidebar */}
      <Dialog open={userModalOpen} onOpenChange={setUserModalOpen}>
        <DialogContent 
          className="bg-gradient-to-bl from-rose-50 to-teal-50 p-0 w-64 max-w-[264px] absolute left-[130px] bottom-[80px] transform-none"
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <div className="flex flex-col mb-3 bg-ice border-2 border-lightgrey rounded-md w-full">
            <div className="hover:bg-lightgrey p-3 rounded-md flex items-center gap-1 cursor-pointer text-daisygrey hover:text-black">
              <Settings size={16} />
              <p className="font-semibold">Edit Profile</p>
            </div>
            <div className="border-t border-lightgrey my-1"></div>
            <div 
              className="hover:bg-lightgrey p-3 rounded-md flex items-center gap-1 cursor-pointer text-daisygrey hover:text-black"
              onClick={handleSignOut}
            >
              <LogOut size={16} />
              <p className="font-semibold">Logout</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Sidebar;
