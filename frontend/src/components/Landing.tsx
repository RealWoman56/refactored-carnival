interface LandingProps {
  onNavigate: (page: 'dashboard' | 'pricing') => void;
}

export default function Landing({ onNavigate }: LandingProps) {
  return (
    <div className="landing">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-badge">🔥 NOW LIVE</div>
        <h1 className="hero-headline">
          THE UNFAIR ADVANTAGE<br />
          <span className="hero-highlight">FOR FACELESS CREATORS.</span>
        </h1>
        <p className="hero-subheadline">STOP SCROLLING. START EARNING.</p>
        <div className="hero-cta-row">
          <button className="btn btn-neon" onClick={() => onNavigate('dashboard')}>
            ⚡ ENTER THE ARENA
          </button>
          <button className="btn btn-ghost" onClick={() => onNavigate('pricing')}>
            VIEW PRICING
          </button>
        </div>
        <div className="hero-stats">
          <div className="hero-stat">
            <span className="hero-stat-value">150+</span>
            <span className="hero-stat-label">Viral Topics</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-value">3</span>
            <span className="hero-stat-label">Profitable Niches</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-value">67</span>
            <span className="hero-stat-label">Proven Hooks</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-value">1-CLICK</span>
            <span className="hero-stat-label">Video Generation</span>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <h2 className="section-title">THE SYSTEM</h2>
        <p className="section-subtitle">Raw. Automated. Unstoppable.</p>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-card-number">01</div>
            <h3>PICK YOUR NICHE</h3>
            <p>Psychology. Finance. Relationships. Pick the battlefield.</p>
          </div>
          <div className="step-card">
            <div className="step-card-number">02</div>
            <h3>AI WRITES THE SCRIPT</h3>
            <p>Provocative hooks. Body. CTA. Algorithm-optimized in seconds.</p>
          </div>
          <div className="step-card">
            <div className="step-card-number">03</div>
            <h3>VOICEOVER + VISUALS</h3>
            <p>ElevenLabs voice + AI visuals. No face. No mic. No excuses.</p>
          </div>
          <div className="step-card">
            <div className="step-card-number">04</div>
            <h3>ONE CLICK. DONE.</h3>
            <p>FFmpeg assembles your viral video. Ready to post. Every time.</p>
          </div>
        </div>
      </section>

      {/* Niche Section */}
      <section className="niche-showcase">
        <h2 className="section-title">YOUR WEAPONS</h2>
        <p className="section-subtitle">Three niches. Infinite content.</p>
        <div className="niche-cards">
          <div className="niche-card">
            <div className="niche-icon">🧠</div>
            <h3>PSYCHOLOGY</h3>
            <p>Dark psychology, body language, cognitive biases — the truths people fear.</p>
          </div>
          <div className="niche-card">
            <div className="niche-icon">💰</div>
            <h3>FINANCE</h3>
            <p>The pure truth about money. Unfair advantages of the 1%. Raw side-hustle reality.</p>
          </div>
          <div className="niche-card">
            <div className="niche-icon">💞</div>
            <h3>RELATIONSHIPS</h3>
            <p>Attachment theory with an edge. Psychology of attraction. Raw communication truths.</p>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner">
        <h2>READY TO STOP SCROLLING?</h2>
        <p>Join the creators who already have the unfair advantage.</p>
        <button className="btn btn-neon btn-large" onClick={() => onNavigate('dashboard')}>
          ⚡ START GENERATING
        </button>
      </section>
    </div>
  );
}