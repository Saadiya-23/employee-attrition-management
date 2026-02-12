import React, { useState } from 'react';
import { simulateRisk } from '../api';
import { RefreshCw, ArrowRight, TrendingUp, Home, GraduationCap, DollarSign } from 'lucide-react';

const Simulator = ({ employeeId, rawData }) => {
    const [salaryChange, setSalaryChange] = useState(0);
    const [promotion, setPromotion] = useState(false);
    const [remoteWork, setRemoteWork] = useState(false);
    const [training, setTraining] = useState(false);

    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const interventions = [
        {
            id: 'promo',
            label: 'Promotion',
            description: 'Advance their career',
            icon: <TrendingUp size={20} />,
            state: promotion,
            setter: setPromotion,
            color: '#3b82f6'
        },
        {
            id: 'remote',
            label: 'Remote Work',
            description: 'Flexible work location',
            icon: <Home size={20} />,
            state: remoteWork,
            setter: setRemoteWork,
            color: '#8b5cf6'
        },
        {
            id: 'train',
            label: 'Training',
            description: 'Upskill & develop',
            icon: <GraduationCap size={20} />,
            state: training,
            setter: setTraining,
            color: '#10b981'
        }
    ];

    const handleSimulate = async () => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            console.log('=== SIMULATION START ===');
            console.log('Employee ID:', employeeId);
            console.log('Raw Data:', rawData);

            const currentIncome = rawData?.MonthlyIncome || 5000;
            const newIncome = currentIncome * (1 + (salaryChange / 100));

            const changes = {
                'MonthlyIncome': newIncome,
                'Promotion': promotion,
                'RemoteWork': remoteWork,
                'Training': training
            };

            console.log('Changes to apply:', changes);

            const res = await simulateRisk(employeeId, changes);
            console.log('API Response:', res);

            if (res && res.error) {
                setError(res.error);
            } else if (res) {
                setResult(res);
            } else {
                setError('No response from server');
            }
        } catch (err) {
            console.error('=== SIMULATION ERROR ===');
            console.error('Error object:', err);
            console.error('Error message:', err.message);
            console.error('Error response:', err.response);
            setError(err.response?.data?.detail || err.message || 'Failed to run simulation');
        } finally {
            setLoading(false);
            console.log('=== SIMULATION END ===');
        }
    };

    return (
        <div style={{ marginTop: '2rem', background: 'white', borderRadius: '1rem', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)', overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', borderBottom: '1px solid #bae6fd' }}>
                <h3 style={{ fontSize: '1.1rem', color: '#0369a1', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, margin: 0 }}>
                    <RefreshCw size={20} /> Retention Simulator
                </h3>
                <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#5b8cbf', margin: '0.5rem 0 0 0' }}>
                    Model retention strategies and see projected impact
                </p>
            </div>

            <div style={{ padding: '1.5rem' }}>
                {/* Salary Input - Simplified */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.75rem' }}>
                        <DollarSign size={16} />
                        Salary Increase
                    </label>
                    <div style={{ position: 'relative' }}>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            step="5"
                            value={salaryChange}
                            onChange={(e) => setSalaryChange(Number(e.target.value))}
                            placeholder="0"
                            style={{
                                width: '100%',
                                padding: '0.875rem 3rem 0.875rem 1rem',
                                borderRadius: '0.5rem',
                                border: '2px solid #e2e8f0',
                                fontSize: '1.125rem',
                                fontWeight: 600,
                                color: '#1e293b',
                                outline: 'none',
                                transition: 'all 0.2s',
                                backgroundColor: '#f8fafc'
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#3b82f6';
                                e.target.style.backgroundColor = 'white';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = '#e2e8f0';
                                e.target.style.backgroundColor = '#f8fafc';
                            }}
                        />
                        <span style={{
                            position: 'absolute',
                            right: '1rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#94a3b8',
                            fontWeight: 700,
                            fontSize: '1.125rem'
                        }}>%</span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem', marginBottom: 0 }}>
                        Typical range: 5-20% for retention
                    </p>
                </div>

                {/* Strategic Interventions - Enhanced */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.75rem' }}>
                        Strategic Interventions
                    </label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {interventions.map((item) => (
                            <div
                                key={item.id}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    item.setter(!item.state);
                                }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    padding: '1rem',
                                    borderRadius: '0.75rem',
                                    cursor: 'pointer',
                                    background: item.state ? `${item.color}10` : 'white',
                                    border: item.state ? `2px solid ${item.color}` : '2px solid #e2e8f0',
                                    transition: 'all 0.2s ease',
                                    boxShadow: item.state ? `0 4px 12px ${item.color}20` : 'none'
                                }}
                            >
                                <div style={{
                                    padding: '0.5rem',
                                    borderRadius: '0.5rem',
                                    background: item.state ? item.color : '#f1f5f9',
                                    color: item.state ? 'white' : '#64748b',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {item.icon}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{
                                        fontSize: '0.95rem',
                                        fontWeight: 600,
                                        color: item.state ? item.color : '#1e293b',
                                        marginBottom: '0.125rem'
                                    }}>
                                        {item.label}
                                    </div>
                                    <div style={{
                                        fontSize: '0.8rem',
                                        color: item.state ? item.color : '#64748b'
                                    }}>
                                        {item.description}
                                    </div>
                                </div>
                                <div style={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    border: `2px solid ${item.state ? item.color : '#cbd5e1'}`,
                                    background: item.state ? item.color : 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s'
                                }}>
                                    {item.state && (
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'white' }} />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    onClick={handleSimulate}
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '1rem',
                        background: loading ? '#94a3b8' : 'linear-gradient(to right, #2563eb, #0ea5e9)',
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '1rem',
                        borderRadius: '0.75rem',
                        border: 'none',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        boxShadow: loading ? 'none' : '0 4px 14px rgba(37, 99, 235, 0.3)',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                    }}
                    onMouseEnter={(e) => !loading && (e.currentTarget.style.transform = 'translateY(-1px)')}
                    onMouseLeave={(e) => !loading && (e.currentTarget.style.transform = 'translateY(0)')}
                >
                    {loading ? (
                        <>
                            <RefreshCw className="spin" size={20} />
                            <span>Analyzing...</span>
                        </>
                    ) : (
                        <>
                            <RefreshCw size={20} />
                            <span>Run Analysis</span>
                        </>
                    )}
                </button>

                {/* Error Display */}
                {error && (
                    <div style={{
                        marginTop: '1rem',
                        padding: '1rem',
                        background: '#fef2f2',
                        border: '2px solid #fecaca',
                        borderRadius: '0.75rem',
                        color: '#991b1b',
                        fontSize: '0.875rem'
                    }}>
                        <strong>Error:</strong> {error}
                    </div>
                )}
            </div>

            {result && !result.error && (
                <div style={{ padding: '1.5rem', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', marginBottom: '1.5rem' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>Current</div>
                            <div style={{
                                fontWeight: 700,
                                color: result.original_risk === 'High Risk' ? '#ef4444' : result.original_risk === 'Medium Risk' ? '#f59e0b' : '#10b981',
                                fontSize: '1.125rem',
                                marginTop: '0.25rem'
                            }}>
                                {result.original_risk}
                            </div>
                        </div>
                        <div style={{ color: '#cbd5e1' }}>
                            <ArrowRight size={24} strokeWidth={3} />
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>Projected</div>
                            <div style={{
                                fontWeight: 700,
                                color: result.new_risk === 'High Risk' ? '#ef4444' : result.new_risk === 'Medium Risk' ? '#f59e0b' : '#10b981',
                                fontSize: '1.125rem',
                                marginTop: '0.25rem'
                            }}>
                                {result.new_risk}
                            </div>
                        </div>
                    </div>

                    <div style={{
                        padding: '1.25rem',
                        background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                        borderRadius: '0.75rem',
                        border: '2px solid #3b82f6',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '3rem', fontWeight: 900, color: '#2563eb', lineHeight: 1 }}>
                            {(100 - (result.new_probability * 100)).toFixed(0)}%
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#1e40af', marginTop: '0.5rem', fontWeight: 600 }}>
                            Retention Probability
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { 
                    0% { transform: rotate(0deg); } 
                    100% { transform: rotate(360deg); } 
                }
            `}</style>
        </div>
    );
};

export default Simulator;
