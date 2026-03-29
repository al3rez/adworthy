
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Loader2, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useCredits, GeneratedAd } from '@/contexts/CreditsContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

const Creations: React.FC = () => {
  const { generatedAds } = useCredits();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  
  const handleDownload = (ad: GeneratedAd) => {
    // In a real app, this would download the actual image
    toast({
      title: "Download started",
      description: "Your generated ad is being downloaded.",
    });
    
    // For demo purposes, we'll just open the image in a new tab
    window.open(ad.imageUrl, '_blank');
  };
  
  const filteredAds = activeFilter 
    ? generatedAds.filter(ad => ad.status === activeFilter)
    : generatedAds;
  
  return (
    <div className="flex min-h-screen bg-[#FAFBFC]">
      <Sidebar />
      
      <div className="ml-80 flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 p-8 w-full">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">My Creations</h1>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => setActiveFilter(null)}
              >
                <Filter size={16} />
                All
                {activeFilter && (
                  <X 
                    size={14} 
                    className="ml-1 text-gray-500" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveFilter(null);
                    }}
                  />
                )}
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="grid" className="w-full">
            <div className="flex justify-between items-center mb-6">
              <TabsList>
                <TabsTrigger value="grid">Grid View</TabsTrigger>
                <TabsTrigger value="list">List View</TabsTrigger>
              </TabsList>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant={activeFilter === 'generating' ? 'default' : 'outline'}
                  onClick={() => setActiveFilter(activeFilter === 'generating' ? null : 'generating')}
                  className="text-sm"
                >
                  In Progress
                </Button>
                <Button 
                  variant={activeFilter === 'completed' ? 'default' : 'outline'}
                  onClick={() => setActiveFilter(activeFilter === 'completed' ? null : 'completed')}
                  className="text-sm"
                >
                  Completed
                </Button>
                <Button 
                  variant={activeFilter === 'failed' ? 'default' : 'outline'}
                  onClick={() => setActiveFilter(activeFilter === 'failed' ? null : 'failed')}
                  className="text-sm"
                >
                  Failed
                </Button>
              </div>
            </div>
            
            <TabsContent value="grid" className="w-full">
              {filteredAds.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="mb-4 p-4 bg-gray-100 rounded-full">
                    <Download size={24} className="text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">No creations yet</h3>
                  <p className="text-gray-500 mb-6 max-w-md">
                    Start creating ads by exploring templates and customizing them to fit your brand.
                  </p>
                  <Button onClick={() => navigate('/dashboard')}>
                    Explore Templates
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAds.map((ad) => (
                    <div 
                      key={ad.id} 
                      className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="aspect-[4/5] relative">
                        {ad.status === 'generating' && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <div className="flex flex-col items-center text-white">
                              <Loader2 size={40} className="animate-spin mb-2" />
                              <p>Generating...</p>
                            </div>
                          </div>
                        )}
                        {ad.status === 'failed' && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <div className="flex flex-col items-center text-white">
                              <X size={40} className="mb-2" />
                              <p>Generation failed</p>
                            </div>
                          </div>
                        )}
                        <img 
                          src={ad.imageUrl} 
                          alt={ad.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-gray-900 truncate">{ad.title}</h3>
                          <span className="text-xs text-gray-500">
                            {ad.createdAt.toLocaleDateString()}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                          {ad.prompt}
                        </p>
                        
                        <div className="flex justify-between items-center">
                          <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                            ad.status === 'completed' 
                              ? 'bg-green-100 text-green-700' 
                              : ad.status === 'generating'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-red-100 text-red-700'
                          }`}>
                            {ad.status}
                          </span>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={() => handleDownload(ad)}
                            disabled={ad.status !== 'completed'}
                          >
                            <Download size={14} className="mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="list" className="w-full">
              {filteredAds.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="mb-4 p-4 bg-gray-100 rounded-full">
                    <Download size={24} className="text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">No creations yet</h3>
                  <p className="text-gray-500 mb-6 max-w-md">
                    Start creating ads by exploring templates and customizing them to fit your brand.
                  </p>
                  <Button onClick={() => navigate('/dashboard')}>
                    Explore Templates
                  </Button>
                </div>
              ) : (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="grid grid-cols-[1fr_2fr_1fr_1fr] px-4 py-3 border-b border-gray-200 bg-gray-50 font-medium text-sm">
                    <div>Image</div>
                    <div>Details</div>
                    <div>Status</div>
                    <div className="text-right">Actions</div>
                  </div>
                  
                  {filteredAds.map((ad) => (
                    <div 
                      key={ad.id}
                      className="grid grid-cols-[1fr_2fr_1fr_1fr] items-center px-4 py-3 border-b border-gray-200 hover:bg-gray-50"
                    >
                      <div className="w-16 h-16 rounded overflow-hidden relative">
                        {ad.status === 'generating' && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Loader2 size={20} className="animate-spin text-white" />
                          </div>
                        )}
                        <img 
                          src={ad.imageUrl} 
                          alt={ad.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-gray-900 mb-1">{ad.title}</h3>
                        <p className="text-xs text-gray-500 line-clamp-1">{ad.prompt}</p>
                        <p className="text-xs text-gray-400 mt-1">{ad.createdAt.toLocaleDateString()}</p>
                      </div>
                      
                      <div>
                        <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                          ad.status === 'completed' 
                            ? 'bg-green-100 text-green-700' 
                            : ad.status === 'generating'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-red-100 text-red-700'
                        }`}>
                          {ad.status}
                        </span>
                      </div>
                      
                      <div className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          onClick={() => handleDownload(ad)}
                          disabled={ad.status !== 'completed'}
                        >
                          <Download size={14} className="mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Creations;
