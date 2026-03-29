
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from '@/hooks/use-toast';

export interface GeneratedAd {
  id: string;
  title: string;
  imageUrl: string;
  prompt: string;
  originalTemplateId: string;
  createdAt: Date;
  status: 'generating' | 'completed' | 'failed';
}

interface CreditsContextType {
  credits: {
    used: number;
    total: number;
    percentage: number;
  };
  generatedAds: GeneratedAd[];
  currentlyGenerating: GeneratedAd | null;
  useCredits: (amount: number) => boolean;
  addGeneratedAd: (ad: Omit<GeneratedAd, 'id' | 'createdAt' | 'status'>) => string;
  updateGeneratedAdStatus: (id: string, status: GeneratedAd['status']) => void;
  clearCurrentlyGenerating: () => void;
}

const CreditsContext = createContext<CreditsContextType | undefined>(undefined);

export const useCredits = () => {
  const context = useContext(CreditsContext);
  if (!context) {
    throw new Error('useCredits must be used within a CreditsProvider');
  }
  return context;
};

interface CreditsProviderProps {
  children: ReactNode;
}

export const CreditsProvider: React.FC<CreditsProviderProps> = ({ children }) => {
  // TODO: Replace with actual credit data from API in the future
  const [credits, setCredits] = useState({
    used: 25,
    total: 100,
    percentage: 25
  });
  
  const [generatedAds, setGeneratedAds] = useState<GeneratedAd[]>([]);
  const [currentlyGenerating, setCurrentlyGenerating] = useState<GeneratedAd | null>(null);

  // Load generated ads from localStorage on initial mount
  useEffect(() => {
    const savedAds = localStorage.getItem('generatedAds');
    if (savedAds) {
      try {
        const parsedAds = JSON.parse(savedAds);
        // Convert string dates back to Date objects
        const processedAds = parsedAds.map((ad: any) => ({
          ...ad,
          createdAt: new Date(ad.createdAt)
        }));
        setGeneratedAds(processedAds);
      } catch (error) {
        console.error('Failed to parse saved ads:', error);
      }
    }
  }, []);

  // Save generated ads to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('generatedAds', JSON.stringify(generatedAds));
  }, [generatedAds]);

  const useCredits = (amount: number): boolean => {
    if (credits.used + amount > credits.total) {
      toast({
        title: "Not enough credits",
        description: "You don't have enough credits to perform this action.",
        variant: "destructive",
      });
      return false;
    }

    setCredits(prev => {
      const newUsed = prev.used + amount;
      return {
        ...prev,
        used: newUsed,
        percentage: Math.round((newUsed / prev.total) * 100)
      };
    });
    return true;
  };

  const addGeneratedAd = (ad: Omit<GeneratedAd, 'id' | 'createdAt' | 'status'>): string => {
    const id = `ad-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const newAd: GeneratedAd = {
      ...ad,
      id,
      createdAt: new Date(),
      status: 'generating'
    };
    
    setGeneratedAds(prev => [newAd, ...prev]);
    setCurrentlyGenerating(newAd);
    
    return id;
  };

  const updateGeneratedAdStatus = (id: string, status: GeneratedAd['status']) => {
    setGeneratedAds(prev => 
      prev.map(ad => 
        ad.id === id ? { ...ad, status } : ad
      )
    );
    
    if (currentlyGenerating?.id === id) {
      setCurrentlyGenerating(prev => prev ? { ...prev, status } : null);
    }
  };

  const clearCurrentlyGenerating = () => {
    setCurrentlyGenerating(null);
  };

  return (
    <CreditsContext.Provider 
      value={{ 
        credits, 
        generatedAds, 
        currentlyGenerating,
        useCredits, 
        addGeneratedAd, 
        updateGeneratedAdStatus,
        clearCurrentlyGenerating
      }}
    >
      {children}
    </CreditsContext.Provider>
  );
};
