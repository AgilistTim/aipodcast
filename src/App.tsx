import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PodcastContext, PodcastConfig as PodcastConfigType } from './context/PodcastContext';
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import ErrorBoundaryComponent from './components/ErrorBoundary';

// Import components directly instead of lazy loading to avoid dynamic import issues
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import PodcastConfig from './pages/PodcastConfig';
import PodcastTranscript from './pages/PodcastTranscript';
import PodcastAudio from './pages/PodcastAudio';
import GeneratingTranscript from './pages/GeneratingTranscript';

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex justify-center items-center min-h-[200px]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [authChecked, setAuthChecked] = React.useState(false);

  React.useEffect(() => {
    // Wait for initial auth check
    const checkAuth = async () => {
      // Small delay to ensure Firebase auth is initialized
      await new Promise(resolve => setTimeout(resolve, 500));
      setAuthChecked(true);
    };
    checkAuth();
  }, []);

  // Show loading while checking auth
  if (!authChecked) {
    return <LoadingFallback />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const [podcastConfig, setPodcastConfig] = React.useState<PodcastConfigType | null>(null);
  const [transcript, setTranscript] = React.useState('');
  const [audioUrl, setAudioUrl] = React.useState('');

  return (
    <PodcastContext.Provider value={{
      config: podcastConfig,
      transcript,
      audioUrl,
      setPodcastConfig,
      setTranscript,
      setAudioUrl
    }}>
      <div className="flex flex-col min-h-screen bg-background">
        <Suspense fallback={<LoadingFallback />}>
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/config" element={
                <ProtectedRoute>
                  <PodcastConfig />
                </ProtectedRoute>
              } />
              <Route path="/generating-transcript" element={
                <ProtectedRoute>
                  <GeneratingTranscript />
                </ProtectedRoute>
              } />
              <Route path="/transcript" element={
                <ProtectedRoute>
                  <PodcastTranscript />
                </ProtectedRoute>
              } />
              <Route path="/audio" element={
                <ProtectedRoute>
                  <PodcastAudio />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          <Footer />
        </Suspense>
      </div>
    </PodcastContext.Provider>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundaryComponent>
      <NextUIProvider>
        <NextThemesProvider attribute="class" defaultTheme="system">
          <AuthProvider>
            <Router>
              <AppContent />
            </Router>
          </AuthProvider>
        </NextThemesProvider>
      </NextUIProvider>
    </ErrorBoundaryComponent>
  );
};

export default App;
