import React, { useEffect, useState } from 'react';
import { getEmployeeDetail } from '../api';
import { X, User, Briefcase, TrendingUp, AlertOctagon } from 'lucide-react';
import Simulator from './Simulator';
import EmailGenerator from './EmailGenerator';

const EmployeeDetail = ({ employeeId, onClose }) => {
    const [emp, setEmp] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (employeeId) {
            setLoading(true);
            getEmployeeDetail(employeeId)
                .then(data => setEmp(data))
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        }
    }, [employeeId]);

    if (!employeeId) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'end',
            zIndex: 50
        }}>
            <div style={{
                width: '500px', maxWidth: '100%', background: 'white',
                height: '100%', padding: '2rem', overflowY: 'auto',
                boxShadow: '-4px 0 15px rgba(0,0,0,0.1)'
            }}>

                {loading ? (
                    <div>Loading details...</div>
                ) : !emp ? (
                    <div>Failed to load.</div>
                ) : (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '2rem' }}>
                            <div>
                                <h2 style={{ fontSize: '1.5rem' }}>{emp.Name}</h2>
                                <p style={{ color: 'var(--text-muted)' }}>{emp.Department} • ID: {emp.EmployeeID}</p>
                            </div>
                            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                <X size={24} color="var(--text-muted)" />
                            </button>
                        </div>

                        {/* Risk & Impact Summary */}
                        <div className="grid grid-2" style={{ marginBottom: '2rem' }}>
                            <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: 'var(--radius)' }}>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Attrition Risk</div>
                                <div style={{ fontSize: '1.25rem', fontWeight: 600, color: emp.Risk.Label === 'High Risk' ? 'var(--danger)' : 'var(--text-main)' }}>
                                    {emp.Risk.Label}
                                </div>
                            </div>
                            <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: 'var(--radius)' }}>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Business Impact</div>
                                <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>
                                    {emp.Impact.category}
                                </div>
                            </div>
                        </div>

                        {/* Why This Matters */}
                        <section style={{ marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <User size={18} /> Why This Employee Matters
                            </h3>
                            <p style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
                                {emp.Impact.explanation}
                            </p>
                        </section>

                        {/* Smart Actions Section */}
                        <section style={{ marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                <div style={{ padding: '0.5rem', background: '#dbeafe', borderRadius: '8px' }}>
                                    <Briefcase size={20} color="#2563eb" />
                                </div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1e293b' }}>Smart Retention Actions</h3>
                            </div>

                            <EmailGenerator employee={emp} />
                        </section>

                        {/* Retention Simulator */}
                        {emp.RawData && (
                            <section style={{ marginBottom: '2rem' }}>
                                <Simulator employeeId={emp.EmployeeID} rawData={emp.RawData} />
                            </section>
                        )}

                        {/* Risk Factors */}
                        <section style={{ marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <TrendingUp size={18} /> Top Risk Factors
                            </h3>
                            <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {emp.KeyFactors.map((factor, idx) => (
                                    <li key={idx} style={{ fontSize: '0.95rem' }}>{factor}</li>
                                ))}
                            </ul>
                        </section>

                        {/* Recommendations */}
                        <section>
                            <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)' }}>
                                <Briefcase size={18} /> Recommended Actions
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {emp.RecommendedActions.map((action, idx) => (
                                    <div key={idx} style={{
                                        padding: '0.75rem',
                                        background: '#eff6ff',
                                        borderRadius: 'var(--radius)',
                                        border: '1px solid #dbeafe',
                                        fontSize: '0.9rem'
                                    }}>
                                        {action}
                                    </div>
                                ))}
                            </div>
                        </section>

                    </div>
                )}
            </div>
        </div>
    );
};

export default EmployeeDetail;
