import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { WaveformVisual } from '@/components/WaveformVisual';
import { SpeakerVisualization } from '@/components/SpeakerVisualization';
import { 
  Mic, 
  Users, 
  Clock, 
  Download, 
  Sparkles, 
  ArrowRight,
  Zap,
  Shield,
  BarChart3
} from 'lucide-react';

export default function Landing() {
  const features = [
    {
      icon: Users,
      title: 'Multi-Speaker Detection',
      description: 'Accurately identify and label multiple speakers in your audio with AI precision.',
    },
    {
      icon: Clock,
      title: 'Timestamped Transcripts',
      description: 'Get detailed transcripts with precise timestamps for every utterance.',
    },
    {
      icon: Download,
      title: 'Multiple Export Formats',
      description: 'Download your results in TXT, SRT, JSON, or styled HTML formats.',
    },
    {
      icon: Zap,
      title: 'Fast Processing',
      description: 'Advanced AI processes your audio quickly without compromising accuracy.',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your audio files are processed securely and never stored permanently.',
    },
    {
      icon: BarChart3,
      title: 'Speaker Analytics',
      description: 'View detailed statistics about each speaker\'s talk time and contributions.',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Upload Audio',
      description: 'Drag and drop your audio file or click to browse. Supports MP3, WAV, M4A, and more.',
    },
    {
      number: '02',
      title: 'AI Analysis',
      description: 'Our AI identifies speakers and transcribes the conversation with high accuracy.',
    },
    {
      number: '03',
      title: 'Get Results',
      description: 'Review the color-coded transcript and download in your preferred format.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] animate-pulse-glow" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[80px] animate-pulse-glow" style={{ animationDelay: '1s' }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm text-primary font-medium">AI-Powered Audio Analysis</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Identify <span className="gradient-text">Who Spoke</span> When in Your Audio
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
                Transform your audio files into speaker-labeled transcripts with our advanced AI technology. Perfect for meetings, interviews, and podcasts.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" className="bg-gradient-to-r from-primary to-accent text-background font-semibold glow-primary" asChild>
                  <Link to="/auth?mode=signup">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/pricing">View Pricing</Link>
                </Button>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative h-[400px] lg:h-[500px]">
              <div className="absolute inset-0 rounded-2xl overflow-hidden border border-border bg-card/50">
                <SpeakerVisualization speakerCount={4} />
              </div>
              
              {/* Floating Cards */}
              <div className="absolute -left-4 top-1/4 bg-card border border-border rounded-lg p-4 shadow-lg animate-float">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-speaker-a" />
                  <span className="text-sm font-medium">Speaker A</span>
                  <span className="text-xs text-muted-foreground">2:34</span>
                </div>
              </div>
              
              <div className="absolute -right-4 top-1/2 bg-card border border-border rounded-lg p-4 shadow-lg animate-float" style={{ animationDelay: '0.5s' }}>
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-speaker-b" />
                  <span className="text-sm font-medium">Speaker B</span>
                  <span className="text-xs text-muted-foreground">1:45</span>
                </div>
              </div>
              
              <div className="absolute left-1/4 -bottom-4 bg-card border border-border rounded-lg p-4 shadow-lg animate-float" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-speaker-c" />
                  <span className="text-sm font-medium">Speaker C</span>
                  <span className="text-xs text-muted-foreground">3:12</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Waveform Section */}
      <section className="py-12 border-y border-border bg-card/30">
        <div className="container mx-auto px-4">
          <div className="h-24">
            <WaveformVisual />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powerful <span className="gradient-text">Features</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to analyze audio conversations and identify speakers with precision.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-all duration-300"
              >
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-card/30 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get speaker-labeled transcripts in three simple steps.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative text-center">
                <div className="text-6xl font-bold gradient-text opacity-30 mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
                
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/4 right-0 translate-x-1/2">
                    <ArrowRight className="h-8 w-8 text-muted-foreground/30" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="relative rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20" />
            <div className="absolute inset-0 bg-card/80 backdrop-blur-xl" />
            
            <div className="relative z-10 text-center py-16 px-4">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-primary to-accent mb-6">
                <Mic className="h-8 w-8 text-background" />
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                Join thousands of users who trust our AI for accurate speaker identification.
              </p>
              
              <Button size="lg" className="bg-gradient-to-r from-primary to-accent text-background font-semibold glow-primary" asChild>
                <Link to="/auth?mode=signup">
                  Start Analyzing Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
