import { GeneratedScript, ScriptSection } from '../services/api';

interface ScriptPreviewProps {
  script: GeneratedScript;
}

function SectionBadge({ type }: { type: string }) {
  const labels: Record<string, { label: string; className: string }> = {
    hook: { label: '🎣 Hook', className: 'badge-hook' },
    body: { label: '📖 Body', className: 'badge-body' },
    call_to_action: { label: '👋 Call to Action', className: 'badge-cta' },
  };
  const info = labels[type] || { label: type, className: '' };
  return <span className={`badge ${info.className}`}>{info.label}</span>;
}

export default function ScriptPreview({ script }: ScriptPreviewProps) {
  if (!script || !script.sections || script.sections.length === 0) {
    return (
      <div className="preview-empty">
        <p>No script generated yet. Use the form to create one.</p>
      </div>
    );
  }

  return (
    <div className="script-preview">
      <div className="script-header">
        <h3>Generated Script</h3>
        <div className="script-meta">
          <span className="meta-tag">{script.niche}</span>
          <span className="meta-tag">{script.estimatedDuration}</span>
          <span className="meta-tag model-tag">{script.model}</span>
        </div>
        <p className="script-topic">Topic: {script.topic}</p>
      </div>

      <div className="script-sections">
        {script.sections.map((section: ScriptSection, idx: number) => (
          <div key={idx} className="script-section">
            <SectionBadge type={section.type} />
            {section.visualCue && (
              <p className="visual-cue">🎬 <em>{section.visualCue}</em></p>
            )}
            <p className="section-content">{section.content}</p>
          </div>
        ))}
      </div>

      <details className="full-script-toggle">
        <summary>📄 View full script text</summary>
        <pre className="full-script">{script.fullScript}</pre>
      </details>
    </div>
  );
}