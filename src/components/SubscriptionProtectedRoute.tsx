import { FC, ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { getActiveSubscription } from '@/integrations/stripe/payment-links';

interface SubscriptionProtectedRouteProps {
  children: ReactNode;
}

const SubscriptionProtectedRoute: FC<SubscriptionProtectedRouteProps> = ({ children }) => {
  const { user } = useAuth();
  const [hasSubscription, setHasSubscription] = useState<boolean | null>(null);

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        if (!user?.email) return;

        const subscription = await getActiveSubscription(user.email);
        const isValid = subscription && subscription.status === 'active';
        setHasSubscription(isValid);

        if (!isValid) {
          toast({
            title: "Subscription Required",
            description: "Please subscribe to access this feature",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Error checking subscription:', error);
        setHasSubscription(false);
      }
    };

    checkSubscription();
  }, [user]);

  if (hasSubscription === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!hasSubscription) {
    return <Navigate to="/settings" replace />;
  }

  return <>{children}</>;
};

export default SubscriptionProtectedRoute; 