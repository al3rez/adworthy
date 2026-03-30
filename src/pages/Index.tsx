
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import MasonryGrid from '@/components/MasonryGrid';
import AdTemplateCard from '@/components/AdTemplateCard';
import AdCustomizerModal from '@/components/AdCustomizerModal';
import Loader from '@/components/Loader';
import { fetchPinterestSuggestions, transformPinterestToTemplates } from '@/utils/pinterestApi';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);
  const [templates, setTemplates] = useState<any[]>([]);
  const [bookmark, setBookmark] = useState<string | undefined>(undefined);
  const [loadingMore, setLoadingMore] = useState(false);
  const { toast } = useToast();
  
  const fetchTemplates = async (resetExisting = false) => {
    try {
      const currentBookmark = resetExisting ? undefined : bookmark;
      setLoading(resetExisting);
      setLoadingMore(!resetExisting && templates.length > 0);
      
      const pinterestResponse = await fetchPinterestSuggestions("300052393940967985", currentBookmark);
      const { templates: newTemplates, bookmark: newBookmark } = transformPinterestToTemplates(pinterestResponse);
      
      if (resetExisting) {
        setTemplates(newTemplates);
      } else {
        setTemplates(prev => [...prev, ...newTemplates]);
      }
      
      setBookmark(newBookmark);
    } catch (error) {
      console.error('Error loading templates:', error);
      toast({
        title: "Error loading templates",
        description: "There was a problem fetching templates from Pinterest",
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
    if (bookmark) {
      fetchTemplates();
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-16 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Pinterest Ad Templates</h1>
          <p className="text-muted-foreground">
            Browse Pinterest templates and customize them for your ad needs.
          </p>
        </div>
        
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
            
            {templates.length > 0 && bookmark && (
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
      
      <AdCustomizerModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        selectedTemplate={selectedTemplate}
      />
    </div>
  );
};

export default Index;
