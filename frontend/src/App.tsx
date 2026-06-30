import { useState } from 'react';
import Navbar from './components/Navbar';
import Landing from './components/Landing';
import Dashboard from './pages/Dashboard';
import Pricing from './components/Pricing';

type Page = 'landing' | 'dashboard' | 'pricing';

function App() {
  const [page, setPage] = useState<Page>('landing');

  return (
    <div className="app">
      <Navbar currentPage={page} onNavigate={setPage} />
      {page === 'landing' && <Landing onNavigate={setPage} />}
      {page === 'dashboard' && <Dashboard />}
      {page === 'pricing' && <Pricing />}
    </div>
  );
}

export default App