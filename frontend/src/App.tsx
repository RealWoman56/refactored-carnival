import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="app">
      <header className="app-header">
        <h1>TikAuto</h1>
        <p className="tagline">Automated TikTok Monetization</p>
      </header>
      <main>
        <section className="hero">
          <h2>Scale Your TikTok Income</h2>
          <p>AI-powered video creation for faceless niche accounts.</p>
          <div className="cta-buttons">
            <button className="btn btn-primary">Get Started</button>
            <button className="btn btn-secondary">Learn More</button>
          </div>
        </section>
        <section className="features">
          <div className="feature-card">
            <h3>AI Scripts</h3>
            <p>Viral-worthy content generated in seconds.</p>
          </div>
          <div className="feature-card">
            <h3>Voiceovers</h3>
            <p>Natural-sounding AI narration.</p>
          </div>
          <div className="feature-card">
            <h3>Auto-Post</h3>
            <p>Schedule and publish across accounts.</p>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
