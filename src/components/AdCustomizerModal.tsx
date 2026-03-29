
import { FC, useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Download, X, Image as ImageIcon, Loader2, ChevronDown } from 'lucide-react';
import { useCredits } from '@/contexts/CreditsContext';

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
  const [productImage, setProductImage] = useState<File | null>(null);
  const [productImagePreview, setProductImagePreview] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
  };

  const processUploadedFile = (file: File) => {
    setProductImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setProductImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
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
      const file = files[0];
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
      if (!spendCredits(1)) {
        return;
      }
      
      setIsAnalyzing(true);
      
      const generatedAdId = addGeneratedAd({
        title: selectedTemplate.title || 'Custom Ad',
        imageUrl: selectedTemplate.imageUrl,
        prompt: prompt,
        originalTemplateId: selectedTemplate.id
      });
      
      toast({
        title: "Ad generation started",
        description: "Your customized ad will be ready shortly.",
      });

      await analyzeImage(null);
      
      setTimeout(() => {
        updateGeneratedAdStatus(generatedAdId, 'completed');
        
        setTimeout(() => {
          onOpenChange(false);
          
          setPrompt(promptTemplates[0].text);
          setSelectedPromptId('custom');
          setProductImage(null);
          setProductImagePreview('');
          setAnalysisResult('');
          
          navigate('/creations');
        }, 1000);
      }, 2000);
    } catch (error) {
      console.error('Error generating ad:', error);
      toast({
        title: "Error generating ad",
        description: error instanceof Error ? error.message : "Failed to generate the ad. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
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
            Upload your product image and customize the prompt to create your inspired ad.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="product-image">1. Upload Your Product Image</Label>
              <div className="flex flex-col gap-2">
                <div 
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer 
                    ${isDragging ? 'border-primary bg-primary/5' : 'border-gray-300'} 
                    ${productImagePreview ? '' : 'hover:border-primary hover:bg-primary/5'}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={productImagePreview ? undefined : handleClickUpload}
                >
                  {productImagePreview ? (
                    <div className="relative">
                      <img 
                        src={productImagePreview} 
                        alt="Product preview" 
                        className="max-h-48 mx-auto rounded-lg"
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          setProductImage(null);
                          setProductImagePreview('');
                          setAnalysisResult('');
                        }}
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="text-sm text-gray-600">
                        <span className="relative cursor-pointer rounded-md font-medium text-black hover:text-gray-800">
                          <span>Upload a file</span>
                          <input
                            id="product-image-upload"
                            name="product-image"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleProductImageUpload}
                            ref={fileInputRef}
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
          >
            <Download size={16} />
            3. Generate Inspired Ad
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AdCustomizerModal;
