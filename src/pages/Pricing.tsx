import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Check, Sparkles, Zap, Crown } from 'lucide-react';

export default function Pricing() {
  const plans = [
    {
      name: 'Free',
      icon: Sparkles,
      price: '$0',
      period: 'forever',
      description: 'Perfect for trying out our service',
      features: [
        '5 transcriptions per month',
        'Up to 10 min audio files',
        'Basic speaker detection',
        'TXT & JSON export',
        'Email support',
      ],
      cta: 'Get Started',
      popular: false,
    },
    {
      name: 'Pro',
      icon: Zap,
      price: '$19',
      period: 'per month',
      description: 'For professionals and small teams',
      features: [
        '100 transcriptions per month',
        'Up to 2 hour audio files',
        'Advanced speaker detection',
        'All export formats',
        'Priority processing',
        'Custom speaker labels',
        'Priority email support',
      ],
      cta: 'Start Pro Trial',
      popular: true,
    },
    {
      name: 'Enterprise',
      icon: Crown,
      price: '$99',
      period: 'per month',
      description: 'For large teams and organizations',
      features: [
        'Unlimited transcriptions',
        'No file size limits',
        'Enterprise-grade accuracy',
        'API access',
        'Custom integrations',
        'Dedicated account manager',
        '24/7 phone support',
        'SSO & advanced security',
      ],
      cta: 'Contact Sales',
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
      </div>

      <main className="flex-1 relative z-10 pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Simple, <span className="gradient-text">Transparent</span> Pricing
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Choose the plan that fits your needs. All plans include our core AI-powered speaker diarization technology.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative rounded-2xl border ${
                  plan.popular
                    ? 'border-primary bg-gradient-to-b from-primary/10 to-transparent'
                    : 'border-border bg-card'
                } p-8`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-primary to-accent text-background text-sm font-semibold px-4 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                    plan.popular
                      ? 'bg-gradient-to-br from-primary to-accent'
                      : 'bg-muted'
                  }`}>
                    <plan.icon className={`h-5 w-5 ${plan.popular ? 'text-background' : 'text-foreground'}`} />
                  </div>
                  <h3 className="text-xl font-semibold">{plan.name}</h3>
                </div>

                <div className="mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground ml-2">{plan.period}</span>
                </div>

                <p className="text-muted-foreground mb-6">{plan.description}</p>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${
                    plan.popular
                      ? 'bg-gradient-to-r from-primary to-accent text-background'
                      : ''
                  }`}
                  variant={plan.popular ? 'default' : 'outline'}
                  asChild
                >
                  <Link to="/auth?mode=signup">{plan.cta}</Link>
                </Button>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mt-20 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>

            <div className="space-y-6">
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-semibold mb-2">What audio formats are supported?</h3>
                <p className="text-muted-foreground text-sm">
                  We support MP3, WAV, M4A, FLAC, OGG, and WebM audio formats. Files should be under the size limit for your plan.
                </p>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-semibold mb-2">How accurate is the speaker detection?</h3>
                <p className="text-muted-foreground text-sm">
                  Our AI achieves 95%+ accuracy on clear audio with distinct speakers. Accuracy may vary with background noise or overlapping speech.
                </p>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-semibold mb-2">Can I cancel my subscription anytime?</h3>
                <p className="text-muted-foreground text-sm">
                  Yes! You can cancel your subscription at any time. You'll continue to have access until the end of your billing period.
                </p>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-semibold mb-2">Is my audio data secure?</h3>
                <p className="text-muted-foreground text-sm">
                  Absolutely. Audio files are encrypted during upload and processing. We don't store your audio files after processing is complete.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
