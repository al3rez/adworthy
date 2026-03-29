
import { useState, useEffect } from 'react';
import AdTemplateCard from '@/components/AdTemplateCard';
import AdCustomizerModal from '@/components/AdCustomizerModal';
import Loader from '@/components/Loader';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { fetchAdTemplates, AdTemplate } from '@/utils/apiService';
import MasonryGrid from '@/components/MasonryGrid';
import { Search, Home } from 'lucide-react';

const transformToTemplateFormat = (templates: AdTemplate[]) => {
  return templates.map(template => ({
    id: template.id,
    title: template.title || 'Ad Template',
    imageUrl: template.imageURL,
    aspectRatio: 1.2, // Default aspect ratio
    category: template.pinner?.fullName || 'The Farmer\'s Dog'
  }));
};

const Index = () => {
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);
  const [templates, setTemplates] = useState<any[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const { toast } = useToast();
  
  const fetchTemplates = async (resetExisting = false) => {
    try {
      setLoading(resetExisting);
      setLoadingMore(!resetExisting && templates.length > 0);
      
      const adTemplates = await fetchAdTemplates();
      const transformedTemplates = transformToTemplateFormat(adTemplates);
      
      if (resetExisting) {
        setTemplates(transformedTemplates);
      } else {
        setTemplates(prev => [...prev, ...transformedTemplates]);
      }
    } catch (error) {
      console.error('Error loading templates:', error);
      toast({
        title: "Error loading templates",
        description: "There was a problem fetching ad templates",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };
  
  useEffect(() => {
    fetchTemplates(true);
  }, []);
  
  const handleTemplateClick = (template: any) => {
    setSelectedTemplate(template);
    setModalOpen(true);
  };
  
  const handleLoadMore = () => {
    toast({
      title: "No more templates",
      description: "All available templates have been loaded",
    });
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-slate-50 flex">
      <Sidebar />
      
      <div className="flex-1 pl-80">
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-border py-3 px-6">
          <div className="max-w-full mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Home size={18} className="text-amber-600" />
              <h1 className="text-xl font-semibold text-gray-800">Explore</h1>
            </div>
            
            <div className="relative flex items-center">
              <div className="absolute left-3 text-muted-foreground">
                <Search size={16} />
              </div>
              <Input 
                className="pl-10 w-[250px] h-9 bg-gray-100 border-none rounded-full" 
                placeholder="Search" 
              />
            </div>
          </div>
        </div>
        
        <main className="p-6">
          {loading ? (
            <div className="flex items-center justify-center h-[60vh]">
              <Loader size="lg" />
            </div>
          ) : (
            <>
              {templates.length > 0 ? (
                <MasonryGrid>
                  {templates.map((template) => (
                    <div key={template.id} className="mb-4 animate-slide-up">
                      <AdTemplateCard 
                        template={template} 
                        onClick={handleTemplateClick}
                      />
                    </div>
                  ))}
                </MasonryGrid>
              ) : (
                <div className="flex flex-col items-center justify-center h-[40vh] text-center">
                  <p className="text-muted-foreground mb-4">No templates found. Try refreshing the page.</p>
                  <Button onClick={() => fetchTemplates(true)}>Refresh</Button>
                </div>
              )}
              
              {templates.length > 0 && (
                <div className="mt-8 flex justify-center">
                  <Button 
                    onClick={handleLoadMore} 
                    disabled={loadingMore}
                    variant="outline"
                    className="min-w-[180px]"
                  >
                    {loadingMore ? <Loader size="sm" /> : "Load More Templates"}
                  </Button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
      
      <AdCustomizerModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        selectedTemplate={selectedTemplate}
      />
    </div>
  );
};

export default Index;
