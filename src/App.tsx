import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from '@/contexts/UserContext';
import { MapProvider } from '@/contexts/MapContext';
import { ToastProvider } from '@/components/ui/toast';
import NavBar from '@/components/NavBar';
import HomePage from '@/pages/HomePage';
import MapPage from '@/pages/MapPage';
import LoginPage from '@/pages/LoginPage';
import ChatPage from '@/pages/ChatPage';
import ResourcesPage from '@/pages/ResourcesPage';
import SettingsPage from '@/pages/SettingsPage';

// Placeholder component
const CheckInPage = () => <div className="flex-1 p-4">Check In Page</div>;

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useUser();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <>
      <NavBar />
      <div className="pt-16 pb-16 md:pb-0 min-h-screen">
        {children}
      </div>
    </>
  );
};

// Layout with all providers
const AppWithProviders = () => {
  const { user } = useUser();
  
  // Set page title
  useEffect(() => {
    document.title = 'CommuniCare Connect';
  }, []);

  return (
    <MapProvider>
      <ToastProvider>
        <div className="flex flex-col min-h-screen">
          <Routes>
            <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
            
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/map" 
              element={
                <ProtectedRoute>
                  <MapPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/chat" 
              element={
                <ProtectedRoute>
                  <ChatPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/resources" 
              element={
                <ProtectedRoute>
                  <ResourcesPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/check-in" 
              element={
                <ProtectedRoute>
                  <CheckInPage />
                </ProtectedRoute>
              } 
            />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </ToastProvider>
    </MapProvider>
  );
};

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <AppWithProviders />
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;