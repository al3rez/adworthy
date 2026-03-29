import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Play, Power } from 'lucide-react';
import MasonryGrid from '@/components/MasonryGrid';
import { fetchAdTemplates, AdTemplate } from '@/utils/apiService';

const Landing: FC = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<AdTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadTemplates = async () => {
      const data = await fetchAdTemplates();
      setTemplates(data);
      setIsLoading(false);
    };
    
    loadTemplates();
  }, []);
  
  return (
    <div className="min-h-screen  max-w-7xl mx-auto">
      {/* Navigation header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm py-4 px-6 border-b border-lightgrey">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img 
              src="adworthy-v2.svg" 
              alt="Adworthy Logo" 
              className="h-8"
            />
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-[#536772] hover:text-black font-jakarta">Product</a>
            <a href="#pricing" className="text-[#536772] hover:text-black font-jakarta">Pricing</a>
            <Button 
              variant="outline" 
              className="ml-4 font-jakarta"
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
          <h1 className="text-4xl md:text-6xl font-extrabold text-black mb-6 font-jakarta">
            Make killer ads in seconds
          </h1>
          <p className="text-xl md:text-2xl text-[#536772] mb-10 font-jakarta">
            Recreate viral ad styles from Pinterest, Facebook, and more
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="shadow-one bg-black hover:bg-black/90 text-white px-8 py-6 text-lg rounded-xl font-jakarta"
              onClick={() => navigate('/auth')}
            >
              <Power className="mr-2" />
              Make your first ad
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="bg-white text-black px-8 py-6 text-lg rounded-xl font-jakarta"
            >
              <Play className="mr-2" />
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Pinterest Style Examples Section */}
      <section className="pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {templates.map((template) => (
                <div 
                  key={template.id}
                  className="bg-white rounded-2xl shadow-one overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img 
                      src={template.imageURL} 
                      alt={template.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Ad Examples Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4 text-center font-jakarta">
            See how we swallow it
          </h2>
          <p className="text-[#536772] text-center mb-12 font-jakarta">
            Transform any ad into a viral TikTok format
          </p>
          
          <MasonryGrid className="px-4">
            {[
              {
                title: "Pinterest Ad → TikTok",
                description: "Turn static Pinterest ads into engaging vertical videos",
                image: "/lovable-uploads/pinterest-example.png"
              },
              {
                title: "Facebook Ad → TikTok",
                description: "Convert Facebook carousel ads into TikTok stories",
                image: "/lovable-uploads/facebook-example.png"
              },
              {
                title: "Instagram Post → TikTok",
                description: "Transform Instagram posts into TikTok trends",
                image: "/lovable-uploads/instagram-example.png"
              },
              {
                title: "YouTube Ad → TikTok",
                description: "Repurpose YouTube ads for TikTok success",
                image: "/lovable-uploads/youtube-example.png"
              },
              {
                title: "Google Display → TikTok",
                description: "Convert display ads into TikTok-friendly content",
                image: "/lovable-uploads/google-example.png"
              }
            ].map((item, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl shadow-one overflow-hidden group cursor-pointer hover:shadow-xl transition-shadow duration-300"
              >
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-black mb-2 font-jakarta">{item.title}</h3>
                  <p className="text-[#536772] font-jakarta">{item.description}</p>
                </div>
              </div>
            ))}
          </MasonryGrid>
        </div>
      </section>
    </div>
  );
};

export default Landing;
