import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface SpeakerSettingsProps {
  speakersExpected: number;
  onSpeakersChange: (value: number) => void;
  disabled?: boolean;
}

export function SpeakerSettings({ speakersExpected, onSpeakersChange, disabled }: SpeakerSettingsProps) {
  return (
    <div className="card-gradient rounded-xl border border-border p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Settings</h3>
      <div className="space-y-4">
        <div>
          <Label htmlFor="speakers" className="text-muted-foreground mb-2 block">
            Expected number of speakers (optional)
          </Label>
          <Input
            id="speakers"
            type="number"
            min={0}
            max={10}
            value={speakersExpected || ''}
            onChange={(e) => onSpeakersChange(parseInt(e.target.value) || 0)}
            placeholder="Auto-detect"
            disabled={disabled}
            className="bg-secondary border-border max-w-[200px]"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Leave empty to auto-detect speakers
          </p>
        </div>
      </div>
    </div>
  );
}
