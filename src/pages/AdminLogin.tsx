import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginUser } from '@/store/auth/reducers';
import { checkAuth } from '@/store/auth/authSlice';
import { isAuthenticated, getAuthToken } from '../lib/utils';
import { Loader2, Eye, EyeOff } from 'lucide-react';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { loading, user } = useAppSelector(state => state.auth);

  // Debug function to check cookies
  const debugAuth = () => {
    console.log('All cookies:', document.cookie);
    console.log('Auth token:', getAuthToken());
    console.log('Is authenticated:', isAuthenticated());
  };

  // Check if user is already authenticated on component mount
  useEffect(() => {
    debugAuth(); // Debug log
    
    // Check cookies directly first
    if (isAuthenticated()) {
      console.log('User already authenticated, redirecting...');
      navigate('/admin', { replace: true });
      return;
    }
    // Then dispatch Redux action
    dispatch(checkAuth());
  }, [dispatch, navigate]);

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      console.log('User found in Redux state, redirecting...', user);
      navigate('/admin', { replace: true });
    }
  }, [user, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!credentials.username.trim() || !credentials.password.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('Attempting login...');
      const result = await dispatch(loginUser({
        username: credentials.username,
        password: credentials.password
      }));

      if (loginUser.fulfilled.match(result)) {
        console.log('Login successful, result:', result);
        
        toast({
          title: "Success",
          description: "Login successful! Redirecting..."
        });
        
        // Wait a moment for cookie to be set, then check authentication
        setTimeout(() => {
          debugAuth(); // Debug after login
          
          // Always try to navigate, regardless of cookie check
          console.log('Navigating to /admin...');
          navigate('/admin', { replace: true });
          
          // Update Redux state
          dispatch(checkAuth());
        }, 300); // Increased timeout to ensure cookie is set
        
      } else {
        console.error('Login failed:', result.payload);
        toast({
          title: "Error",
          description: result.payload as string || "Login failed",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Error",
        description: error.message || "An error occurred during login",
        variant: "destructive"
      });
    }
  };

  // Check authentication directly from cookies (but don't block rendering)
  const userAuthenticated = isAuthenticated();

  // Don't render login form if user is already authenticated
  if (userAuthenticated || user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Already logged in. Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <img 
            src="/logo.png" 
            alt="Punjab Click TV" 
            className="mx-auto h-20 w-20"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Admin Login
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to access the admin dashboard
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Welcome Back</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  required
                  placeholder="Username"
                  value={credentials.username}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>

              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Password"
                  value={credentials.password}
                  onChange={handleInputChange}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button 
            variant="link" 
            onClick={() => navigate('/')}
            className="text-sm text-gray-600"
          >
            ← Back to Home
          </Button>
        </div>

        {/* Temporary debug button - remove in production */}
        {process.env.NODE_ENV === 'development' && (
          <div className="text-center">
            <Button 
              variant="outline" 
              size="sm"
              onClick={debugAuth}
            >
              Debug Auth
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;