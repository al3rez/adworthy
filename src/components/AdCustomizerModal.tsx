
import { FC, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Upload, Download, X } from 'lucide-react';

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
  const [headline, setHeadline] = useState('');
  const [description, setDescription] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  
  const handleGenerateAd = () => {
    // In a real app, this would call an API to generate the ad
    toast({
      title: "Ad generation started",
      description: "Your customized ad will be ready shortly.",
    });
    
    // Close the modal
    setTimeout(() => {
      onOpenChange(false);
      
      // Reset form
      setHeadline('');
      setDescription('');
      setLogoUrl('');
    }, 1000);
  };
  
  if (!selectedTemplate) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl bg-gradient-to-bl from-rose-50 to-teal-50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Customize Ad Template</DialogTitle>
          <DialogDescription>
            Modify this template with your own content and generate a new ad.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="headline">Headline</Label>
              <Input
                id="headline"
                placeholder="Enter your headline"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="shadow-one"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter your ad copy"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="shadow-one"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="logo">Your Logo</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="logo"
                  placeholder="Upload or paste image URL"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  className="shadow-one"
                />
                <Button size="icon" variant="outline" className="shadow-one">
                  <Upload size={16} />
                </Button>
              </div>
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
                <div className="p-6 bg-black/70 backdrop-blur-sm rounded-lg text-white animate-fade-in">
                  <p className="text-sm font-medium">Preview will appear here</p>
                </div>
              </div>
            </div>
            <div className="p-3 flex justify-between items-center">
              <span className="text-sm font-medium">{selectedTemplate.title}</span>
              <Button size="sm" variant="ghost">
                <X size={14} className="mr-1" />
                Reset
              </Button>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="shadow-one">
            Cancel
          </Button>
          <Button onClick={handleGenerateAd} className="gap-1.5 bg-black text-white shadow-one">
            <Download size={16} />
            Generate Ad
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AdCustomizerModal;
