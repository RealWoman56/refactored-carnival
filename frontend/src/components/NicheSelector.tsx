import { NICHE_OPTIONS } from '../services/api';

interface NicheSelectorProps {
  value: string;
  onChange: (niche: string) => void;
  disabled?: boolean;
}

export default function NicheSelector({ value, onChange, disabled }: NicheSelectorProps) {
  return (
    <div className="niche-selector">
      <label htmlFor="niche-select">Content Niche</label>
      <select
        id="niche-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="select-input"
      >
        <option value="">Select a niche...</option>
        {NICHE_OPTIONS.map((niche) => (
          <option key={niche.id} value={niche.id}>
            {niche.label}
          </option>
        ))}
      </select>
      {value && (
        <p className="niche-desc">
          {NICHE_OPTIONS.find((n) => n.id === value)?.description}
        </p>
      )}
    </div>
  );
}