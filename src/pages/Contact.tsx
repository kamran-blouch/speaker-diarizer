import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, MessageSquare, MapPin, Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !message) {
      toast.error('Please fill in all fields');
      return;
    }

    setSending(true);
    // Simulate sending
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSending(false);
    
    toast.success('Message sent! We\'ll get back to you soon.');
    setName('');
    setEmail('');
    setMessage('');
  };

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: 'support@speakerdiarization.com',
    },
    {
      icon: MessageSquare,
      label: 'Live Chat',
      value: 'Available 9am - 6pm EST',
    },
    {
      icon: MapPin,
      label: 'Location',
      value: 'San Francisco, CA',
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
              Get in <span className="gradient-text">Touch</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Have a question or feedback? We'd love to hear from you. Our team is always here to help.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Contact Form */}
            <div className="bg-card border border-border rounded-2xl p-8">
              <h2 className="text-xl font-semibold mb-6">Send us a message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="How can we help you?"
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="bg-background resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-accent text-background font-semibold"
                  disabled={sending}
                >
                  {sending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  {sending ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold mb-6">Contact Information</h2>
                <div className="space-y-4">
                  {contactInfo.map((info, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 bg-card border border-border rounded-xl"
                    >
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0">
                        <info.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{info.label}</p>
                        <p className="text-sm text-muted-foreground">{info.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-semibold mb-3">Response Time</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  We typically respond to all inquiries within 24 hours during business days. For urgent matters, please use our live chat.
                </p>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-gradient-to-r from-primary to-accent rounded-full" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">Average response: 4 hours</p>
              </div>

              <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-xl p-6">
                <h3 className="font-semibold mb-2">Enterprise Support</h3>
                <p className="text-sm text-muted-foreground">
                  Need dedicated support or custom solutions? Contact our enterprise team for priority assistance and tailored packages.
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
