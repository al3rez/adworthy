import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Download, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useCredits, GeneratedAd } from "@/contexts/CreditsContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/Layout";
import MasonryGrid from "@/components/MasonryGrid";

const Creatives: React.FC = () => {
  const { generatedAds } = useCredits();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});
  const [generatedAdsHistory, setGeneratedAdsHistory] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    generatedAds.forEach(ad => {
      if (
        ad.status === 'completed' &&
        !generatedAdsHistory[ad.id] &&
        !loadingStates[ad.id]
      ) {
        setLoadingStates(prev => ({ ...prev, [ad.id]: true }));
        setTimeout(() => {
          setLoadingStates(prev => ({ ...prev, [ad.id]: false }));
          setGeneratedAdsHistory(prev => ({ ...prev, [ad.id]: true }));
        }, 30000); // 30 seconds loading
      }
    });
  }, [generatedAds]);

  const getResultImage = (imageUrl: string) => {
    if (
      imageUrl ===
      "https://i.pinimg.com/originals/8c/fb/5a/8cfb5a39f9cf15d6c6056530f997e253.jpg"
    ) {
      return "/product1_result.png";
    } else if (
      imageUrl ===
      "https://i.pinimg.com/originals/8f/eb/b5/8febb52262652fe8f490ca2697fed587.jpg"
    ) {
      return "/product_result_2.png";
    }
    return imageUrl;
  };

  const getImageSource = (ad: GeneratedAd) => {
    if (ad.status === 'completed' && generatedAdsHistory[ad.id]) {
      return getResultImage(ad.imageUrl);
    }
    return ad.imageUrl;
  };

  const shouldShowLoadingOverlay = (ad: GeneratedAd) => {
    return ad.status === 'generating' || loadingStates[ad.id];
  };

  const shouldShowCompletedState = (ad: GeneratedAd) => {
    return ad.status === 'completed' && generatedAdsHistory[ad.id];
  };

  const handleDownload = (ad: GeneratedAd) => {
    toast({
      title: "Download started",
      description: "Your generated ad is being downloaded.",
    });
    window.open(getResultImage(ad.imageUrl), "_blank");
  };

  const filteredAds = activeFilter
    ? generatedAds.filter((ad) => ad.status === activeFilter)
    : generatedAds;

  const headerActions = (
    <div className="flex items-center gap-2">
      <Button
        variant={activeFilter === "generating" ? "default" : "outline"}
        onClick={() =>
          setActiveFilter(activeFilter === "generating" ? null : "generating")
        }
        className="text-sm font-jakarta"
      >
        In Progress
      </Button>
      <Button
        variant={activeFilter === "completed" ? "default" : "outline"}
        onClick={() =>
          setActiveFilter(activeFilter === "completed" ? null : "completed")
        }
        className="text-sm font-jakarta"
      >
        Completed
      </Button>
      <Button
        variant={activeFilter === "failed" ? "default" : "outline"}
        onClick={() =>
          setActiveFilter(activeFilter === "failed" ? null : "failed")
        }
        className="text-sm font-jakarta"
      >
        Failed
      </Button>
    </div>
  );

  return (
    <Layout title="Generated Ads" headerActions={headerActions}>
      <Tabs defaultValue="grid" className="w-full">
        {/* <div className="flex justify-between items-center mb-6">
          <TabsList className="font-jakarta">
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>
        </div> */}

        <TabsContent value="grid" className="w-full">
          {filteredAds.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 p-4 bg-gray-100 rounded-full">
                <Download size={24} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-bold mb-2 font-jakarta">
                No creations yet
              </h3>
              <p className="text-gray-500 mb-6 max-w-md font-jakarta">
                Start creating ads by exploring templates and customizing them
                to fit your brand.
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
              {filteredAds.map((ad) => (
                <div key={ad.id} className="mb-4 animate-slide-up">
                  <div
                    className={`bg-white rounded-2xl shadow-one overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300 ${
                      shouldShowCompletedState(ad)
                        ? "ring-2 ring-green-500"
                        : ""
                    }`}
                  >
                    <div className="relative aspect-[3/4] overflow-hidden">
                      {shouldShowLoadingOverlay(ad) && (
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
                            <p className="font-jakarta">Generation failed</p>
                          </div>
                        </div>
                      )}
                      <img
                        src={getImageSource(ad)}
                        alt={ad.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Download Button */}
                      {shouldShowCompletedState(ad) && (
                        <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full bg-white hover:bg-white/90 text-black border-white"
                            onClick={() => handleDownload(ad)}
                          >
                            <Download size={18} />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </MasonryGrid>
          )}
        </TabsContent>

        <TabsContent value="list" className="w-full">
          {filteredAds.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 p-4 bg-gray-100 rounded-full">
                <Download size={24} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-bold mb-2 font-jakarta">
                No creations yet
              </h3>
              <p className="text-gray-500 mb-6 max-w-md font-jakarta">
                Start creating ads by exploring templates and customizing them
                to fit your brand.
              </p>
              <Button
                onClick={() => navigate("/dashboard")}
                className="bg-black hover:bg-black/90 text-white px-6 py-2 rounded-xl font-jakarta"
              >
                Explore Templates
              </Button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-one border border-gray-200 overflow-hidden">
              <div className="grid grid-cols-[1fr_2fr_1fr_1fr] px-4 py-3 border-b border-gray-200 bg-gray-50 font-medium text-sm font-jakarta">
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
                  <div className="w-16 h-16 rounded-2xl overflow-hidden relative">
                    {shouldShowLoadingOverlay(ad) && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                        <Loader2 size={20} className="animate-spin text-white" />
                      </div>
                    )}
                    <img
                      src={getImageSource(ad)}
                      alt={ad.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full capitalize font-jakarta ${
                        shouldShowCompletedState(ad)
                          ? "bg-green-100 text-green-700"
                          : shouldShowLoadingOverlay(ad)
                          ? "bg-blue-100 text-blue-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {shouldShowLoadingOverlay(ad) ? "Generating..." : ad.status}
                    </span>
                  </div>

                  <div className="text-right">
                    {shouldShowCompletedState(ad) && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs font-jakarta"
                        onClick={() => handleDownload(ad)}
                      >
                        <Download size={14} className="mr-1" />
                        Download
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default Creatives;
