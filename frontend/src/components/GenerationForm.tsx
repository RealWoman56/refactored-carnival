import { useState } from 'react';
import NicheSelector from './NicheSelector';

interface GenerationFormProps {
  onGenerate: (niche: string, topic: string) => Promise<void>;
  isGenerating: boolean;
}

export default function GenerationForm({ onGenerate, isGenerating }: GenerationFormProps) {
  const [niche, setNiche] = useState('');
  const [topic, setTopic] = useState('');

  const TOPIC_SUGGESTIONS: Record<string, string[]> = {
    psychology: [
      '5 body language tricks that command respect',
      '3 phrases narcissists always use',
      'How childhood trauma shapes attachment styles',
      'The door-in-the-face persuasion technique',
      '4 stoic lessons for handling criticism',
    ],
    finance: [
      'The 50/30/20 rule explained simply',
      'Why the rich use debt differently',
      '3 investing terms every beginner must know',
      'How to automate your savings',
      'The latte factor explained',
    ],
    relationships: [
      'Why you keep attracting the same type',
      '5 signs of healthy communication',
      'How to set boundaries with loved ones',
      'Attachment styles explained simply',
      'The one conversation that changes everything',
    ],
  };

  const suggestions = niche ? TOPIC_SUGGESTIONS[niche] || [] : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!niche || !topic.trim()) return;
    await onGenerate(niche, topic.trim());
  };

  return (
    <div className="generation-form-card">
      <h2>Generate New Content</h2>
      <form onSubmit={handleSubmit} className="generation-form">
        <NicheSelector value={niche} onChange={setNiche} disabled={isGenerating} />

        <div className="topic-input-group">
          <label htmlFor="topic-input">Topic</label>
          <input
            id="topic-input"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., 5 morning habits for fat loss"
            disabled={isGenerating}
            maxLength={500}
            className="text-input"
          />
        </div>

        {suggestions.length > 0 && (
          <div className="topic-suggestions">
            <p className="suggestions-label">Suggestions:</p>
            <div className="suggestion-chips">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  className="chip"
                  onClick={() => setTopic(s)}
                  disabled={isGenerating}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary btn-generate"
          disabled={isGenerating || !niche || !topic.trim()}
        >
          {isGenerating ? (
            <span className="btn-loading">
              <span className="spinner" />
              Generating...
            </span>
          ) : (
            '🚀 Generate Script & Voiceover'
          )}
        </button>
      </form>
    </div>
  );
}