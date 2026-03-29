import { useState, useEffect } from 'react';
import AdTemplateCard from '@/components/AdTemplateCard';
import AdCustomizerModal from '@/components/AdCustomizerModal';
import Loader from '@/components/Loader';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { fetchAdTemplates, AdTemplate } from '@/utils/apiService';
import MasonryGrid from '@/components/MasonryGrid';
import Layout from '@/components/Layout';

const transformToTemplateFormat = (templates: AdTemplate[]) => {
  return templates.map(template => ({
    id: template.id,
    title: template.title || 'Ad Template',
    imageUrl: template.imageURL,
    aspectRatio: 1.2,
    category: template.pinner?.fullName || 'The Farmer\'s Dog'
  }));
};

const Dashboard = () => {
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
    <Layout title="Explore">
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
              <p className="text-[#536772] mb-4 font-jakarta">No templates found. Try refreshing the page.</p>
              <Button 
                onClick={() => fetchTemplates(true)}
                className="bg-black hover:bg-black/90 text-white px-6 py-2 rounded-xl font-jakarta"
              >
                Refresh
              </Button>
            </div>
          )}
          
          {templates.length > 0 && (
            <div className="mt-8 flex justify-center">
              <Button 
                onClick={handleLoadMore} 
                disabled={loadingMore}
                variant="outline"
                className="min-w-[180px] bg-white text-black border-black hover:bg-black hover:text-white rounded-xl font-jakarta"
              >
                {loadingMore ? <Loader size="sm" /> : "Load More Templates"}
              </Button>
            </div>
          )}
        </>
      )}
      
      <AdCustomizerModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        selectedTemplate={selectedTemplate}
      />
    </Layout>
  );
};

export default Dashboard; 