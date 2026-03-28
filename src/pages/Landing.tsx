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
    <div className="min-h-screen">
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
          </nav>
        </div>
      </header>

      {/* Gradient background wrapper */}
      <div className="absolute inset-0 bg-gradient-to-bl from-rose-50 to-teal-50 -z-10"></div>

      {/* Main content */}
      <div className="relative max-w-6xl mx-auto">
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
                onClick={() => window.open('https://buy.stripe.com/test_XXXXXXXXXXXXX', '_blank')}
              >
                <Power className="mr-2" />
                Join Waitlist
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
        {/* Pain Points Section */}
        <section className="py-16 px-6 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-12 text-center font-jakarta">
            Done in seconds, not days (or dollars)
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-2xl shadow-one border-2 border-red-500">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-red-500 text-xl">✕</span>
                  <h3 className="text-xl font-bold text-black font-jakarta">Designers</h3>
                </div>
                <p className="text-[#536772] font-jakarta">
                  Expensive, $50-200 per design, long turnaround times, and multiple revision cycles
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-one border-2 border-red-500">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-red-500 text-xl">✕</span>
                  <h3 className="text-xl font-bold text-black font-jakarta">Canva Pro</h3>
                </div>
                <p className="text-[#536772] font-jakarta">
                  $14.99/month + 1-3 hours finding templates + 1 hour editing. Time-consuming and limited options
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-one border-2 border-green-500">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-green-500 text-xl">✓</span>
                  <h3 className="text-xl font-bold text-black font-jakarta">Adworthy</h3>
                </div>
                <p className="text-[#536772] font-jakarta">
                  Save time with instant access to 100+ proven ad styles from Pinterest, Facebook for a simple monthly fee
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-12 text-center font-jakarta">
              Features
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-2xl shadow-one">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-green-500 text-xl">✓</span>
                  <h3 className="text-xl font-bold text-black font-jakarta">Style Matching</h3>
                </div>
                <p className="text-[#536772] font-jakarta">
                  Paste any Pinterest URL to get the style of any ad. Perfect for matching your competitors' best-performing ads
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-one">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-blue-500 text-xl">⚡</span>
                  <h3 className="text-xl font-bold text-black font-jakarta">A/B Testing</h3>
                </div>
                <p className="text-[#536772] font-jakarta">
                  Test different ad styles against each other to find what works best for your audience
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-one">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-blue-500 text-xl">⚡</span>
                  <h3 className="text-xl font-bold text-black font-jakarta">Facebook Ads API</h3>
                </div>
                <p className="text-[#536772] font-jakarta">
                  Direct integration with Facebook Ads API for seamless campaign management
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-16 px-6 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-12 text-center font-jakarta">
              Simple, transparent pricing
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Starter Plan */}
              <div className="relative rounded-2xl p-8 border-2 border-gray-300 bg-white">
                <h2 className="text-2xl font-bold text-black font-jakarta">Starter</h2>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-black">$19</span>
                  <span className="text-[#545454]">/month</span>
                </div>
                <p className="text-[#545454] mt-2">100 credits/month</p>
                <div className="h-px bg-gray-300 my-6"></div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-[#545454]">1 credit = 1 ad generation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-[#545454]">Style matching from Pinterest</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-[#545454]">Basic templates</span>
                  </div>
                </div>
                <button 
                  onClick={() => window.open('https://buy.stripe.com/test_XXXXXXXXXXXXX', '_blank')}
                  className="mt-8 w-full py-3 px-6 rounded-xl bg-black text-white hover:bg-black/90 transition-colors font-jakarta"
                >
                  Join Waitlist
                </button>
              </div>

              {/* Pro Plan */}
              <div className="relative rounded-2xl p-8 border-2 border-blue-500 bg-white">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm">
                  Most Popular
                </div>
                <h2 className="text-2xl font-bold text-black font-jakarta">Pro</h2>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-black">$49</span>
                  <span className="text-[#545454]">/month</span>
                </div>
                <p className="text-[#545454] mt-2">500 credits/month</p>
                <div className="h-px bg-gray-300 my-6"></div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-[#545454]">1 credit = 1 ad generation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-[#545454]">Style matching from Pinterest</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-[#545454]">All templates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-[#545454]">A/B testing (coming soon)</span>
                  </div>
                </div>
                <button 
                  onClick={() => window.open('https://buy.stripe.com/test_XXXXXXXXXXXXX', '_blank')}
                  className="mt-8 w-full py-3 px-6 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-colors font-jakarta"
                >
                  Join Waitlist
                </button>
              </div>

              {/* Enterprise Plan */}
              <div className="relative rounded-2xl p-8 border-2 border-gray-300 bg-white">
                <h2 className="text-2xl font-bold text-black font-jakarta">Enterprise</h2>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-black">$99</span>
                  <span className="text-[#545454]">/month</span>
                </div>
                <p className="text-[#545454] mt-2">1500 credits/month</p>
                <div className="h-px bg-gray-300 my-6"></div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-[#545454]">1 credit = 1 ad generation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-[#545454]">Style matching from Pinterest</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-[#545454]">All templates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-[#545454]">A/B testing (coming soon)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-[#545454]">Facebook Ads API (coming soon)</span>
                  </div>
                </div>
                <button 
                  onClick={() => window.open('https://buy.stripe.com/7sIaGp7yn9Da24MdQQ', '_blank')}
                  className="mt-8 w-full py-3 px-6 rounded-xl bg-black text-white hover:bg-black/90 transition-colors font-jakarta"
                >
                  Join Waitlist
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Landing;
