
import Pinterest from 'pinterest.js';

export const fetchPinterestSuggestions = async (
  categoryId: string = "300052393940967985", 
  bookmark?: string
) => {
  try {
    console.log(`Fetching Pinterest suggestions for category: ${categoryId}`);
    const response = await Pinterest.suggestions(categoryId, bookmark);
    console.log('Pinterest response:', response);
    return response;
  } catch (error) {
    console.error('Error fetching Pinterest suggestions:', error);
    throw error;
  }
};

export const transformPinterestToTemplates = (pinterestResponse: any) => {
  if (!pinterestResponse || !pinterestResponse.response) {
    return { templates: [], bookmark: null };
  }

  const templates = pinterestResponse.response
    .filter((item: any) => item.type === 'pin' && item.imageURL)
    .map((item: any) => ({
      id: item.id,
      title: item.title || 'Pinterest Template',
      imageUrl: item.imageURL,
      aspectRatio: 1.2, // Default aspect ratio
      category: 'Pinterest'
    }));

  return {
    templates,
    bookmark: pinterestResponse.bookmark
  };
};
