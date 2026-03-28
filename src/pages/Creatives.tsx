import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Download, Loader2, X, Expand } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import MasonryGrid from "@/components/MasonryGrid";
import { supabase } from "@/integrations/supabase/client";

interface GeneratedAd {
  id: string;
  user_id: string;
  image_url: string;
  prompt: string;
  status: string;
  created_at: string;
}

const Creatives: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [ads, setAds] = useState<GeneratedAd[]>([]);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          navigate('/auth');
          return;
        }

        const { data, error } = await supabase
          .from('generated_ads')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setAds(data || []);
      } catch (error) {
        console.error('Error in fetchAds:', error);
        toast({
          title: "Error",
          description: "Failed to load your generated ads",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, []);

  const getImageUrl = (path: string) => {
    return `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/generated-ads/${path}`;
  };

  return (
    <Layout title="Generated Ads">
      {loading ? (
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <>
          {ads.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 p-4 bg-gray-100 rounded-full">
                <Download size={24} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-bold mb-2 font-jakarta">
                No creations yet
              </h3>
              <p className="text-gray-500 mb-6 max-w-md font-jakarta">
                Start creating ads by exploring templates
              </p>
              <Button
                onClick={() => navigate("/dashboard")}
                className="bg-black hover:bg-black/90 text-white px-6 py-2 rounded-xl font-jakarta"
              >
                Explore Templates
              </Button>
            </div>
          ) : (
            <MasonryGrid>
              {ads.map((ad) => (
                <div key={ad.id} className="mb-4 animate-slide-up">
                  <div className="relative group">
                    <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-white shadow-one">
                      {ad.status === "pending" && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                          <div className="flex flex-col items-center text-white">
                            <Loader2 size={40} className="animate-spin mb-2" />
                            <p className="font-jakarta">Generating...</p>
                          </div>
                        </div>
                      )}
                      {ad.status === "failed" && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                          <div className="flex flex-col items-center text-white">
                            <X size={40} className="mb-2" />
                            <p className="font-jakarta">Failed</p>
                          </div>
                        </div>
                      )}
                      <img
                        src={getImageUrl(ad.image_url)}
                        alt="Generated ad"
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Hover overlay with actions */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-full bg-white/90 hover:bg-white text-black border-transparent"
                          onClick={() => window.open(getImageUrl(ad.image_url), '_blank')}
                        >
                          <Expand size={18} />
                        </Button>
                        {ad.status === "completed" && (
                          <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full bg-white/90 hover:bg-white text-black border-transparent"
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = getImageUrl(ad.image_url);
                              link.download = `generated-ad-${ad.id}.png`;
                              link.click();
                            }}
                          >
                            <Download size={18} />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </MasonryGrid>
          )}
        </>
      )}
    </Layout>
  );
};

export default Creatives;
