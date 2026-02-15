import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import {
  Check,
  X,
  Crown,
  Building2,
  Zap,
  Shield,
  FlaskConical,
  Atom,
  Calculator,
  BookOpen,
  Phone,
  CreditCard,
  Smartphone,
  Loader2,
  Star,
  Sparkles
} from 'lucide-react';

interface PlanFeature {
  name: string;
  nameAm: string;
  free: boolean;
  premium: boolean;
  institution: boolean;
}

const features: PlanFeature[] = [
  { name: 'Basic Safety Training', nameAm: 'መሰረታዊ የደህንነት ስልጠና', free: true, premium: true, institution: true },
  { name: 'Periodic Table Access', nameAm: 'የንጥረ ነገሮች ሰንጠረዥ', free: true, premium: true, institution: true },
  { name: 'Basic Recipe Calculator', nameAm: 'መሰረታዊ ካልኩሌተር', free: true, premium: true, institution: true },
  { name: '3 Free Recipes', nameAm: '3 ነጻ ሪሰፕቶች', free: true, premium: true, institution: true },
  { name: 'All Recipes (50+)', nameAm: 'ሁሉም ሪሰፕቶች (50+)', free: false, premium: true, institution: true },
  { name: 'Advanced Calculator', nameAm: 'የላቀ ካልኩሌተር', free: false, premium: true, institution: true },
  { name: 'Safety Certifications', nameAm: 'የደህንነት ምስክር ወረቀቶች', free: false, premium: true, institution: true },
  { name: 'Priority Support', nameAm: 'ቅድሚያ ድጋፍ', free: false, premium: true, institution: true },
  { name: 'Multi-user Accounts', nameAm: 'ብዙ ተጠቃሚ መለያዎች', free: false, premium: false, institution: true },
  { name: 'Custom Training', nameAm: 'ብጁ ስልጠና', free: false, premium: false, institution: true },
  { name: 'Analytics Dashboard', nameAm: 'የትንታኔ ዳሽቦርድ', free: false, premium: false, institution: true },
  { name: 'API Access', nameAm: 'API መዳረሻ', free: false, premium: false, institution: true },
];

const Subscription: React.FC = () => {
  const { t, language } = useLanguage();
  const { profile, user } = useAuth();
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'premium' | 'institution'>('premium');
  const [paymentMethod, setPaymentMethod] = useState<'telebirr' | 'chapa'>('chapa');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const isAmharic = language === 'am' || language === 'or';

  // Handle payment success redirect
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment') === 'success') {
      toast.success(isAmharic ? 'ክፍያ ተሳክቷል! ምዝገባዎ ተዘምኗል።' : 'Payment successful! Your subscription has been updated.');
      window.history.replaceState({}, '', '/subscription');
    }
  }, []);

  const plans = [
    {
      id: 'free',
      name: t('sub.free'),
      price: 0,
      period: t('sub.monthly'),
      icon: Zap,
      color: 'from-muted to-muted/50',
      features: features.filter(f => f.free).length,
    },
    {
      id: 'premium',
      name: t('sub.premium'),
      price: 199,
      period: t('sub.monthly'),
      icon: Crown,
      color: 'from-ethiopian-gold to-ethiopian-gold/50',
      popular: true,
      features: features.filter(f => f.premium).length,
    },
    {
      id: 'institution',
      name: t('sub.institution'),
      price: 999,
      period: t('sub.monthly'),
      icon: Building2,
      color: 'from-science to-science/50',
      features: features.filter(f => f.institution).length,
    },
  ];

  const handleUpgrade = (planId: 'premium' | 'institution') => {
    setSelectedPlan(planId);
    setIsPaymentOpen(true);
  };

  const handlePayment = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error(isAmharic ? 'ትክክለኛ ስልክ ቁጥር ያስገቡ' : 'Please enter a valid phone number');
      return;
    }

    setIsProcessing(true);

    try {
      if (paymentMethod === 'chapa') {
        // Real Chapa payment
        const { data: { session } } = await supabase.auth.getSession();
        const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-chapa-payment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({ plan: selectedPlan, phone: phoneNumber }),
        });

        const data = await res.json();
        if (data.checkout_url) {
          // Redirect to Chapa checkout
          window.location.href = data.checkout_url;
          return;
        } else {
          throw new Error(data.error || 'Payment initialization failed');
        }
      } else {
        // TeleBirr - redirect to TeleBirr app/website
        toast.info(isAmharic ? 'TeleBirr ክፍያ በቅርቡ ይገኛል' : 'TeleBirr payment coming soon. Please use Chapa.');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error(isAmharic ? 'ክፍያ አልተሳካም። እባክዎ እንደገና ይሞክሩ።' : error.message || 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const currentPlan = profile?.subscription_tier || 'free';

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            <Sparkles className="w-3 h-3 mr-1" />
            {isAmharic ? 'ዋጋ ማዘጋጃ' : 'Pricing'}
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {isAmharic ? 'ለእርስዎ ትክክለኛውን እቅድ ይምረጡ' : 'Choose the right plan for you'}
          </h1>
          <p className="text-muted-foreground text-lg">
            {isAmharic 
              ? 'ከነጻ ጀምረው ንግድዎ ሲያድግ ያሳድጉ'
              : 'Start free and upgrade as your business grows'}
          </p>
        </div>

        {/* Current Plan Badge */}
        {currentPlan !== 'free' && (
          <div className="text-center mb-8">
            <Badge className={`text-lg px-4 py-2 ${
              currentPlan === 'premium' ? 'bg-ethiopian-gold text-black' : 'bg-science text-white'
            }`}>
              <Star className="w-4 h-4 mr-2" />
              {isAmharic ? 'የአሁኑ እቅድዎ:' : 'Your current plan:'} {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)}
            </Badge>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
          {plans.map((plan) => (
            <Card 
              key={plan.id}
              className={`relative overflow-hidden transition-all hover:shadow-xl ${
                plan.popular ? 'border-2 border-ethiopian-gold shadow-lg scale-105' : ''
              } ${currentPlan === plan.id ? 'ring-2 ring-primary' : ''}`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-ethiopian-gold text-black text-xs font-bold px-3 py-1 rounded-bl-lg">
                  {isAmharic ? 'ታዋቂ' : 'POPULAR'}
                </div>
              )}
              <CardHeader className="text-center pb-2">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${plan.color} flex items-center justify-center mx-auto mb-4`}>
                  <plan.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>
                  {plan.features} {isAmharic ? 'ባህሪያት' : 'features'}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground"> ETB/{plan.period}</span>
                </div>
                <ul className="space-y-3 text-left">
                  {features.slice(0, 6).map((feature, idx) => {
                    const hasFeature = plan.id === 'free' ? feature.free : 
                                      plan.id === 'premium' ? feature.premium : 
                                      feature.institution;
                    return (
                      <li key={idx} className="flex items-center gap-2">
                        {hasFeature ? (
                          <Check className="w-5 h-5 text-success shrink-0" />
                        ) : (
                          <X className="w-5 h-5 text-muted-foreground/50 shrink-0" />
                        )}
                        <span className={hasFeature ? '' : 'text-muted-foreground/50'}>
                          {isAmharic ? feature.nameAm : feature.name}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
              <CardFooter>
                {plan.id === 'free' ? (
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    disabled={currentPlan === 'free'}
                  >
                    {currentPlan === 'free' 
                      ? (isAmharic ? 'የአሁኑ እቅድ' : 'Current Plan')
                      : (isAmharic ? 'ወደ ነጻ ቀይር' : 'Switch to Free')}
                  </Button>
                ) : (
                  <Button 
                    className={`w-full ${
                      plan.id === 'premium' ? 'bg-ethiopian-gold hover:bg-ethiopian-gold/90 text-black' :
                      'bg-science hover:bg-science/90'
                    }`}
                    onClick={() => handleUpgrade(plan.id as 'premium' | 'institution')}
                    disabled={currentPlan === plan.id}
                  >
                    {currentPlan === plan.id 
                      ? (isAmharic ? 'የአሁኑ እቅድ' : 'Current Plan')
                      : (isAmharic ? 'አሳድግ' : 'Upgrade')}
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Features Comparison */}
        <Card className="max-w-5xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center">
              {isAmharic ? 'ሙሉ ባህሪያት ማነፃፀር' : 'Full Feature Comparison'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-4 px-4">{isAmharic ? 'ባህሪ' : 'Feature'}</th>
                    <th className="text-center py-4 px-4">{t('sub.free')}</th>
                    <th className="text-center py-4 px-4 bg-ethiopian-gold/5">{t('sub.premium')}</th>
                    <th className="text-center py-4 px-4">{t('sub.institution')}</th>
                  </tr>
                </thead>
                <tbody>
                  {features.map((feature, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="py-3 px-4">{isAmharic ? feature.nameAm : feature.name}</td>
                      <td className="text-center py-3 px-4">
                        {feature.free ? <Check className="w-5 h-5 text-success mx-auto" /> : <X className="w-5 h-5 text-muted-foreground/30 mx-auto" />}
                      </td>
                      <td className="text-center py-3 px-4 bg-ethiopian-gold/5">
                        {feature.premium ? <Check className="w-5 h-5 text-success mx-auto" /> : <X className="w-5 h-5 text-muted-foreground/30 mx-auto" />}
                      </td>
                      <td className="text-center py-3 px-4">
                        {feature.institution ? <Check className="w-5 h-5 text-success mx-auto" /> : <X className="w-5 h-5 text-muted-foreground/30 mx-auto" />}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Payment Dialog */}
        <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                {isAmharic ? 'ክፍያ' : 'Payment'}
              </DialogTitle>
              <DialogDescription>
                {isAmharic 
                  ? `${selectedPlan === 'premium' ? 'ፕሪሚየም' : 'ተቋም'} እቅድ - ${selectedPlan === 'premium' ? '199' : '999'} ETB/ወር`
                  : `${selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)} plan - ${selectedPlan === 'premium' ? '199' : '999'} ETB/month`}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Payment Method Selection */}
              <div className="space-y-3">
                <Label>{isAmharic ? 'የክፍያ ዘዴ' : 'Payment Method'}</Label>
                <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as 'telebirr' | 'chapa')}>
                  <div className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-all ${
                    paymentMethod === 'telebirr' ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                  }`}>
                    <RadioGroupItem value="telebirr" id="telebirr" />
                    <Label htmlFor="telebirr" className="flex items-center gap-3 cursor-pointer flex-1">
                      <div className="w-10 h-10 rounded-lg bg-[#0066B3] flex items-center justify-center">
                        <Smartphone className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">TeleBirr</p>
                        <p className="text-sm text-muted-foreground">Mobile Money</p>
                      </div>
                    </Label>
                  </div>
                  <div className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-all ${
                    paymentMethod === 'chapa' ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                  }`}>
                    <RadioGroupItem value="chapa" id="chapa" />
                    <Label htmlFor="chapa" className="flex items-center gap-3 cursor-pointer flex-1">
                      <div className="w-10 h-10 rounded-lg bg-[#7B3FE4] flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Chapa</p>
                        <p className="text-sm text-muted-foreground">Card / Mobile Banking</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phone">{isAmharic ? 'ስልክ ቁጥር' : 'Phone Number'}</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="09XXXXXXXX"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Amount Summary */}
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-muted-foreground">{isAmharic ? 'እቅድ' : 'Plan'}</span>
                  <span className="font-medium capitalize">{selectedPlan}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-muted-foreground">{isAmharic ? 'ጊዜ' : 'Duration'}</span>
                  <span className="font-medium">1 {isAmharic ? 'ወር' : 'month'}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{isAmharic ? 'ጠቅላላ' : 'Total'}</span>
                    <span className="text-xl font-bold">{selectedPlan === 'premium' ? '199' : '999'} ETB</span>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsPaymentOpen(false)} disabled={isProcessing}>
                {isAmharic ? 'ሰርዝ' : 'Cancel'}
              </Button>
              <Button 
                onClick={handlePayment}
                disabled={isProcessing}
                className={`${
                  paymentMethod === 'telebirr' ? 'bg-[#0066B3] hover:bg-[#0066B3]/90' : 'bg-[#7B3FE4] hover:bg-[#7B3FE4]/90'
                }`}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {isAmharic ? 'በመስራት ላይ...' : 'Processing...'}
                  </>
                ) : (
                  <>
                    {isAmharic ? 'ክፈል' : 'Pay'} {selectedPlan === 'premium' ? '199' : '999'} ETB
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Subscription;
