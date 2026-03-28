import { FC, useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Download, X, Image as ImageIcon, Loader2, ChevronDown } from 'lucide-react';
import { useCredits } from '@/contexts/CreditsContext';
import { createClient } from '@supabase/supabase-js';

interface AdCustomizerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTemplate: any | null;
}

const promptTemplates = [
  {
    id: 'custom',
    title: 'Custom Prompt',
    text: 'Repurpose this ad style for my brand, focusing on...',
  },
  {
    id: 'recreate',
    title: 'Product Replacement',
    text: 'Recreate this ad image by replacing the [original item] with [my product], and update the text to match the features and benefits of [my product]',
  },
  {
    id: 'style',
    title: 'Style Transfer',
    text: 'Transfer the visual style, layout and composition of this ad to showcase my product, while keeping the color scheme and aesthetic consistent.',
  }
];

const AdCustomizerModal: FC<AdCustomizerModalProps> = ({ 
  open, 
  onOpenChange,
  selectedTemplate
}) => {
  const navigate = useNavigate();
  const { useCredits: spendCredits, addGeneratedAd, updateGeneratedAdStatus } = useCredits();
  
  const [prompt, setPrompt] = useState(promptTemplates[0].text);
  const [selectedPromptId, setSelectedPromptId] = useState('custom');
  const [productImages, setProductImages] = useState<File[]>([]);
  const [productImagePreviews, setProductImagePreviews] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        processUploadedFile(files[i]);
      }
    }
  };

  const processUploadedFile = (file: File) => {
    setProductImages(prev => [...prev, file]);
    const reader = new FileReader();
    reader.onloadend = () => {
      setProductImagePreviews(prev => [...prev, reader.result as string]);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (index: number) => {
    setProductImages(prev => prev.filter((_, i) => i !== index));
    setProductImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('image/')) {
          processUploadedFile(file);
        } else {
          toast({
            title: "Invalid file type",
            description: "Please upload an image file.",
            variant: "destructive",
          });
        }
      }
    }
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  const selectPromptTemplate = (templateId: string) => {
    const template = promptTemplates.find(t => t.id === templateId);
    if (template) {
      setPrompt(template.text);
      setSelectedPromptId(templateId);
    }
    setShowTemplates(false);
  };

  const analyzeImage = async (file: File | null) => {
    try {
      setIsAnalyzing(true);
      setAnalysisResult('');

      let imageData;
      if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
          const base64Data = reader.result as string;
          const base64Image = base64Data.split(',')[1];
          imageData = { imageBase64: base64Image };
        };
      } else {
        imageData = { templateImageUrl: selectedTemplate.imageUrl };
      }

      console.log('Sending request with data:', { ...imageData, prompt });
      
      const response = await fetch('http://localhost:64693/api/analyze-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...imageData,
          prompt: prompt
        }),
      });

      console.log('Response status:', response.status);
      const responseText = await response.text();
      console.log('Response text:', responseText);

      if (!response.ok) {
        throw new Error(`Failed to analyze image: ${responseText}`);
      }

      setAnalysisResult(responseText);
    } catch (error) {
      console.error('Error analyzing image:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateAd = async () => {
    try {
      setIsGenerating(true);
      
      const supabase = createClient(
        import.meta.env.VITE_SUPABASE_URL,
        import.meta.env.VITE_SUPABASE_ANON_KEY
      );

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "Please sign in to generate ads",
          variant: "destructive",
        });
        return;
      }

      // First, upload the images to Supabase Storage
      const uploadedImageUrls = await Promise.all(
        productImages.map(async (file) => {
          const fileExt = file.name.split('.').pop();
          const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
          
          const { data, error } = await supabase.storage
            .from('generated-ads')
            .upload(fileName, file, {
              contentType: file.type,
              upsert: true
            });

          if (error) throw error;

          return `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/generated-ads/${data.path}`;
        })
      );

      // Then call the Edge Function with the image URLs
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-ad`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          images: uploadedImageUrls,
          prompt: prompt,
          userId: user.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate ad');
      }

      const result = await response.json();
      
      toast({
        title: "Success!",
        description: "Your ad has been generated successfully.",
      });

      // Navigate to the generated ads page
      navigate('/generated-ads');
      
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  if (!selectedTemplate) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl bg-gradient-to-bl from-rose-50 to-teal-50">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <DialogTitle className="text-2xl font-semibold">Repurpose This Ad Style</DialogTitle>
          </div>
          <DialogDescription>
            Upload your product images and customize the prompt to create your inspired ads.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="product-images">1. Upload Your Product Images</Label>
              <div className="flex flex-col gap-2">
                <div 
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer 
                    ${isDragging ? 'border-primary bg-primary/5' : 'border-gray-300'} 
                    ${productImagePreviews.length > 0 ? '' : 'hover:border-primary hover:bg-primary/5'}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={productImagePreviews.length > 0 ? undefined : handleClickUpload}
                >
                  {productImagePreviews.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4">
                      {productImagePreviews.map((preview, index) => (
                        <div key={index} className="relative">
                          <img 
                            src={preview} 
                            alt={`Product preview ${index + 1}`} 
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <Button
                            size="icon"
                            variant="ghost"
                            className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveImage(index);
                            }}
                          >
                            <X size={16} />
                          </Button>
                        </div>
                      ))}
                      <div 
                        className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-primary"
                        onClick={handleClickUpload}
                      >
                        <ImageIcon className="mx-auto h-8 w-8 text-gray-400" />
                        <p className="text-sm text-gray-600 mt-2">Add more images</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="text-sm text-gray-600">
                        <span className="relative cursor-pointer rounded-md font-medium text-black hover:text-gray-800">
                          <span>Upload files</span>
                          <input
                            id="product-images-upload"
                            name="product-images"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleProductImageUpload}
                            ref={fileInputRef}
                            multiple
                          />
                        </span>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="prompt-template">2. Choose Your Prompt Style</Label>
              <div className="relative">
                <div 
                  className="flex items-center justify-between p-3 border rounded-md cursor-pointer hover:border-primary"
                  onClick={() => setShowTemplates(!showTemplates)}
                >
                  <span>{promptTemplates.find(t => t.id === selectedPromptId)?.title || 'Custom Prompt'}</span>
                  <ChevronDown size={16} className={`transition-transform ${showTemplates ? 'rotate-180' : ''}`} />
                </div>
                
                {showTemplates && (
                  <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
                    {promptTemplates.map(template => (
                      <div 
                        key={template.id}
                        className={`p-3 hover:bg-gray-100 cursor-pointer ${selectedPromptId === template.id ? 'bg-gray-50' : ''}`}
                        onClick={() => selectPromptTemplate(template.id)}
                      >
                        {template.title}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <Textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                className="shadow-one"
                placeholder="Describe how you'd like to adapt this style for your brand..."
              />
              {isAnalyzing && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing image...
                </div>
              )}
              {analysisResult && (
                <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm text-gray-700">
                  <p className="font-medium mb-1">Analysis Result:</p>
                  <p>{analysisResult}</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="rounded-lg border border-border overflow-hidden bg-cloud shadow-one">
            <div className="aspect-[4/5] relative">
              <img 
                src={selectedTemplate.imageUrl}
                alt={selectedTemplate.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="shadow-one">
            Cancel
          </Button>
          <Button 
            onClick={handleGenerateAd} 
            className="gap-1.5 bg-black text-white shadow-one"
            disabled={isGenerating || productImages.length === 0}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download size={16} />
                3. Generate Inspired Ad
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AdCustomizerModal;
