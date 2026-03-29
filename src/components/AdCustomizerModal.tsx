import { FC, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Upload, Download, X, Image as ImageIcon } from 'lucide-react';

interface AdCustomizerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTemplate: any | null;
}

const AdCustomizerModal: FC<AdCustomizerModalProps> = ({ 
  open, 
  onOpenChange,
  selectedTemplate
}) => {
  const [prompt, setPrompt] = useState('Repurpose this ad style for my brand, focusing on...');
  const [productImage, setProductImage] = useState<File | null>(null);
  const [productImagePreview, setProductImagePreview] = useState<string>('');
  
  const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProductImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateAd = () => {
    if (!productImage) {
      toast({
        title: "Missing product image",
        description: "Please upload your product image before generating the ad.",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would call an API to generate the ad
    toast({
      title: "Ad generation started",
      description: "Your customized ad will be ready shortly.",
    });
    
    // Close the modal
    setTimeout(() => {
      onOpenChange(false);
      
      // Reset form
      setPrompt('Repurpose this ad style for my brand, focusing on...');
      setProductImage(null);
      setProductImagePreview('');
    }, 1000);
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
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
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
                        onClick={() => {
                          setProductImage(null);
                          setProductImagePreview('');
                        }}
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="text-sm text-gray-600">
                        <label
                          htmlFor="product-image-upload"
                          className="relative cursor-pointer rounded-md font-medium text-black hover:text-gray-800"
                        >
                          <span>Upload a file</span>
                          <input
                            id="product-image-upload"
                            name="product-image"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleProductImageUpload}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="prompt">2. Customize Your Vision</Label>
              <Textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                className="shadow-one"
                placeholder="Describe how you'd like to adapt this style for your brand..."
              />
            </div>
          </div>
          
          <div className="rounded-lg border border-border overflow-hidden bg-cloud shadow-one">
            <div className="aspect-[4/5] relative">
              <img 
                src={selectedTemplate.imageUrl}
                alt={selectedTemplate.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                {productImagePreview ? (
                  <div className="p-6 bg-black/70 backdrop-blur-sm rounded-lg text-white animate-fade-in w-full h-full flex flex-col items-center justify-center">
                    <img 
                      src={productImagePreview} 
                      alt="Product preview" 
                      className="max-h-48 rounded-lg mb-4"
                    />
                  </div>
                ) : (
                <></>)}
              </div>
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
            disabled={!productImage}
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
