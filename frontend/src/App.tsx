import { useState } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Pricing from './components/Pricing';

function App() {
  const [page, setPage] = useState<'dashboard' | 'pricing'>('dashboard');

  return (
    <div className="app">
      <Navbar currentPage={page} onNavigate={setPage} />
      {page === 'dashboard' ? <Dashboard /> : <Pricing />}
    </div>
  );
}

export default App