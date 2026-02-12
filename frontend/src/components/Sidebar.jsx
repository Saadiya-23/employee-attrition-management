import React from 'react';
import { LayoutDashboard, Users, UploadCloud, PieChart, Settings, LogOut } from 'lucide-react';

const Sidebar = ({ currentView, setView }) => {
    const menuItems = [
        { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
        { id: 'employees', label: 'Employee Risk', icon: Users },
        { id: 'upload', label: 'Data Import', icon: UploadCloud },
    ];

    return (
        <div style={{
            width: '260px',
            background: '#0f172a', /* Slate 900 */
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            position: 'sticky',
            top: 0
        }}>
            {/* Brand */}
            <div style={{ padding: '2rem 1.5rem', borderBottom: '1px solid #1e293b' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '32px', height: '32px', background: '#3b82f6', borderRadius: '8px' }}></div>
                    <div>
                        <div style={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.02em' }}>RetentionAI</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Enterprise Edition</div>
                    </div>
                </div>
            </div>

            {/* Menu */}
            <nav style={{ flex: 1, padding: '1.5rem 1rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '1rem', paddingLeft: '0.75rem' }}>
                    MAIN MENU
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {menuItems.map(item => {
                        const Icon = item.icon;
                        const active = currentView === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setView(item.id)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '0.5rem',
                                    background: active ? '#1e293b' : 'transparent',
                                    color: active ? '#ffffff' : '#94a3b8',
                                    border: 'none',
                                    cursor: 'pointer',
                                    width: '100%',
                                    textAlign: 'left',
                                    transition: 'all 0.2s',
                                    fontSize: '0.95rem',
                                    fontWeight: 500
                                }}
                            >
                                <Icon size={20} />
                                {item.label}
                            </button>
                        );
                    })}
                </div>
            </nav>

            {/* Footer */}
            <div style={{ padding: '1.5rem', borderTop: '1px solid #1e293b' }}>
                <button style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem'
                }}>
                    <Settings size={18} /> Settings
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
