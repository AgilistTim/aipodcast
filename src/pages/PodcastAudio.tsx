import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody, CardHeader, Button } from "@nextui-org/react";
import { PodcastContext } from '../context/PodcastContext';
import { ArrowLeft, Download } from 'lucide-react';

const PodcastAudio: React.FC = () => {
  const { config, audioUrl } = useContext(PodcastContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!config || !audioUrl) {
      navigate('/config');
    }
  }, [config, audioUrl, navigate]);

  if (!config || !audioUrl) {
    return null;
  }

  // Map style values to readable labels
  const styleLabels: Record<string, string> = {
    'casual': 'Casual Conversation',
    'formal': 'Formal Discussion',
    'educational': 'Educational Content',
    'humorous': 'Humorous/Entertainment',
    'debate': 'Debate Format'
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="w-full">
        <CardHeader className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">{config.podcastName}</h1>
          <div className="text-default-600">
            <p>Topic: {config.topic}</p>
            <p>Style: {styleLabels[config.podcastStyle] || config.podcastStyle}</p>
          </div>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="w-full bg-default-100 rounded-lg p-4">
            <audio controls className="w-full">
              <source src={audioUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              startContent={<ArrowLeft />}
              variant="flat"
              color="primary"
              className="flex-1"
              onClick={() => navigate('/transcript')}
            >
              Edit Transcript
            </Button>
            <Button
              as="a"
              href={audioUrl}
              download={`${config.podcastName}.mp3`}
              startContent={<Download />}
              color="success"
              className="flex-1"
            >
              Download Audio
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default PodcastAudio;