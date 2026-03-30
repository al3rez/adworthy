
import { toast } from '@/hooks/use-toast';

export interface AdTemplate {
  id: string;
  title: string;
  imageURL: string;
  pinner?: {
    id: string;
    username: string;
    fullName: string;
    avatarURL: string;
    followers: any;
  };
  date?: {
    formatted: string;
    initial: string;
  };
  type: string;
}

export async function fetchAdTemplates() {
  try {
    const response = await fetch('http://localhost:8888/api/hello', {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data: AdTemplate[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching ad templates:', error);
    toast({
      title: 'Error fetching templates',
      description: 'Failed to load ad templates. Please try again later.',
      variant: 'destructive',
    });
    return [];
  }
}
