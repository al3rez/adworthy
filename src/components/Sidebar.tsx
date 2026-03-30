
import { FC, useState } from 'react';
import { HomeIcon, Zap, Settings, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const Sidebar: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userModalOpen, setUserModalOpen] = useState(false);
  
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
            <HomeIcon size={16} />
            <p>Explore</p>
          </div>
          
          <div 
            className={`p-3 cursor-pointer font-extrabold w-64 flex items-center gap-3 rounded-xl ${location.pathname === '/analyze' ? 'shadow-one bg-black text-white' : ''}`}
            onClick={() => navigate('/analyze')}
          >
            <Zap size={16} />
            <p>Analyze</p>
          </div>
        </div>
      </div>
      
      {/* Spacer to push the user profile to the bottom */}
      <div className="flex-grow"></div>
      
      <div 
        onClick={() => setUserModalOpen(true)}
        className="w-full cursor-pointer px-7 flex items-center justify-between gap-3 py-6 border-t-[1px] border-lightgrey mt-auto"
      >
        <div className="flex gap-2">
          <div className="rounded-lg shadow-one h-10 w-10 flex items-center justify-center bg-cloud text-2xl">
            ⚙️
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-xs w-[11rem] max-w-[11rem] truncate font-bold text-black">
              Amy Tillman
            </p>
            <p className="text-[0.65rem] w-[11rem] max-w-[11rem] truncate">
              user@example.com
            </p>
          </div>
        </div>
      </div>

      {/* User Profile Modal as widget near the sidebar */}
      <Dialog open={userModalOpen} onOpenChange={setUserModalOpen}>
        <DialogContent 
          className="bg-gradient-to-bl from-rose-50 to-teal-50 p-0 w-64 max-w-[264px] absolute left-[130px] bottom-[80px] transform-none"
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <div className="flex flex-col mb-3 bg-ice border-2 border-lightgrey rounded-md w-full">
            <div className="hover:bg-lightgrey p-3 rounded-md flex items-center gap-1 cursor-pointer text-daisygrey hover:text-black">
              <Settings className="text-grey h-6 w-6" />
              <p className="font-semibold">Edit Profile</p>
            </div>
            <div className="border-t border-lightgrey my-1"></div>
            <div className="hover:bg-lightgrey p-3 rounded-md flex items-center gap-1 cursor-pointer text-daisygrey hover:text-black">
              <LogOut className="text-grey h-6 w-6" />
              <p className="font-semibold">Logout</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Sidebar;
