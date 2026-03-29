
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Play, Power } from 'lucide-react';

const Landing: FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white py-4 px-6 border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/72a7ff0f-5b2d-485e-8456-4eacf3a4b1b4.png" 
              alt="Adworthy Logo" 
              className="h-10"
            />
            <span className="text-xl font-bold text-gray-800">Adworthy</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-600 hover:text-gray-900 font-medium">Product</a>
            <a href="#pricing" className="text-gray-600 hover:text-gray-900 font-medium">Pricing</a>
            <Button 
              variant="outline" 
              className="ml-4"
              onClick={() => navigate('/auth')}
            >
              Sign In
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Automate TikToks that drive traffic to your website
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-10">
            It's like a gen z marketing team, but way cheaper
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-6 text-lg rounded-full"
              onClick={() => navigate('/auth')}
            >
              <Power className="mr-2" />
              Start Now
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="bg-white text-gray-700 px-8 py-6 text-lg rounded-full"
            >
              <Play className="mr-2" />
              Demo
            </Button>
          </div>
        </div>
      </section>

      {/* TikTok videos section */}
      <section className="pb-24 px-6 overflow-hidden">
        <div className="flex justify-center">
          <div className="flex gap-4 md:gap-6 -rotate-3 overflow-x-auto pb-8">
            {/* Video cards */}
            {[1, 2, 3, 4, 5].map((item) => (
              <div 
                key={item} 
                className="flex-shrink-0 w-64 bg-gray-100 rounded-3xl shadow-lg overflow-hidden relative"
                style={{ aspectRatio: '9/16' }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/5 flex items-end p-4">
                  <div className="text-white text-sm">
                    <div className="text-shadow">
                      {item === 1 && "I think I just found THE secret app TikTok is trying to hide from us"}
                      {item === 2 && "me when I find out ReelFarm is releasing a new video format"}
                      {item === 3 && "Believe it or not, this is an AI-generated video that looks like never existed"}
                      {item === 4 && "me firing my meme dealer because ReelFarm makes memes for me now"}
                      {item === 5 && "You: where did you find this app??? Me: *sends this*"}
                    </div>
                  </div>
                </div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                    <div className="w-6 h-6 border-r-2 border-t-2 border-white transform rotate-45"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
