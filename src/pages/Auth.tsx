
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { User } from '@supabase/supabase-js';
import { Lock, Mail, User as UserIcon, LogIn } from 'lucide-react';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser(session.user);
          navigate('/');
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = isSignUp 
        ? await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: fullName,
              },
            },
          })
        : await supabase.auth.signInWithPassword({
            email,
            password,
          });
      
      if (error) throw error;
      
      if (isSignUp) {
        toast({
          title: "Check your email",
          description: "We've sent you a verification link to complete your registration.",
        });
      } else {
        toast({
          title: "Signed in successfully",
          description: "Welcome back!",
        });
      }
    } catch (error: any) {
      toast({
        title: "Authentication error",
        description: error.message || "An error occurred during authentication",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Google sign-in error",
        description: error.message || "An error occurred with Google sign-in",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-white to-slate-50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <div className="mb-6 flex justify-center">
          <img 
            src="/lovable-uploads/0e65446c-c906-4ab5-9982-6f1414453c98.png" 
            alt="Adworthy Logo" 
            className="h-10"
          />
        </div>
        
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
          {isSignUp ? 'Create an Account' : 'Sign in to Adworthy'}
        </h1>
        
        <form onSubmit={handleEmailSignIn} className="space-y-4">
          {isSignUp && (
            <div className="space-y-2">
              <Label htmlFor="fullName" className="flex items-center gap-2">
                <UserIcon size={16} />
                Full Name
              </Label>
              <Input
                id="fullName"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required={isSignUp}
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail size={16} />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center gap-2">
              <Lock size={16} />
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                {isSignUp ? 'Creating Account...' : 'Signing In...'}
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <LogIn size={16} />
                {isSignUp ? 'Create Account' : 'Sign In'}
              </span>
            )}
          </Button>
        </form>
        
        <div className="my-6 flex items-center gap-4">
          <Separator className="flex-grow" />
          <span className="text-sm text-gray-500">OR</span>
          <Separator className="flex-grow" />
        </div>
        
        <Button 
          variant="outline" 
          className="w-full"
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          <img 
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
            alt="Google" 
            className="mr-2 h-5 w-5" 
          />
          Sign in with Google
        </Button>
        
        <div className="mt-6 text-center text-sm">
          {isSignUp ? (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setIsSignUp(false)}
                className="text-blue-600 hover:underline"
              >
                Sign in
              </button>
            </p>
          ) : (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setIsSignUp(true)}
                className="text-blue-600 hover:underline"
              >
                Create one
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
