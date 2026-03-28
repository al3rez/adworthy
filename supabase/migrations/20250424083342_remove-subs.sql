-- Drop existing tables and functions
DROP TRIGGER IF EXISTS check_credits_before_generation ON public.generated_ads;
DROP TRIGGER IF EXISTS update_credits_on_ad_generation ON public.generated_ads;
DROP TRIGGER IF EXISTS check_subscription_period_before_generation ON public.generated_ads;
DROP TRIGGER IF EXISTS handle_subscription_renewal ON public.subscriptions;

DROP FUNCTION IF EXISTS check_credits_available() CASCADE;
DROP FUNCTION IF EXISTS increment_credits_used() CASCADE;
DROP FUNCTION IF EXISTS check_subscription_period() CASCADE;
DROP FUNCTION IF EXISTS handle_subscription_renewal() CASCADE;

DROP TABLE IF EXISTS public.credit_purchases;
DROP TABLE IF EXISTS public.subscriptions;

-- Update pricing_tiers table to work with Stripe
ALTER TABLE public.pricing_tiers
DROP COLUMN IF EXISTS price_usd,
DROP COLUMN IF EXISTS additional_credit_price,
ADD COLUMN IF NOT EXISTS stripe_price_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_product_id TEXT;

-- Update existing rows with default values
UPDATE public.pricing_tiers
SET 
    stripe_price_id = CASE 
        WHEN name = 'Starter' THEN 'price_1R8fSzLgmuRphCPw8u9mu793'
        WHEN name = 'Pro' THEN 'price_1R8fSzLgmuRphCPw8u9mu794'
        WHEN name = 'Enterprise' THEN 'price_1R8fSzLgmuRphCPw8u9mu795'
        ELSE NULL
    END,
    stripe_product_id = 'prod_S2kyQ2aZMcF2hc'
WHERE stripe_price_id IS NULL OR stripe_product_id IS NULL;

-- Now set the columns to NOT NULL
ALTER TABLE public.pricing_tiers
ALTER COLUMN stripe_price_id SET NOT NULL,
ALTER COLUMN stripe_product_id SET NOT NULL;

-- Create user_credits table to track credits
CREATE TABLE IF NOT EXISTS public.user_credits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    credits_total INTEGER NOT NULL DEFAULT 0,
    credits_used INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own credits"
    ON public.user_credits
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own credits"
    ON public.user_credits
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Create function to check if user has available credits
CREATE OR REPLACE FUNCTION check_credits_available()
RETURNS TRIGGER AS $$
DECLARE
    available_credits INTEGER;
BEGIN
    -- Get user's credits
    SELECT credits_total - credits_used
    INTO available_credits
    FROM public.user_credits
    WHERE user_id = NEW.user_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No credits record found for user';
    END IF;

    IF available_credits <= 0 THEN
        RAISE EXCEPTION 'No credits available. Please purchase additional credits.';
    END IF;

    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create function for updating credits_used
CREATE OR REPLACE FUNCTION increment_credits_used()
RETURNS TRIGGER AS $$
BEGIN
    -- Only increment credits when a new ad is created
    IF (TG_OP = 'INSERT') THEN
        UPDATE public.user_credits
        SET 
            credits_used = credits_used + 1,
            updated_at = NOW()
        WHERE user_id = NEW.user_id;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER check_credits_before_generation
    BEFORE INSERT ON public.generated_ads
    FOR EACH ROW
    EXECUTE FUNCTION check_credits_available();

CREATE TRIGGER update_credits_on_ad_generation
    AFTER INSERT ON public.generated_ads
    FOR EACH ROW
    EXECUTE FUNCTION increment_credits_used();

-- Insert default pricing tiers with Stripe IDs
INSERT INTO public.pricing_tiers (name, type, credits, stripe_price_id, stripe_product_id) VALUES
    ('Starter', 'starter', 40, 'price_1R8fSzLgmuRphCPw8u9mu793', 'prod_S2kyQ2aZMcF2hc'),
    ('Pro', 'pro', 100, 'price_1R8fSzLgmuRphCPw8u9mu794', 'prod_S2kyQ2aZMcF2hc'),
    ('Enterprise', 'enterprise', 300, 'price_1R8fSzLgmuRphCPw8u9mu795', 'prod_S2kyQ2aZMcF2hc'); 