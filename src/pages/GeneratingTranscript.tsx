import React from 'react';
import { Card, CardBody, CircularProgress } from '@nextui-org/react';
import { Sparkles } from 'lucide-react';

const GeneratingTranscript: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md">
        <CardBody className="py-10 flex flex-col items-center gap-6">
          <Sparkles className="w-12 h-12 text-primary" />
          <h1 className="text-2xl font-bold text-center">Creating Your Transcript</h1>
          <p className="text-gray-600 text-center">
            Please wait while we generate your podcast transcript...
          </p>
          <CircularProgress size="lg" aria-label="Loading..." />
        </CardBody>
      </Card>
    </div>
  );
};

export default GeneratingTranscript;