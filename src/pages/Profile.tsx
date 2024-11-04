import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody, Input, Button, Accordion, AccordionItem, Divider } from '@nextui-org/react';
import { Key, LogOut, AlertCircle } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, logout, setApiKeys, getApiKeys, isOnline } = useAuth();
  const navigate = useNavigate();
  const [openaiKey, setOpenaiKey] = useState('');
  const [perplexityKey, setPerplexityKey] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    const fetchApiKeys = async () => {
      if (!isOnline) {
        setError('You are currently offline. API keys cannot be retrieved.');
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        setMessage('Retrieving API keys...');
        const keys = await getApiKeys();
        if (keys) {
          setOpenaiKey(keys.openaiKey);
          setPerplexityKey(keys.perplexityKey);
          setMessage('API keys loaded successfully.');
        } else {
          setMessage('No API keys found. Please set your API keys.');
        }
      } catch (err) {
        console.error('Error fetching API keys:', err);
        if (err instanceof Error) {
          setError(`Failed to retrieve API keys: ${err.message}`);
        } else {
          setError('Failed to retrieve API keys. Please check your connection and try again.');
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchApiKeys();
  }, [getApiKeys, isOnline]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
      setError('Failed to log out. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await setApiKeys(openaiKey, perplexityKey);
      setMessage('API keys updated successfully');
      navigate('/config');
    } catch (error) {
      console.error('Failed to update API keys', error);
      setError('Failed to update API keys. Please try again.');
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4">
      <Card className="mb-6">
        <CardBody>
          <h1 className="text-2xl font-bold mb-4">Profile Settings</h1>
          <div className="mb-4">
            <p className="text-gray-600">Email: {user.email}</p>
          </div>
          
          {error && (
            <div className="flex items-center gap-2 p-4 mb-4 bg-danger-50 text-danger rounded-lg">
              <AlertCircle size={20} />
              <p>{error}</p>
            </div>
          )}
          
          {message && (
            <div className="p-4 mb-4 bg-success-50 text-success rounded-lg">
              <p>{message}</p>
            </div>
          )}

          <Accordion>
            <AccordionItem
              key="api-instructions"
              aria-label="API Key Instructions"
              title="How to Get Your API Keys"
              className="mb-4"
            >
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">OpenAI API Key</h3>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Visit <a href="https://platform.openai.com" target="_blank" rel="noopener noreferrer" className="text-primary">platform.openai.com</a></li>
                    <li>Log in to your account</li>
                    <li>Click your profile icon in the top-right corner</li>
                    <li>Select "API Keys" from the dropdown menu</li>
                    <li>Click "Create new secret key"</li>
                    <li>Copy your API key immediately</li>
                  </ol>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Perplexity API Key</h3>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Visit <a href="https://www.perplexity.ai" target="_blank" rel="noopener noreferrer" className="text-primary">www.perplexity.ai</a></li>
                    <li>Log in to your account</li>
                    <li>Go to Settings in the bottom-left corner</li>
                    <li>Click on the API tab</li>
                    <li>Generate or copy your API key</li>
                  </ol>
                </div>
              </div>
            </AccordionItem>
          </Accordion>

          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              <span className="ml-2 text-primary">Loading...</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="password"
                label="OpenAI API Key"
                placeholder="sk-..."
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                startContent={<Key className="text-gray-400" size={20} />}
              />
              <Input
                type="password"
                label="Perplexity API Key"
                placeholder="pplx-..."
                value={perplexityKey}
                onChange={(e) => setPerplexityKey(e.target.value)}
                startContent={<Key className="text-gray-400" size={20} />}
              />
              <Button
                type="submit"
                color="primary"
                className="w-full"
                size="lg"
              >
                Update API Keys
              </Button>
            </form>
          )}

          <Divider className="my-6" />

          <Button
            color="danger"
            variant="flat"
            className="w-full"
            size="lg"
            startContent={<LogOut />}
            onPress={handleLogout}
          >
            Logout
          </Button>
        </CardBody>
      </Card>
    </div>
  );
};

export default Profile;