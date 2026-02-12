import React from 'react';
import { X, Check, AlertTriangle, TrendingUp, DollarSign, Briefcase } from 'lucide-react';

const ComparisonView = ({ employees, onClose }) => {
    if (employees.length !== 2) return null;

    const [emp1, emp2] = employees;

    const renderMetric = (label, val1, val2, icon, betterLow = false) => {
        // Simple highlight logic
        let h1 = false;
        let h2 = false;

        if (typeof val1 === 'number' && typeof val2 === 'number') {
            h1 = betterLow ? val1 < val2 : val1 > val2;
            h2 = betterLow ? val2 < val1 : val2 > val1;
        }

        return (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 1fr', padding: '1rem', borderBottom: '1px solid #f1f5f9', alignItems: 'center' }}>
                <div style={{ textAlign: 'right', fontWeight: h1 ? 700 : 400, color: h1 ? '#10b981' : '#64748b' }}>
                    {val1}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>{label}</div>
                    {icon && <div style={{ color: '#cbd5e1' }}>{icon}</div>}
                </div>
                <div style={{ textAlign: 'left', fontWeight: h2 ? 700 : 400, color: h2 ? '#10b981' : '#64748b' }}>
                    {val2}
                </div>
            </div>
        );
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.6)', zIndex: 60,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
            <div style={{
                background: 'white', width: '900px', maxWidth: '95vw', borderRadius: '1rem',
                maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column'
            }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '1.25rem' }}>Compare Candidates</h2>
                    <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><X /></button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', padding: '2rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    {/* Header Card 1 */}
                    <div className="card" style={{ borderTop: `4px solid ${emp1.Risk.Label === 'High Risk' ? '#ef4444' : '#10b981'}` }}>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{emp1.Name}</h3>
                        <div style={{ color: '#64748b' }}>{emp1.Department}</div>
                        <div style={{ marginTop: '0.5rem', fontWeight: 600, color: emp1.Risk.Label === 'High Risk' ? '#ef4444' : '#64748b' }}>
                            {emp1.Risk.Label}
                        </div>
                    </div>
                    {/* Header Card 2 */}
                    <div className="card" style={{ borderTop: `4px solid ${emp2.Risk.Label === 'High Risk' ? '#ef4444' : '#10b981'}` }}>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{emp2.Name}</h3>
                        <div style={{ color: '#64748b' }}>{emp2.Department}</div>
                        <div style={{ marginTop: '0.5rem', fontWeight: 600, color: emp2.Risk.Label === 'High Risk' ? '#ef4444' : '#64748b' }}>
                            {emp2.Risk.Label}
                        </div>
                    </div>
                </div>

                <div style={{ padding: '1rem 2rem' }}>
                    {renderMetric("Priority Score", emp1.PriorityScore, emp2.PriorityScore, <AlertTriangle size={16} />, true)}
                    {renderMetric("Experience (Yrs)", emp1.RawData?.TotalWorkingYears, emp2.RawData?.TotalWorkingYears, <Briefcase size={16} />)}
                    {renderMetric("Tenure (Yrs)", emp1.RawData?.YearsAtCompany, emp2.RawData?.YearsAtCompany, <TrendingUp size={16} />)}
                    {renderMetric("Income", `$${emp1.RawData?.MonthlyIncome}`, `$${emp2.RawData?.MonthlyIncome}`, <DollarSign size={16} />)}
                </div>

                <div style={{ padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <div>
                        <h4 style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '0.5rem' }}>Top Risk Factors</h4>
                        <ul style={{ paddingLeft: '1rem', fontSize: '0.9rem' }}>
                            {emp1.KeyFactors.map(f => <li key={f}>{f}</li>)}
                        </ul>
                    </div>
                    <div>
                        <h4 style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '0.5rem' }}>Top Risk Factors</h4>
                        <ul style={{ paddingLeft: '1rem', fontSize: '0.9rem' }}>
                            {emp2.KeyFactors.map(f => <li key={f}>{f}</li>)}
                        </ul>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ComparisonView;
