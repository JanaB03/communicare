import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUser } from '@/contexts/UserContext';
import { MapPin } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [accessCode, setAccessCode] = useState('');
  const [activeTab, setActiveTab] = useState<'client' | 'staff'>('client');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { signIn } = useUser();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      // For client access with code
      if (activeTab === 'client' && accessCode) {
        // In a real app, you'd validate the access code
        if (accessCode === '123456') {
          // Demo code for client access
          await signIn('john@example.com', '');
        } else {
          throw new Error('Invalid access code');
        }
      } 
      // For staff login with email/password
      else if (activeTab === 'staff' && email) {
        await signIn(email, password);
      } else {
        throw new Error(activeTab === 'client' 
          ? 'Please enter an access code' 
          : 'Please enter your email');
      }
      
      navigate('/');
    } catch (err) {
      setError(activeTab === 'client' 
        ? 'Invalid access code' 
        : 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-navy p-3 rounded-full">
              <MapPin className="h-8 w-8 text-orange" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-navy">CommuniCare</h1>
          <p className="mt-2 text-gray-600">
            Connecting care providers and clients
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Tabs */}
          <div className="flex">
            <button 
              className={`flex-1 py-4 font-medium ${activeTab === 'client' 
                ? 'bg-orange text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              onClick={() => setActiveTab('client')}
            >
              Client Access
            </button>
            <button 
              className={`flex-1 py-4 font-medium ${activeTab === 'staff' 
                ? 'bg-orange text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              onClick={() => setActiveTab('staff')}
            >
              Staff Login
            </button>
          </div>
          
          {/* Form Content */}
          <div className="p-6">
            {activeTab === 'client' ? (
              <>
                <p className="text-sm text-gray-600 mb-6">
                  Enter your access code to connect with your care team.
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Access Code
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        type="text"
                        placeholder="Enter your 6-digit code"
                        className="pl-10"
                        value={accessCode}
                        onChange={(e) => setAccessCode(e.target.value)}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Your access code was provided by your case manager
                    </p>
                  </div>
                  
                  {error && (
                    <div className="p-3 bg-red-50 text-red-500 text-sm rounded">
                      {error}
                    </div>
                  )}
                  
                  <Button
                    type="submit"
                    className="w-full bg-orange hover:bg-orange/90 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Accessing...' : 'Access Services'}
                  </Button>
                </form>
                
                <p className="text-xs text-center text-gray-500 mt-6">
                  Need help? Call your case manager or the support line at (555) 123-4567
                </p>
                
                <p className="text-xs text-center text-gray-400 mt-4">
                  For demo purposes, you can use code "123456" or leave it blank.
                </p>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-600 mb-6">
                  Staff members, please sign in with your credentials.
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      required
                      placeholder="youremail@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium mb-1">
                      Password
                    </label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  
                  {error && (
                    <div className="p-3 bg-red-50 text-red-500 text-sm rounded">
                      {error}
                    </div>
                  )}
                  
                  <Button
                    type="submit"
                    className="w-full bg-orange hover:bg-orange/90 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing in...' : 'Sign in'}
                  </Button>
                </form>
                
                <div className="mt-4 text-center text-sm">
                  <p className="text-gray-600">
                    Demo credentials:
                  </p>
                  <p className="text-xs mt-1 text-gray-500">
                    Case Manager: jane@example.com
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    (Password field can be left empty for demo)
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;