import { VoiceoverResult } from '../services/api';

interface AudioPlayerProps {
  voiceover: VoiceoverResult | null;
  isGenerating: boolean;
}

export default function AudioPlayer({ voiceover, isGenerating }: AudioPlayerProps) {
  if (isGenerating) {
    return (
      <div className="audio-player-card generating">
        <div className="audio-generating">
          <span className="spinner" />
          <p>Generating voiceover...</p>
        </div>
      </div>
    );
  }

  if (!voiceover) {
    return (
      <div className="audio-player-card empty">
        <p>No voiceover generated yet.</p>
      </div>
    );
  }

  const voiceLabels: Record<string, string> = {
    Rachel: '🧠 Psychology — Rachel (warm female)',
    Antoni: '💰 Finance — Antoni (energetic male)',
    Patrick: '🔍 Mystery — Patrick (deep male)',
  };

  return (
    <div className="audio-player-card">
      <div className="audio-header">
        <h3>Voiceover Preview</h3>
        <div className="audio-meta">
          <span className="meta-tag">{voiceLabels[voiceover.voiceName] || voiceover.voiceName}</span>
          <span className="meta-tag">{voiceover.duration}s</span>
          <span className="meta-tag model-tag">{voiceover.model}</span>
        </div>
      </div>

      <audio
        controls
        className="audio-player"
        src={voiceover.audioUrl}
        preload="auto"
      >
        Your browser does not support the audio element.
      </audio>

      <div className="audio-info">
        <span>Duration: ~{voiceover.duration} seconds</span>
        <span>Voice: {voiceover.voiceName}</span>
      </div>
    </div>
  );
}