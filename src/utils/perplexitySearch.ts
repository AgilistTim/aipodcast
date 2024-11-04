import axios from 'axios';

export interface SearchResult {
  summary: string;
  details: string[];
}

const handleApiError = (error: unknown): never => {
  if (axios.isAxiosError(error) && error.response) {
    throw new Error(`API Error: ${error.response.status} - ${error.response.data.error || 'Unknown error'}`);
  }
  throw new Error('Failed to fetch search results. Please try again.');
};

const parseJsonResponse = (content: string): SearchResult[] => {
  const jsonMatch = content.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    return formatTextResponse(content);
  }

  try {
    const parsedContent = JSON.parse(jsonMatch[0]);
    if (Array.isArray(parsedContent) && parsedContent.every(isValidSearchResult)) {
      return parsedContent;
    }
  } catch (parseError) {
    console.error('Failed to parse JSON:', parseError);
  }

  return formatTextResponse(content);
};

const isValidSearchResult = (result: any): result is SearchResult => {
  return (
    typeof result === 'object' &&
    result !== null &&
    typeof result.summary === 'string' &&
    Array.isArray(result.details) &&
    result.details.every((detail: any) => typeof detail === 'string')
  );
};

const formatTextResponse = (content: string): SearchResult[] => {
  const sections = content.split('\n\n').filter(Boolean);
  return sections.map(section => {
    const lines = section.split('\n').filter(Boolean);
    return {
      summary: lines[0].replace(/^[#\-*•]\s*/, ''),
      details: lines.slice(1).map(line => line.replace(/^[#\-*•]\s*/, ''))
    };
  });
};

export const perplexitySearch = async (query: string): Promise<SearchResult[]> => {
  if (!import.meta.env.VITE_PERPLEXITY_API_KEY) {
    throw new Error('Perplexity API key is not configured');
  }

  try {
    const response = await axios.post(
      'https://api.perplexity.ai/chat/completions',
      {
        model: 'llama-3.1-sonar-huge-128k-online',
        messages: [
          {
            role: 'system',
            content: `You are a research assistant. Format your response as a JSON array of research findings. 
            Each item should have a "summary" field (a brief overview) and a "details" array (specific points).
            Example format:
            [
              {
                "summary": "Brief overview of the first topic",
                "details": ["Detail 1", "Detail 2", "Detail 3"]
              },
              {
                "summary": "Brief overview of the second topic",
                "details": ["Detail 1", "Detail 2", "Detail 3"]
              }
            ]`
          },
          {
            role: 'user',
            content: `Research the following topic and provide detailed analysis in the specified JSON format: ${query}`
          }
        ],
        max_tokens: 4000,
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const content = response.data.choices[0].message.content;
    return parseJsonResponse(content);
  } catch (error) {
    return handleApiError(error);
  }
};
