import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Check, Sparkles, Zap, Crown, Info } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

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

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative rounded-2xl border p-8 flex flex-col transition-transform ${
                  plan.popular
                    ? 'border-primary bg-gradient-to-b from-primary/15 to-transparent shadow-[0_0_40px_hsl(var(--primary)/0.25)] md:scale-105 md:-my-2'
                    : 'border-border bg-card'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-primary to-accent text-background text-sm font-semibold px-4 py-1 rounded-full whitespace-nowrap">
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
                    <plan.icon className={`h-5 w-5 ${plan.popular ? 'text-background' : 'text-foreground'}`} aria-hidden="true" />
                  </div>
                  <h2 className="text-xl font-semibold">{plan.name}</h2>
                </div>

                <div className="mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground ml-2">{plan.period}</span>
                </div>

                <p className="text-muted-foreground mb-6">{plan.description}</p>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="space-y-2">
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
                  {plan.popular && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            className="w-full flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Info className="h-3 w-3" aria-hidden="true" />
                            14-day free trial — no card required
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>Try Pro free for 14 days. After your trial ends, you can pick a plan or stay on Free — we'll never auto-charge without your consent.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <section aria-labelledby="faq-heading" className="mt-20 max-w-3xl mx-auto">
            <h2 id="faq-heading" className="text-2xl font-bold text-center mb-8">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>

            <Accordion type="single" collapsible className="space-y-3">
              <AccordionItem value="formats" className="bg-card border border-border rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  What audio formats are supported?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm">
                  We support MP3, WAV, M4A, FLAC, OGG, and WebM audio formats. Files should be under the size limit for your plan.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="accuracy" className="bg-card border border-border rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  How accurate is the speaker detection?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm">
                  Our AI achieves 95%+ accuracy on clear audio with distinct speakers. Accuracy may vary with background noise or overlapping speech.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="cancel" className="bg-card border border-border rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  Can I cancel my subscription anytime?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm">
                  Yes! You can cancel your subscription at any time. You'll continue to have access until the end of your billing period.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="security" className="bg-card border border-border rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  Is my audio data secure?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm">
                  Absolutely. Audio files are encrypted during upload and processing. We don't store your audio files after processing is complete.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="languages" className="bg-card border border-border rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  Which languages are supported?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm">
                  Our AI supports transcription in 30+ languages including English, Spanish, French, German, Hindi, Mandarin, Japanese, Arabic, and Portuguese.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
