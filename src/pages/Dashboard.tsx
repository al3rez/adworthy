import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Progress } from '@/components/ui/progress';
import AdTemplateCard from '@/components/AdTemplateCard';
import AdCustomizerModal from '@/components/AdCustomizerModal';
import Loader from '@/components/Loader';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { fetchAdTemplates, AdTemplate } from '@/utils/apiService';
import MasonryGrid from '@/components/MasonryGrid';
import Layout from '@/components/Layout';
import { FC } from 'react';
import { Badge } from '@/components/ui/badge';

interface PricingTier {
  id: string;
  name: string;
  type: 'starter' | 'pro' | 'enterprise';
  price_usd: number;
  credits: number;
  additional_credit_price: number;
}

interface Subscription {
  id: string;
  tier_id: string;
  credits_total: number;
  credits_used: number;
  additional_credits: number;
  current_period_end: string;
  active: boolean;
  pricing_tier: PricingTier;
}

const transformToTemplateFormat = (templates: AdTemplate[]) => {
  return templates.map(template => ({
    id: template.id,
    title: template.title || 'Ad Template',
    imageUrl: template.imageURL,
    aspectRatio: 1.2,
    category: template.pinner?.fullName || 'The Farmer\'s Dog'
  }));
};

const SubscriptionStatus: FC = () => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('subscriptions')
          .select(`
            *,
            pricing_tier:tier_id (*)
          `)
          .eq('user_id', user.id)
          .eq('active', true)
          .single();

        if (error) throw error;
        setSubscription(data);
      } catch (error) {
        console.error('Error fetching subscription:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, []);

  if (loading) {
    return <Badge variant="outline" className="animate-pulse">Loading...</Badge>;
  }

  if (!subscription) {
    return (
      <Badge 
        variant="destructive" 
        className="cursor-pointer hover:bg-destructive/90"
        onClick={() => navigate('/subscription')}
      >
        Subscribe Now
      </Badge>
    );
  }

  return (
    <Badge 
      variant="outline" 
      className="cursor-pointer hover:bg-accent"
      onClick={() => navigate('/subscription')}
    >
      {subscription.pricing_tier.name} Plan
    </Badge>
  );
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
    <Layout title="Explore" rightContent={<SubscriptionStatus />}>
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
                className="bg-black hover:bg-black/90 text-white px-6 py-3 rounded-xl font-jakarta"
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
                className="min-w-[180px] bg-black hover:bg-black/90 text-white rounded-xl font-jakarta px-6 py-3"
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