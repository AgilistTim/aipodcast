import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, CardBody, CardHeader } from '@nextui-org/react';
import { useAuth } from '../context/AuthContext';
import { Mic, Sparkles, Users } from 'lucide-react';

const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
          Welcome to PodcastGen
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Generate amazing podcasts with AI-powered voices and content
        </p>
        {user ? (
          <Link to="/config">
            <Button color="primary" size="lg" className="font-semibold">
              Start Creating
            </Button>
          </Link>
        ) : (
          <div className="space-x-4">
            <Link to="/login">
              <Button color="primary" variant="flat" size="lg">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button color="primary" size="lg">
                Register
              </Button>
            </Link>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-8 mt-12">
        <Card className="p-4">
          <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
            <div className="rounded-full bg-primary-100 p-3 mb-4">
              <Mic className="text-primary h-6 w-6" />
            </div>
            <h2 className="font-bold text-xl">Professional Voices</h2>
          </CardHeader>
          <CardBody>
            <p className="text-gray-600">
              Choose from a variety of high-quality AI voices to bring your content to life
            </p>
          </CardBody>
        </Card>

        <Card className="p-4">
          <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
            <div className="rounded-full bg-primary-100 p-3 mb-4">
              <Sparkles className="text-primary h-6 w-6" />
            </div>
            <h2 className="font-bold text-xl">AI-Powered Content</h2>
          </CardHeader>
          <CardBody>
            <p className="text-gray-600">
              Generate engaging scripts and conversations with advanced AI technology
            </p>
          </CardBody>
        </Card>

        <Card className="p-4">
          <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
            <div className="rounded-full bg-primary-100 p-3 mb-4">
              <Users className="text-primary h-6 w-6" />
            </div>
            <h2 className="font-bold text-xl">Multiple Hosts</h2>
          </CardHeader>
          <CardBody>
            <p className="text-gray-600">
              Create dynamic conversations between multiple AI hosts for engaging podcasts
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Home;