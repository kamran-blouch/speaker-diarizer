import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, MessageSquare, Globe, Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().trim().min(1, 'Please enter your name').max(100, 'Name must be under 100 characters'),
  email: z.string().trim().email('Please enter a valid email address').max(255),
  message: z.string().trim().min(10, 'Message must be at least 10 characters').max(1000, 'Message must be under 1000 characters'),
});

type FieldErrors = Partial<Record<'name' | 'email' | 'message', string>>;

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = contactSchema.safeParse({ name, email, message });
    if (!result.success) {
      const newErrors: FieldErrors = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof FieldErrors;
        if (field && !newErrors[field]) newErrors[field] = err.message;
      });
      setErrors(newErrors);
      toast.error('Please fix the errors in the form');
      return;
    }

    setErrors({});
    setSending(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSending(false);

    toast.success("Message sent! We'll get back to you soon.");
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
      value: 'Mon–Fri, 09:00–18:00 UTC',
    },
    {
      icon: Globe,
      label: 'Global Support',
      value: 'Serving 150+ countries worldwide',
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

      <main id="main-content" className="flex-1 relative z-10 pt-24 pb-20">
        <div className="container mx-auto px-4">
          <header className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Get in <span className="gradient-text">Touch</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Have a question or feedback? We'd love to hear from you. Our team is always here to help.
            </p>
          </header>

          <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Contact Form */}
            <section aria-labelledby="contact-form-heading" className="bg-card border border-border rounded-2xl p-8">
              <h2 id="contact-form-heading" className="text-xl font-semibold mb-6">Send us a message</h2>

              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Name <span className="text-destructive" aria-hidden="true">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors((p) => ({ ...p, name: undefined }));
                    }}
                    required
                    aria-required="true"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                    className={`bg-background ${errors.name ? 'border-destructive' : ''}`}
                  />
                  {errors.name && (
                    <p id="name-error" role="alert" className="text-sm text-destructive">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email <span className="text-destructive" aria-hidden="true">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
                    }}
                    required
                    aria-required="true"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    className={`bg-background ${errors.email ? 'border-destructive' : ''}`}
                  />
                  {errors.email && (
                    <p id="email-error" role="alert" className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">
                    Message <span className="text-destructive" aria-hidden="true">*</span>
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="How can we help you?"
                    rows={5}
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      if (errors.message) setErrors((p) => ({ ...p, message: undefined }));
                    }}
                    required
                    aria-required="true"
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? 'message-error' : 'message-help'}
                    maxLength={1000}
                    className={`bg-background resize-none ${errors.message ? 'border-destructive' : ''}`}
                  />
                  {errors.message ? (
                    <p id="message-error" role="alert" className="text-sm text-destructive">{errors.message}</p>
                  ) : (
                    <p id="message-help" className="text-xs text-muted-foreground">
                      {message.length}/1000 characters
                    </p>
                  )}
                </div>

                <p className="text-xs text-muted-foreground">
                  <span className="text-destructive" aria-hidden="true">*</span> Required fields
                </p>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-accent text-background font-semibold"
                  disabled={sending}
                >
                  {sending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" aria-hidden="true" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" aria-hidden="true" />
                  )}
                  {sending ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </section>

            {/* Contact Info */}
            <aside className="space-y-8">
              <section aria-labelledby="contact-info-heading">
                <h2 id="contact-info-heading" className="text-xl font-semibold mb-6">Contact Information</h2>
                <div className="space-y-4">
                  {contactInfo.map((info, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 bg-card border border-border rounded-xl"
                    >
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0">
                        <info.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="font-medium">{info.label}</p>
                        <p className="text-sm text-muted-foreground">{info.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-semibold mb-3">Response Time</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  We typically respond within 24 hours on business days. Times are shown in UTC for clarity across time zones.
                </p>
                <div className="h-2 bg-muted rounded-full overflow-hidden" role="progressbar" aria-valuenow={75} aria-valuemin={0} aria-valuemax={100} aria-label="Average response time">
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
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
