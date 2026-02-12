import React, { useEffect, useState } from 'react';
import { getSummary } from '../api';
import { Users, AlertTriangle, Star, Activity } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import ROICalculator from './ROICalculator';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement);

const Dashboard = ({ refreshTrigger }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [refreshTrigger]);

    const fetchData = async () => {
        try {
            const result = await getSummary();
            setData(result);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading dashboard...</div>;
    if (!data || data.total_employees === 0) return (
        <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
            <h2>No Data Available</h2>
            <p style={{ color: 'var(--text-muted)' }}>Go to the Import tab to import your employee data.</p>
        </div>
    );

    // Risk Distribution Data
    const riskData = {
        labels: ['High Risk', 'Medium Risk', 'Low Risk'],
        datasets: [{
            data: [data.risk_breakdown.High, data.risk_breakdown.Medium, data.risk_breakdown.Low],
            backgroundColor: ['#ef4444', '#f59e0b', '#10b981'],
            borderWidth: 0,
        }],
    };

    // Department Data (New)
    const deptData = {
        labels: Object.keys(data.department_risk || {}),
        datasets: [{
            label: 'High Risk Employees',
            data: Object.values(data.department_risk || {}),
            backgroundColor: '#3b82f6',
            borderRadius: 4,
        }]
    };

    // Factors Data (New)
    const factorLabels = (data.top_risk_factors || []).map(x => x[0].split(':')[0]); // Simplify label
    const factorCounts = (data.top_risk_factors || []).map(x => x[1]);

    const factorData = {
        labels: factorLabels,
        datasets: [{
            label: 'Frequency',
            data: factorCounts,
            backgroundColor: '#8b5cf6',
            borderRadius: 4,
            indexAxis: 'y'
        }]
    };

    return (
        <div>
            {/* 1. KPI Cards */}
            <div className="grid grid-3" style={{ marginBottom: '2rem' }}>
                <KpiCard title="Total Workforce" value={data.total_employees} icon={Users} color="#3b82f6" />
                <KpiCard title="High Risk Employees" value={data.risk_breakdown.High} icon={AlertTriangle} color="#ef4444" isAlert />
                <KpiCard title="Critical Talent Risk" value={data.critical_talent} icon={Star} color="#f59e0b" />
            </div>

            {/* 2. Charts Row */}
            <div className="grid grid-2" style={{ marginBottom: '2rem', gap: '1.5rem' }}>

                {/* Risk Distribution */}
                <div className="card">
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1rem', fontWeight: 600 }}>Overall Attrition Risk</h3>
                    <div style={{ height: '220px', display: 'flex', justifyContent: 'center' }}>
                        <Doughnut data={riskData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'right' } } }} />
                    </div>
                </div>

                {/* Risk by Department */}
                <div className="card">
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1rem', fontWeight: 600 }}>Hotspots by Department</h3>
                    <div style={{ height: '220px' }}>
                        <Bar data={deptData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }} />
                    </div>
                </div>
            </div>

            {/* 3. Deep Dive Row */}
            <div className="grid grid-2" style={{ gap: '1.5rem' }}>
                {/* Top Risk Factors */}
                <div className="card">
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1rem', fontWeight: 600 }}>Top Systemic Risk Drivers</h3>
                    <div style={{ height: '250px' }}>
                        <Bar data={factorData} options={{ indexAxis: 'y', maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
                    </div>
                </div>

                {/* AI Insights */}
                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        <Activity color="#8b5cf6" size={20} />
                        <h3 style={{ fontSize: '1rem', margin: 0 }}>AI Strategic Insights</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '250px', overflowY: 'auto' }}>
                        {data.insights.map((insight, idx) => (
                            <div key={idx} style={{
                                padding: '1rem',
                                background: '#f8fafc',
                                borderRadius: '0.5rem',
                                borderLeft: '4px solid #8b5cf6',
                                fontSize: '0.9rem',
                                lineHeight: '1.5',
                                color: '#334155'
                            }}>
                                {insight}
                            </div>
                        ))}
                        {data.insights.length === 0 && <p style={{ color: '#94a3b8' }}>No specific insights generated yet.</p>}
                    </div>
                </div>
            </div>

            {/* 4. ROI Calculator */}
            <div style={{ marginTop: '2rem' }}>
                <ROICalculator riskData={data.risk_breakdown} />
            </div>

        </div>
    );
};

const KpiCard = ({ title, value, icon: Icon, color, isAlert }) => (
    <div className="card stat-card" style={{ borderLeft: isAlert ? `4px solid ${color}` : 'none' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>{title}</h3>
                <div className="value" style={{ color: isAlert ? color : '#1e293b' }}>{value}</div>
            </div>
            <div style={{ padding: '0.5rem', background: `${color}20`, borderRadius: '8px' }}>
                <Icon size={24} color={color} />
            </div>
        </div>
    </div>
);

export default Dashboard;
