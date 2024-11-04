import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody, Input, Button, Select, SelectItem, Checkbox } from "@nextui-org/react";
import { PodcastContext } from '../context/PodcastContext';
import { perplexitySearch, SearchResult } from '../utils/perplexitySearch';
import { useAuth } from '../context/AuthContext';
import SearchSection from '../components/SearchSection';
import OpenAI from 'openai';

const VOICE_OPTIONS = [
  { value: 'alloy', label: 'Alloy (Neutral)' },
  { value: 'echo', label: 'Echo (Deeper, Confident)' },
  { value: 'fable', label: 'Fable (Warm, Engaging)' },
  { value: 'onyx', label: 'Onyx (Deep, Authoritative)' },
  { value: 'nova', label: 'Nova (Clear, Professional)' },
  { value: 'shimmer', label: 'Shimmer (Bright, Energetic)' }
] as const;

const STYLE_OPTIONS = [
  { value: 'casual', label: 'Casual Conversation' },
  { value: 'formal', label: 'Formal Discussion' },
  { value: 'educational', label: 'Educational Content' },
  { value: 'humorous', label: 'Humorous/Entertainment' },
  { value: 'debate', label: 'Debate Format' }
];

const PodcastConfig: React.FC = () => {
  const { setPodcastConfig, setTranscript } = useContext(PodcastContext);
  const navigate = useNavigate();
  const { user, getApiKeys, isOnline } = useAuth();

  const [formData, setFormData] = useState({
    podcastName: '',
    voice1Name: '',
    voice2Name: '',
    voice1: 'echo',
    voice2: 'nova',
    topic: '',
    additionalInfo: '',
    podcastStyle: '',
    useOnlineSearch: false
  });

  const [error, setError] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedResults, setSelectedResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [apiKeysPresent, setApiKeysPresent] = useState(false);

  useEffect(() => {
    const checkApiKeys = async () => {
      try {
        const keys = await getApiKeys();
        setApiKeysPresent(!!keys && !!keys.openaiKey && !!keys.perplexityKey);
      } catch (err) {
        console.error('Error checking API keys:', err);
        setError('Failed to check API keys. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    checkApiKeys();
  }, [getApiKeys]);

  const handleInputChange = (
    value: string,
    name: string
  ) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, useOnlineSearch: checked }));
  };

  const handleSearch = async (query: string) => {
    setIsSearching(true);
    setSearchError('');

    try {
      const results = await perplexitySearch(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching:', error);
      setSearchError(error instanceof Error ? error.message : 'An error occurred while searching');
    } finally {
      setIsSearching(false);
    }
  };

  const handleResultSelection = (result: SearchResult) => {
    setSelectedResults(prev => {
      const isAlreadySelected = prev.some(r => r.summary === result.summary);
      if (isAlreadySelected) {
        return prev.filter(r => r.summary !== result.summary);
      }
      return [...prev, result];
    });
  };

  const generateTranscript = async (config: typeof formData, selectedContent: string) => {
    try {
      const keys = await getApiKeys();
      if (!keys?.openaiKey) {
        throw new Error('OpenAI API key is missing');
      }

      const openai = new OpenAI({
        apiKey: keys.openaiKey,
        dangerouslyAllowBrowser: true
      });

      const completion = await openai.chat.completions.create({
        model: "chatgpt-4o-latest",
        messages: [
          {
            role: "system",
            content: `You are an AI assistant that generates podcast scripts. The podcast is called "${config.podcastName}". The style of the podcast is ${config.podcastStyle}. The hosts are ${config.voice1Name} and ${config.voice2Name}. Create a natural conversation between them, including proper podcast etiquette. Use [${config.voice1Name.toUpperCase()}] and [${config.voice2Name.toUpperCase()}] to indicate speaker changes. IMPORTANT:**Do not include any stage directions, sound effects, or music cues**. The transcript should be at least 1500 words long.`
          },
          {
            role: "user",
            content: `Generate a podcast script about ${config.topic}. IMPORTANT:**Do not include any stage directions, sound effects, or music cues** The script should be engaging, informative, and follow good podcast structure and be around 1500 words. Use the following content as a reference if provided: ${config.additionalInfo}\n\nAdditional research:\n${selectedContent}`
          }
        ],
        temperature: 0.7,
        max_tokens: 15000
      });

      const generatedTranscript = completion.choices[0].message.content;
      if (!generatedTranscript) {
        throw new Error('Failed to generate transcript');
      }

      return generatedTranscript;
    } catch (error) {
      console.error('Error generating transcript:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedContent = selectedResults
      .map(result => `${result.summary}\n${result.details.join('\n')}`)
      .join('\n\n');

    const configWithSelectedResults = {
      ...formData,
      additionalInfo: [formData.additionalInfo, selectedContent].filter(Boolean).join('\n\n')
    };

    setPodcastConfig(configWithSelectedResults);
    navigate('/generating-transcript');

    try {
      const transcript = await generateTranscript(configWithSelectedResults, selectedContent);
      setTranscript(transcript);
      navigate('/transcript');
    } catch (error) {
      console.error('Failed to generate transcript:', error);
      setError('Failed to generate transcript. Please try again.');
      navigate('/config');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!apiKeysPresent) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardBody>
            <h1 className="text-2xl font-bold mb-4">API Keys Required</h1>
            <p className="mb-4">Please set your API keys in your profile before configuring a podcast.</p>
            <Button
              color="primary"
              onClick={() => navigate('/profile')}
            >
              Go to Profile
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardBody className="gap-4">
            <h1 className="text-2xl font-bold">Configure Your Podcast</h1>
            {error && <p className="text-danger">{error}</p>}
            {!isOnline && <p className="text-warning">You are currently offline. Some features may not work.</p>}

            <Input
              label="Podcast Name"
              value={formData.podcastName}
              onChange={(e) => handleInputChange(e.target.value, 'podcastName')}
              isRequired
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Host 1 Name"
                value={formData.voice1Name}
                onChange={(e) => handleInputChange(e.target.value, 'voice1Name')}
                isRequired
              />
              <Input
                label="Host 2 Name"
                value={formData.voice2Name}
                onChange={(e) => handleInputChange(e.target.value, 'voice2Name')}
                isRequired
              />

              <Select
                label="Host 1 Voice"
                selectedKeys={[formData.voice1]}
                onChange={(e) => handleInputChange(e.target.value, 'voice1')}
              >
                {VOICE_OPTIONS.map((voice) => (
                  <SelectItem key={voice.value} value={voice.value}>
                    {voice.label}
                  </SelectItem>
                ))}
              </Select>

              <Select
                label="Host 2 Voice"
                selectedKeys={[formData.voice2]}
                onChange={(e) => handleInputChange(e.target.value, 'voice2')}
              >
                {VOICE_OPTIONS.map((voice) => (
                  <SelectItem key={voice.value} value={voice.value}>
                    {voice.label}
                  </SelectItem>
                ))}
              </Select>
            </div>

            <Input
              label="Topic"
              value={formData.topic}
              onChange={(e) => handleInputChange(e.target.value, 'topic')}
              isRequired
            />

            <Select
              label="Podcast Style"
              selectedKeys={[formData.podcastStyle]}
              onChange={(e) => handleInputChange(e.target.value, 'podcastStyle')}
              isRequired
            >
              {STYLE_OPTIONS.map((style) => (
                <SelectItem key={style.value} value={style.value}>
                  {style.label}
                </SelectItem>
              ))}
            </Select>

            <Checkbox
              isSelected={formData.useOnlineSearch}
              onValueChange={handleCheckboxChange}
            >
              Use online search to enrich content
            </Checkbox>

            {formData.useOnlineSearch && (
              <SearchSection
                onSearch={handleSearch}
                isSearching={isSearching}
                searchError={searchError}
                searchResults={searchResults}
                selectedResults={selectedResults}
                onResultSelection={handleResultSelection}
                topic={formData.topic}
              />
            )}

            <Button
              type="submit"
              color="primary"
              size="lg"
              className="w-full"
            >
              Generate Transcript
            </Button>
          </CardBody>
        </Card>
      </form>
    </div>
  );
};

export default PodcastConfig;