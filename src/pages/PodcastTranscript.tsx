import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody, Button, Textarea } from "@nextui-org/react";
import { PodcastContext } from '../context/PodcastContext';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Wand2 } from 'lucide-react';
import OpenAI from 'openai';

const PodcastTranscript: React.FC = () => {
  const { config, transcript, setTranscript, setAudioUrl } = useContext(PodcastContext);
  const navigate = useNavigate();
  const { isOnline, getApiKeys } = useAuth();
  const [error, setError] = useState('');
  const [editedTranscript, setEditedTranscript] = useState(transcript);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);

  useEffect(() => {
    if (!config || !transcript) {
      navigate('/config');
    }
    setEditedTranscript(transcript);
  }, [config, transcript, navigate]);

  const handleEditTranscript = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedTranscript(e.target.value);
  };

  const handleSubmit = async () => {
    if (!config) return;
    
    setIsGeneratingAudio(true);
    setError('');
    setTranscript(editedTranscript);

    try {
      const keys = await getApiKeys();
      if (!keys?.openaiKey) {
        throw new Error('OpenAI API key is missing. Please set it in your profile.');
      }

      const openai = new OpenAI({
        apiKey: keys.openaiKey,
        dangerouslyAllowBrowser: true
      });

      const speakerRegex = new RegExp(`\\[${config.voice1Name.toUpperCase()}\\]|\\[${config.voice2Name.toUpperCase()}\\]`);
      const parts = editedTranscript.split(speakerRegex);
      const audioChunks = [];

      // Skip the first part as it's before any speaker marker
      for (let i = 1; i < parts.length; i++) {
        const text = parts[i].trim();
        if (text) {
          const voice = i % 2 === 1 ? config.voice1 : config.voice2;
          
          const response = await openai.audio.speech.create({
            model: "tts-1",
            voice: voice,
            input: text,
            speed: 1.0
          });

          const arrayBuffer = await response.arrayBuffer();
          audioChunks.push(arrayBuffer);
        }
      }

      const blob = new Blob(audioChunks, { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      navigate('/audio');
    } catch (err) {
      console.error('Error generating audio:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to generate audio. Please check your internet connection and try again.');
      }
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  if (!config || !transcript) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardBody className="gap-4">
          <h1 className="text-2xl font-bold">Edit Podcast Transcript</h1>
          {error && (
            <div className="p-4 bg-danger-50 text-danger rounded-lg">
              {error}
            </div>
          )}
          {!isOnline && (
            <div className="p-4 bg-warning-50 text-warning rounded-lg">
              You are currently offline. Some features may not work.
            </div>
          )}
          
          <Textarea
            value={editedTranscript}
            onChange={handleEditTranscript}
            placeholder="Generated transcript will appear here..."
            minRows={15}
            size="lg"
            className="font-mono"
          />

          <div className="flex gap-4">
            <Button
              variant="flat"
              color="primary"
              startContent={<ArrowLeft />}
              onClick={() => navigate('/config')}
            >
              Back to Config
            </Button>
            <Button
              color="primary"
              className="flex-1"
              startContent={<Wand2 />}
              isLoading={isGeneratingAudio}
              onClick={handleSubmit}
            >
              {isGeneratingAudio ? 'Generating Audio...' : 'Generate Audio'}
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default PodcastTranscript;