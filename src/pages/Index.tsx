
import { useState, useEffect } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import Sidebar from '@/components/Sidebar';
import MasonryGrid from '@/components/MasonryGrid';
import AdTemplateCard from '@/components/AdTemplateCard';
import AdCustomizerModal from '@/components/AdCustomizerModal';
import Loader from '@/components/Loader';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { fetchAdTemplates, AdTemplate } from '@/utils/apiService';

const exploreTitle = (path: string) => {
  const pathSegments = path.split('/');
  const lastSegment = pathSegments[pathSegments.length - 1];
  
  if (pathSegments.includes('collections')) {
    return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1).replace('-', ' ');
  }
  
  return 'Explore';
};

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
  
  const title = exploreTitle(window.location.pathname);
  
  return (
    <div className="min-h-screen bg-background">
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full">
          <Sidebar />
          
          <div className="flex-1 w-full">
            <div className="sticky top-0 z-10 bg-background border-b border-border py-3 px-6">
              <div className="max-w-full mx-auto flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-amber-600">🏠</span>
                  <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
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
        </div>
      </SidebarProvider>
      
      <AdCustomizerModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        selectedTemplate={selectedTemplate}
      />
    </div>
  );
};

export default Index;
