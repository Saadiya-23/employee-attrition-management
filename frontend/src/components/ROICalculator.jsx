import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingDown, Users, Calculator } from 'lucide-react';

const ROICalculator = ({ riskData }) => {
    // Default assumptions
    const [avgReplacementCost, setAvgReplacementCost] = useState(30000); // Cost per hire
    const [rampUpTime, setRampUpTime] = useState(3); // Months to full productivity
    const [trainingCost, setTrainingCost] = useState(5000);

    // Stats
    const highRiskCount = riskData.High || 0;

    // Calculations
    const totalPotentialLoss = (highRiskCount * (avgReplacementCost + trainingCost));

    const [projectedSavings, setProjectedSavings] = useState(0);

    useEffect(() => {
        // Assume we can save 40% of them with intervention
        setProjectedSavings(totalPotentialLoss * 0.4);
    }, [totalPotentialLoss]);

    return (
        <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
                <div style={{ padding: '0.5rem', background: '#dcfce7', borderRadius: '8px' }}>
                    <Calculator size={20} color="#15803d" />
                </div>
                <div>
                    <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Retention ROI Calculator</h2>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>Estimate the business value of your retention efforts.</p>
                </div>
            </div>

            <div className="grid grid-2" style={{ gap: '2rem' }}>
                {/* Inputs */}
                <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '0.5rem' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Cost Assumptions</h3>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, marginBottom: '0.5rem' }}>Avg. Replacement Cost ($)</label>
                        <input
                            type="number"
                            value={avgReplacementCost}
                            onChange={e => setAvgReplacementCost(Number(e.target.value))}
                            style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, marginBottom: '0.5rem' }}>Training & Onboarding ($)</label>
                        <input
                            type="number"
                            value={trainingCost}
                            onChange={e => setTrainingCost(Number(e.target.value))}
                            style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem' }}
                        />
                    </div>
                </div>

                {/* Outputs */}
                <div>
                    <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Projected Business Impact</h3>

                    <div style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }}>
                        <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Total Risk Exposure (High Risk Employees)</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ef4444' }}>
                            ${totalPotentialLoss.toLocaleString()}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Based on {highRiskCount} high risk employees</div>
                    </div>

                    <div style={{ padding: '1rem', background: '#ecfdf5', borderRadius: '0.5rem', border: '1px solid #6ee7b7' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                            <TrendingDown size={18} color="#059669" />
                            <div style={{ fontSize: '0.9rem', color: '#047857', fontWeight: 600 }}>Potential Savings (Target: 40% Retention)</div>
                        </div>
                        <div style={{ fontSize: '2rem', fontWeight: 800, color: '#059669' }}>
                            ${projectedSavings.toLocaleString()}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#047857' }}>
                            Money saved by intervening now.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ROICalculator;
