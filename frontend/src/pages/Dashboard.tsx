import { useState, useCallback } from 'react';
import GenerationForm from '../components/GenerationForm';
import ScriptPreview from '../components/ScriptPreview';
import AudioPlayer from '../components/AudioPlayer';
import ContentHistory from '../components/ContentHistory';
import {
  generateScript,
  generateVoiceover,
  GeneratedScript,
  VoiceoverResult,
} from '../services/api';

interface HistoryItem {
  id: number;
  niche: string;
  topic: string;
  timestamp: string;
  hasScript: boolean;
  hasVoiceover: boolean;
}

let historyCounter = 0;

export default function Dashboard() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [script, setScript] = useState<GeneratedScript | null>(null);
  const [voiceover, setVoiceover] = useState<VoiceoverResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async (niche: string, topic: string) => {
    setIsGenerating(true);
    setError(null);

    const timestamp = new Date().toLocaleTimeString();
    const historyId = ++historyCounter;

    try {
      // Step 1: Generate script
      const generatedScript = await generateScript(niche, topic);
      setScript(generatedScript);
      setVoiceover(null);

      // Step 2: Generate voiceover using the full script text
      let voiceoverResult: VoiceoverResult | null = null;
      try {
        voiceoverResult = await generateVoiceover(
          generatedScript.fullScript.substring(0, 5000),
          niche
        );
        setVoiceover(voiceoverResult);
      } catch (voiceErr) {
        console.warn('Voiceover generation failed (non-critical):', voiceErr);
      }

      // Add to history
      const historyItem: HistoryItem = {
        id: historyId,
        niche,
        topic,
        timestamp,
        hasScript: true,
        hasVoiceover: !!voiceoverResult,
      };
      setHistory((prev) => [...prev, historyItem]);
      setSelectedIndex(history.length);

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Generation failed';
      setError(message);
      console.error('Generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  }, [history.length]);

  const handleHistorySelect = (index: number) => {
    setSelectedIndex(index);
    // Re-select would load from history if we stored full results
    // For now, the latest generation is always shown
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>TikAuto Dashboard</h1>
        <p className="dashboard-subtitle">
          AI-powered TikTok content generation — scripts, voiceovers, and more
        </p>
      </header>

      {error && (
        <div className="error-banner">
          <span>⚠️</span>
          <p>{error}</p>
          <button className="error-dismiss" onClick={() => setError(null)}>×</button>
        </div>
      )}

      <div className="dashboard-grid">
        <div className="dashboard-column column-left">
          <GenerationForm onGenerate={handleGenerate} isGenerating={isGenerating} />
          <ContentHistory
            items={history}
            onSelect={handleHistorySelect}
            selectedIndex={selectedIndex}
          />
        </div>

        <div className="dashboard-column column-right">
          <ScriptPreview script={script} />
          <AudioPlayer voiceover={voiceover} isGenerating={isGenerating} />
        </div>
      </div>

      {!script && !isGenerating && (
        <div className="getting-started">
          <h2>Getting Started</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Select a Niche</h3>
                <p>Choose from Psychology, Finance, or Mystery content categories.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Enter a Topic</h3>
                <p>Use our suggestions or write your own topic for the viral script.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Generate</h3>
                <p>Click the button to generate both the script and voiceover automatically.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}