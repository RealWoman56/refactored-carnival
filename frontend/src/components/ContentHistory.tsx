interface ContentItem {
  id: number;
  niche: string;
  topic: string;
  timestamp: string;
  hasScript: boolean;
  hasVoiceover: boolean;
}

interface ContentHistoryProps {
  items: ContentItem[];
  onSelect: (index: number) => void;
  selectedIndex: number | null;
}

export default function ContentHistory({ items, onSelect, selectedIndex }: ContentHistoryProps) {
  if (items.length === 0) {
    return (
      <div className="history-empty">
        <p>No content generated yet.</p>
        <p className="hint">Use the form above to create your first script and voiceover.</p>
      </div>
    );
  }

  const nicheIcons: Record<string, string> = {
    psychology: '🧠',
    finance: '💰',
    mystery: '🔍',
  };

  return (
    <div className="content-history">
      <h3>Content History ({items.length})</h3>
      <div className="history-list">
        {[...items].reverse().map((item, idx) => {
          const actualIndex = items.length - 1 - idx;
          return (
            <button
              key={item.id}
              className={`history-item ${selectedIndex === actualIndex ? 'active' : ''}`}
              onClick={() => onSelect(actualIndex)}
            >
              <div className="history-item-header">
                <span className="history-niche">
                  {nicheIcons[item.niche] || '📄'} {item.niche}
                </span>
                <span className="history-time">{item.timestamp}</span>
              </div>
              <p className="history-topic">{item.topic}</p>
              <div className="history-status">
                {item.hasScript && <span className="status-dot script-done" title="Script generated" />}
                {item.hasVoiceover && <span className="status-dot voice-done" title="Voiceover generated" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}