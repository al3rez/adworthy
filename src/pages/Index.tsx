
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import MasonryGrid from '@/components/MasonryGrid';
import AdTemplateCard from '@/components/AdTemplateCard';
import AdCustomizerModal from '@/components/AdCustomizerModal';
import CategoriesFilter from '@/components/CategoriesFilter';
import Loader from '@/components/Loader';

// Sample data for ad templates
const adTemplates = [
  {
    id: '1',
    title: 'Modern Tech Product Showcase',
    imageUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=600&h=800',
    aspectRatio: 1.33,
    category: 'Tech'
  },
  {
    id: '2',
    title: 'Elegant Fashion Promotion',
    imageUrl: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=600&h=900',
    aspectRatio: 1.5,
    category: 'Fashion'
  },
  {
    id: '3',
    title: 'Creative Design Portfolio',
    imageUrl: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=600&h=600',
    aspectRatio: 1,
    category: 'Design'
  },
  {
    id: '4',
    title: 'Food Delivery Service',
    imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cee6a6?auto=format&fit=crop&w=600&h=700',
    aspectRatio: 1.17,
    category: 'Food'
  },
  {
    id: '5',
    title: 'Health & Wellness Product',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&h=900',
    aspectRatio: 1.5,
    category: 'Health'
  },
  {
    id: '6',
    title: 'Travel Destination Promotion',
    imageUrl: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=600&h=400',
    aspectRatio: 0.67,
    category: 'Travel'
  },
  {
    id: '7',
    title: 'Business Conference Event',
    imageUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=600&h=500',
    aspectRatio: 0.83,
    category: 'Business'
  },
  {
    id: '8',
    title: 'Fitness App Promotion',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&h=700',
    aspectRatio: 1.17,
    category: 'Fitness'
  },
  {
    id: '9',
    title: 'Music Streaming Service',
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&h=600',
    aspectRatio: 1,
    category: 'Music'
  },
  {
    id: '10',
    title: 'Educational Course Promo',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&h=800',
    aspectRatio: 1.33,
    category: 'Education'
  },
  {
    id: '11',
    title: 'Mobile App Launch',
    imageUrl: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=600&h=1000',
    aspectRatio: 1.67,
    category: 'Tech'
  },
  {
    id: '12',
    title: 'Real Estate Property Showcase',
    imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&h=500',
    aspectRatio: 0.83,
    category: 'Real Estate'
  },
  {
    id: '13',
    title: 'Financial Services Ad',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&h=600',
    aspectRatio: 1,
    category: 'Finance'
  },
  {
    id: '14',
    title: 'Green Energy Promotion',
    imageUrl: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=600&h=900',
    aspectRatio: 1.5,
    category: 'Energy'
  },
  {
    id: '15',
    title: 'Automotive New Model',
    imageUrl: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=600&h=400',
    aspectRatio: 0.67,
    category: 'Automotive'
  },
];

const categories = [
  'Tech', 'Fashion', 'Design', 'Food', 'Health', 'Travel', 
  'Business', 'Fitness', 'Music', 'Education', 'Real Estate', 
  'Finance', 'Energy', 'Automotive'
];

const Index = () => {
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredTemplates, setFilteredTemplates] = useState(adTemplates);
  
  useEffect(() => {
    // Simulate loading templates
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredTemplates(adTemplates);
    } else {
      setFilteredTemplates(adTemplates.filter(template => 
        template.category === selectedCategory
      ));
    }
  }, [selectedCategory]);
  
  const handleTemplateClick = (template: any) => {
    setSelectedTemplate(template);
    setModalOpen(true);
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-16 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Ad Templates</h1>
          <p className="text-muted-foreground">
            Browse our collection of beautiful ad templates and customize them for your needs.
          </p>
        </div>
        
        <CategoriesFilter 
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
        
        {loading ? (
          <div className="flex items-center justify-center h-[60vh]">
            <Loader size="lg" />
          </div>
        ) : (
          <MasonryGrid>
            {filteredTemplates.map((template) => (
              <div key={template.id} className="mb-4 animate-slide-up">
                <AdTemplateCard 
                  template={template} 
                  onClick={handleTemplateClick}
                />
              </div>
            ))}
          </MasonryGrid>
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
