import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Info } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/Layout';
import { getActiveSubscription } from '@/integrations/stripe/payment-links';

interface Subscription {
  id: string;
  status: string;
  current_period_end: number;
  customer: string;
}

const PRICING_PLANS = [
  {
    name: 'Starter',
    price: '$49',
    credits: '40 credits/month',
    features: [
      '1 credit = 1 ad generation',
      'Style matching from Pinterest',
      'Basic templates',
      '$1.50 per additional credit'
    ],
    paymentLink: 'https://buy.stripe.com/...' // Replace with your actual payment link
  },
  {
    name: 'Pro',
    price: '$99',
    credits: '100 credits/month',
    features: [
      'Everything in Starter',
      'All templates',
      'A/B testing',
      '$1.25 per additional credit'
    ],
    paymentLink: 'https://buy.stripe.com/...' // Replace with your actual payment link
  },
  {
    name: 'Enterprise',
    price: '$249',
    credits: '300 credits/month',
    features: [
      'Everything in Pro',
      'Priority support',
      'Facebook Ads API',
      '$1.00 per additional credit'
    ],
    paymentLink: 'https://buy.stripe.com/...' // Replace with your actual payment link
  }
];

const Settings: FC = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        if (!user) return;

        const data = await getActiveSubscription(user.id);
        setSubscription(data);
      } catch (error) {
        console.error('Error fetching subscription:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [user]);

  if (loading) {
    return (
      <Layout title="Settings">
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Settings">
      <div className="container mx-auto py-8 px-4 max-w-6xl space-y-8">
        {subscription ? (
          <>
            {/* Active Subscription Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-black">Your Subscription</h2>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E5E7EB]">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-[#10B981] font-jakarta">
                    Active Plan
                  </h3>
                  <Badge className="bg-[#ECFDF5] text-[#059669] border-[#059669]">
                    Active
                  </Badge>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm text-[#536772]">
                    <span>Renewal Date</span>
                    <span>{new Date(subscription.current_period_end * 1000).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Credits Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-black">Additional Credits</h2>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E5E7EB]">
                <div className="flex items-center gap-4 mb-6">
                  <Info className="w-5 h-5 text-[#6B7280]" />
                  <div>
                    <p className="text-sm font-medium">Need more credits?</p>
                    <p className="text-sm text-[#536772]">
                      Purchase additional credits at $1.50 each
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={() => window.open('https://buy.stripe.com/...', '_blank')}
                  className="w-full bg-black hover:bg-black/90 text-white px-6 py-3 rounded-xl font-jakarta"
                >
                  Buy Credits
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Pricing Section */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-black text-center">Choose Your Plan</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {PRICING_PLANS.map((plan) => (
                  <div key={plan.name} className="bg-white rounded-xl p-6 shadow-sm border border-[#E5E7EB]">
                    <h3 className="text-xl font-bold text-black mb-2">{plan.name}</h3>
                    <div className="text-3xl font-bold mb-4">{plan.price}<span className="text-sm text-gray-500">/month</span></div>
                    <p className="text-sm text-gray-500 mb-4">{plan.credits}</p>
                    <ul className="space-y-2 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <span className="text-green-500">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button
                      onClick={() => window.open(plan.paymentLink, '_blank')}
                      className="w-full bg-black hover:bg-black/90 text-white px-6 py-3 rounded-xl font-jakarta"
                    >
                      Subscribe Now
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Settings; 