
import { FC, useState } from 'react';
import { HomeIcon, Zap } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  return (
    <div className="bg-gradient-to-bl from-rose-50 to-teal-50 border-r-[1px] border-r-lightgrey overflow-y-auto fixed top-0 left-0 h-screen w-80 flex flex-col items-center pt-9 text-[#536772]">
      <div className="flex flex-col items-center gap-10 mb-10">
        <div className="flex items-center justify-between w-60">
          <span className="font-semibold text-lg bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
            AdMosaic
          </span>
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
      
      <details className="dropdown dropdown-top dropdown-end">
        <summary>
          <div className="w-full cursor-pointer px-7 flex items-center justify-between gap-3 py-6 border-t-[1px] border-lightgrey">
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
        </summary>
        <div className="flex flex-col mb-3 menu dropdown-content z-10 bg-ice border-2 border-lightgrey rounded-md w-full">
          <div className="hover:bg-lightgrey p-3 rounded-md flex items-center gap-1 cursor-pointer text-daisygrey hover:text-black">
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" className="text-grey h-6 w-6" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
              <path d="M416.3 256c0-21 13.1-38.9 31.7-46.1-4.9-20.5-13-39.7-23.7-57.1-6.4 2.8-13.2 4.3-20.1 4.3-12.6 0-25.2-4.8-34.9-14.4-14.9-14.9-18.2-36.8-10.2-55-17.3-10.7-36.6-18.8-57-23.7C295 82.5 277 95.7 256 95.7S217 82.5 209.9 64c-20.5 4.9-39.7 13-57.1 23.7 8.1 18.1 4.7 40.1-10.2 55-9.6 9.6-22.3 14.4-34.9 14.4-6.9 0-13.7-1.4-20.1-4.3C77 170.3 68.9 189.5 64 210c18.5 7.1 31.7 25 31.7 46.1 0 21-13.1 38.9-31.6 46.1 4.9 20.5 13 39.7 23.7 57.1 6.4-2.8 13.2-4.2 20-4.2 12.6 0 25.2 4.8 34.9 14.4 14.8 14.8 18.2 36.8 10.2 54.9 17.4 10.7 36.7 18.8 57.1 23.7 7.1-18.5 25-31.6 46-31.6s38.9 13.1 46 31.6c20.5-4.9 39.7-13 57.1-23.7-8-18.1-4.6-40 10.2-54.9 9.6-9.6 22.2-14.4 34.9-14.4 6.8 0 13.7 1.4 20 4.2 10.7-17.4 18.8-36.7 23.7-57.1-18.4-7.2-31.6-25.1-31.6-46.2zm-159.4 79.9c-44.3 0-80-35.9-80-80s35.7-80 80-80 80 35.9 80 80-35.7 80-80 80z"></path>
            </svg>
            <p className="font-semibold">Edit Profile</p>
          </div>
          <div className="divider m-0"></div>
          <div className="hover:bg-lightgrey p-3 rounded-md flex items-center gap-1 cursor-pointer text-daisygrey hover:text-black">
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="text-grey h-6 w-6" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
              <path d="m2 12 5 4v-3h9v-2H7V8z"></path>
              <path d="M13.001 2.999a8.938 8.938 0 0 0-6.364 2.637L8.051 7.05c1.322-1.322 3.08-2.051 4.95-2.051s3.628.729 4.95 2.051 2.051 3.08 2.051 4.95-.729 3.628-2.051 4.95-3.08 2.051-4.95 2.051-3.628-.729-4.95-2.051l-1.414 1.414c1.699 1.7 3.959 2.637 6.364 2.637s4.665-.937 6.364-2.637c1.7-1.699 2.637-3.959 2.637-6.364s-.937-4.665-2.637-6.364a8.938 8.938 0 0 0-6.364-2.637z"></path>
            </svg>
            <p className="font-semibold">Logout</p>
          </div>
        </div>
      </details>
    </div>
  );
};

export default Sidebar;
