import React, { useState } from 'react';
import './styles/main.css';
import Sidebar from './components/Sidebar';
import Upload from './components/Upload';
import Dashboard from './components/Dashboard';
import EmployeeList from './components/EmployeeList';
import EmployeeDetail from './components/EmployeeDetail';
import ChatWidget from './components/ChatWidget';
import { Layout } from 'lucide-react';

function App() {
  const [view, setView] = useState('dashboard');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  const handleUploadSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
    setView('dashboard'); // Auto-switch to dashboard on upload
    // Optional: show toast
  };

  const renderContent = () => {
    switch (view) {
      case 'upload':
        return (
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '0.5rem' }}>Import Data</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Upload your latest HR export to update the risk model.</p>
            <Upload onUploadSuccess={handleUploadSuccess} />
          </div>
        );
      case 'employees':
        return (
          <div>
            <EmployeeList
              onSelectEmployee={(id) => setSelectedEmployeeId(id)}
              refreshTrigger={refreshTrigger}
            />
          </div>
        );
      case 'dashboard':
      default:
        // Dashboard now acts as the main landing
        return (
          <Dashboard refreshTrigger={refreshTrigger} />
        );
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      <Sidebar currentView={view} setView={setView} />

      <main style={{ flex: 1, padding: '2.5rem', overflowY: 'auto' }}>
        {/* Header Area */}
        <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', color: '#1e293b' }}>
              {view === 'dashboard' && 'Executive Overview'}
              {view === 'employees' && 'Workforce Risk Register'}
              {view === 'upload' && 'Data Ingestion'}
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>last updated: Just now</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>HR Admin</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Headquarters</div>
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#cbd5e1' }}></div>
          </div>
        </header>

        {renderContent()}
      </main>

      {selectedEmployeeId && (
        <EmployeeDetail
          employeeId={selectedEmployeeId}
          onClose={() => setSelectedEmployeeId(null)}
        />
      )}

      <ChatWidget />
    </div>
  );
}

export default App;
