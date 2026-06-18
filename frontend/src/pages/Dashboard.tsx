import { useState, useCallback, useEffect } from 'react';
import GenerationForm from '../components/GenerationForm';
import ScriptPreview from '../components/ScriptPreview';
import AudioPlayer from '../components/AudioPlayer';
import ContentHistory from '../components/ContentHistory';
import {
  generateScript,
  generateVoiceover,
  getHistory,
  GeneratedScript,
  VoiceoverResult,
} from '../services/api';

interface HistoryItem {
  id: string;
  niche: string;
  topic: string;
  timestamp: string;
  hasScript: boolean;
  hasVoiceover: boolean;
}

export default function Dashboard() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [script, setScript] = useState<GeneratedScript | null>(null);
  const [voiceover, setVoiceover] = useState<VoiceoverResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch history from backend on mount
  useEffect(() => {
    async function loadHistory() {
      try {
        const data = await getHistory(50, 0);
        const mapped: HistoryItem[] = data.items.map((item: any) => ({
          id: item.id,
          niche: item.niche,
          topic: item.topic,
          timestamp: new Date(item.created_at + 'Z').toLocaleTimeString(),
          hasScript: item.hasScript === 1 || item.hasScript === true,
          hasVoiceover: item.hasAudio === 1 || item.hasAudio === true,
        }));
        setHistory(mapped);
      } catch (err) {
        console.warn('Failed to load history:', err);
      } finally {
        setIsLoadingHistory(false);
      }
    }
    loadHistory();
  }, []);

  const handleGenerate = useCallback(async (niche: string, topic: string) => {
    setIsGenerating(true);
    setError(null);
    let generationId: string | null = null;

    try {
      // Step 1: Generate script (returns generationId from backend)
      const generatedScript = await generateScript(niche, topic);
      setScript(generatedScript);
      setVoiceover(null);
      generationId = (generatedScript as any).generationId || null;

      // Step 2: Generate voiceover using the full script text, passing generationId
      let voiceoverResult: VoiceoverResult | null = null;
      try {
        voiceoverResult = await generateVoiceover(
          generatedScript.fullScript.substring(0, 5000),
          niche,
          generationId || undefined
        );
        setVoiceover(voiceoverResult);
      } catch (voiceErr) {
        console.warn('Voiceover generation failed (non-critical):', voiceErr);
      }

      // Refresh history from backend
      try {
        const data = await getHistory(50, 0);
        const mapped: HistoryItem[] = data.items.map((item: any) => ({
          id: item.id,
          niche: item.niche,
          topic: item.topic,
          timestamp: new Date(item.created_at + 'Z').toLocaleTimeString(),
          hasScript: item.hasScript === 1 || item.hasScript === true,
          hasVoiceover: item.hasAudio === 1 || item.hasAudio === true,
        }));
        setHistory(mapped);
      } catch {
        // silent
      }

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Generation failed';
      setError(message);
      console.error('Generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const handleHistorySelect = (index: number) => {
    setSelectedIndex(index);
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
          {isLoadingHistory ? (
            <div className="history-loading">
              <span className="spinner" />
              <p>Loading history...</p>
            </div>
          ) : (
            <ContentHistory
              items={history}
              onSelect={handleHistorySelect}
              selectedIndex={selectedIndex}
            />
          )}
        </div>

        <div className="dashboard-column column-right">
          {script && <ScriptPreview script={script} />}
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