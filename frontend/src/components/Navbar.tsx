interface NavbarProps {
  currentPage: 'landing' | 'dashboard' | 'pricing';
  onNavigate: (page: 'landing' | 'dashboard' | 'pricing') => void;
}

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => onNavigate('landing')}>
        <span className="navbar-logo">⚡</span>
        <span className="navbar-title">TikAuto</span>
      </div>
      <div className="navbar-links">
        <button
          className={`nav-link ${currentPage === 'landing' ? 'active' : ''}`}
          onClick={() => onNavigate('landing')}
        >
          Home
        </button>
        <button
          className={`nav-link ${currentPage === 'dashboard' ? 'active' : ''}`}
          onClick={() => onNavigate('dashboard')}
        >
          Dashboard
        </button>
        <button
          className={`nav-link ${currentPage === 'pricing' ? 'active' : ''}`}
          onClick={() => onNavigate('pricing')}
        >
          Plans & Pricing
        </button>
      </div>
    </nav>
  );
}