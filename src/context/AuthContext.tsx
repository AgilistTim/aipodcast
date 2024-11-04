import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth, db } from '../firebase/config';
import { User, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc, collection } from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';
import { retry } from '../utils/retry';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  getApiKeys: () => Promise<{ openaiKey: string; perplexityKey: string } | null>;
  setApiKeys: (openaiKey: string, perplexityKey: string) => Promise<void>;
  isOnline: boolean;
  authInitialized: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setAuthInitialized(true);
    });

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      unsubscribe();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(collection(db, 'users'), userCredential.user.uid), {
        email: email,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const getApiKeys = async () => {
    if (!user) {
      console.log('getApiKeys: No user logged in');
      return null;
    }
    if (!isOnline) {
      console.log('getApiKeys: Device is offline');
      throw new Error('You are currently offline. Please check your internet connection and try again.');
    }
    try {
      console.log('Fetching API keys for user:', user.uid);
      const result = await retry(async () => {
        const userDocRef = doc(collection(db, 'users'), user.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log('API keys retrieved:', { openaiKey: data.OPENAI_API_KEY ? '[REDACTED]' : 'Not set', perplexityKey: data.Perplexity_API_KEY ? '[REDACTED]' : 'Not set' });
          return {
            openaiKey: data.OPENAI_API_KEY || '',
            perplexityKey: data.Perplexity_API_KEY || '',
          };
        }
        console.log('No API keys found for user');
        return null;
      }, 3, 1000);
      return result;
    } catch (error) {
      if (error instanceof FirebaseError) {
        console.error('Firebase error details:', error.code, error.message);
        throw new Error(`Failed to retrieve API keys: ${error.code} - ${error.message}`);
      } else if (error instanceof Error) {
        throw new Error(`Failed to retrieve API keys: ${error.message}`);
      } else {
        throw new Error('Failed to retrieve API keys due to an unknown error');
      }
    }
  };

  const setApiKeys = async (openaiKey: string, perplexityKey: string) => {
    if (!user) throw new Error('No user logged in');
    if (!isOnline) throw new Error('You are currently offline. Please check your internet connection and try again.');
    try {
      const userDocRef = doc(collection(db, 'users'), user.uid);
      await setDoc(userDocRef, { OPENAI_API_KEY: openaiKey, Perplexity_API_KEY: perplexityKey }, { merge: true });
    } catch (error) {
      console.error('Error setting API keys:', error);
      throw error;
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    getApiKeys,
    setApiKeys,
    isOnline,
    authInitialized
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
