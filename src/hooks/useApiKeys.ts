import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export const useApiKeys = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [apiKeysPresent, setApiKeysPresent] = useState(false);
  const { getApiKeys, user, authInitialized } = useAuth();

  useEffect(() => {
    const checkApiKeys = async () => {
      try {
        // Only check API keys if auth is initialized and user is logged in
        if (authInitialized && user) {
          const keys = await getApiKeys();
          setApiKeysPresent(!!keys && !!keys.openaiKey && !!keys.perplexityKey);
        }
      } catch (err) {
        console.error('Error checking API keys:', err);
      } finally {
        // Only set loading to false if auth is initialized
        if (authInitialized) {
          setIsLoading(false);
        }
      }
    };
    
    // Keep loading true until auth is initialized
    if (!authInitialized) {
      setIsLoading(true);
      return;
    }

    checkApiKeys();
  }, [getApiKeys, user, authInitialized]); // Add authInitialized to dependencies

  return { isLoading, apiKeysPresent };
};
