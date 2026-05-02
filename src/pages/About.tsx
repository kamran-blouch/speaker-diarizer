import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { WaveformVisual } from '@/components/WaveformVisual';
import { Mic, Users, Zap, Globe, Target, Heart } from 'lucide-react';

export default function About() {
  const values = [
    {
      icon: Target,
      title: 'Accuracy First',
      description: 'We prioritize precision in speaker identification, constantly improving our AI models.',
    },
    {
      icon: Zap,
      title: 'Speed Matters',
      description: 'Fast processing times without compromising on the quality of results.',
    },
    {
      icon: Heart,
      title: 'User-Centric',
      description: 'Every feature we build starts with understanding our users\' needs.',
    },
    {
      icon: Globe,
      title: 'Accessible',
      description: 'Making advanced AI technology available to everyone, everywhere.',
    },
  ];

  const stats = [
    { value: '10M+', label: 'Minutes Processed' },
    { value: '50K+', label: 'Happy Users' },
    { value: '95%+', label: 'Accuracy Rate' },
    { value: '150+', label: 'Countries Served' },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
      </div>

      <main id="main-content" className="flex-1 relative z-10 pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Hero */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-2xl bg-gradient-to-br from-primary to-accent mb-6">
              <Mic className="h-10 w-10 text-background" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About <span className="gradient-text">Speaker Diarization</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              We're on a mission to make audio analysis accessible and effortless through the power of artificial intelligence.
            </p>
          </div>

          {/* Waveform */}
          <div className="h-24 mb-20" aria-hidden="true">
            <WaveformVisual />
          </div>

          {/* Story */}
          <div className="max-w-3xl mx-auto mb-20">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Our <span className="gradient-text">Story</span>
            </h2>
            <div className="bg-card border border-border rounded-2xl p-8">
              <p className="text-muted-foreground mb-4">
                Speaker Diarization was born from a simple frustration: transcribing meetings and interviews was tedious, and existing solutions couldn't reliably tell who said what.
              </p>
              <p className="text-muted-foreground mb-4">
                We set out to build something better. Using cutting-edge AI technology, we created a tool that not only transcribes audio but accurately identifies and labels each speaker, making your recordings truly searchable and actionable.
              </p>
              <p className="text-muted-foreground">
                Today, we serve thousands of users worldwide – from journalists and researchers to businesses and content creators – helping them unlock the value in their audio content.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20" role="list" aria-label="Key statistics">
            {stats.map((stat, index) => (
              <div key={index} role="listitem" className="text-center p-6 bg-card border border-border rounded-xl">
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Values */}
          <div className="mb-20">
            <h2 className="text-2xl font-bold mb-8 text-center">
              Our <span className="gradient-text">Values</span>
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <div key={index} className="p-6 bg-card border border-border rounded-xl text-center">
                  <div className="h-12 w-12 mx-auto rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Team Visual */}
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-8">
              Built by a <span className="gradient-text">Passionate Team</span>
            </h2>
            <div className="flex justify-center items-center gap-4">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Users className="h-10 w-10 text-background" />
              </div>
            </div>
            <p className="text-muted-foreground mt-6 max-w-xl mx-auto">
              Our diverse team of AI researchers, engineers, and designers work together to push the boundaries of what's possible in audio analysis.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
