import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { 
  Loader2, 
  Clock, 
  Users, 
  FileAudio, 
  Trash2,
  ChevronDown,
  ChevronUp,
  Download
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface Transcription {
  id: string;
  file_name: string;
  created_at: string;
  full_text: string | null;
  audio_duration: number | null;
  speakers_count: number | null;
  utterances: unknown;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function History() {
  const [transcriptions, setTranscriptions] = useState<Transcription[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchTranscriptions();
    }
  }, [user]);

  const fetchTranscriptions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('transcriptions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching transcriptions:', error);
        toast.error('Failed to load history');
      } else {
        setTranscriptions(data || []);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      const { error } = await supabase
        .from('transcriptions')
        .delete()
        .eq('id', id);

      if (error) {
        toast.error('Failed to delete transcription');
      } else {
        setTranscriptions((prev) => prev.filter((t) => t.id !== id));
        toast.success('Transcription deleted');
      }
    } catch (err) {
      console.error('Error deleting:', err);
    } finally {
      setDeleting(null);
    }
  };

  const downloadAsText = (transcription: Transcription) => {
    const content = transcription.full_text || 'No transcript available';
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${transcription.file_name.replace(/\.[^/.]+$/, '')}_transcript.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
      </div>

      <main className="flex-1 relative z-10 pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <header className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="gradient-text">Transcription History</span>
            </h1>
            <p className="text-muted-foreground">
              View and manage your past transcriptions.
            </p>
          </header>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : transcriptions.length === 0 ? (
            <div className="text-center py-12">
              <FileAudio className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No transcriptions yet</h3>
              <p className="text-muted-foreground mb-6">
                Start analyzing audio to see your history here.
              </p>
              <Button
                onClick={() => navigate('/dashboard')}
                className="bg-gradient-to-r from-primary to-accent text-background"
              >
                Analyze Audio
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {transcriptions.map((transcription) => (
                <div
                  key={transcription.id}
                  className="bg-card border border-border rounded-xl overflow-hidden"
                >
                  <div
                    className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() =>
                      setExpandedId(expandedId === transcription.id ? null : transcription.id)
                    }
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                          <FileAudio className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold truncate max-w-[200px] sm:max-w-none">
                            {transcription.file_name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(transcription.created_at), 'MMM d, yyyy • h:mm a')}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-4 text-sm text-muted-foreground">
                          {transcription.audio_duration && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {formatDuration(transcription.audio_duration)}
                            </span>
                          )}
                          {transcription.speakers_count && (
                            <span className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {transcription.speakers_count} speakers
                            </span>
                          )}
                        </div>
                        {expandedId === transcription.id ? (
                          <ChevronUp className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </div>

                  {expandedId === transcription.id && (
                    <div className="border-t border-border p-4 bg-muted/30">
                      <div className="sm:hidden flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        {transcription.audio_duration && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {formatDuration(transcription.audio_duration)}
                          </span>
                        )}
                        {transcription.speakers_count && (
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {transcription.speakers_count} speakers
                          </span>
                        )}
                      </div>

                      <div className="bg-background rounded-lg p-4 mb-4 max-h-48 overflow-y-auto">
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                          {transcription.full_text || 'No transcript available'}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadAsText(transcription);
                          }}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              disabled={deleting === transcription.id}
                              onClick={(e) => e.stopPropagation()}
                            >
                              {deleting === transcription.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Transcription</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this transcription? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(transcription.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
