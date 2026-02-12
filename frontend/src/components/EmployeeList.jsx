import React, { useEffect, useState } from 'react';
import { getEmployees } from '../api';
import { ArrowRight, Search, Filter, X } from 'lucide-react';
import ComparisonView from './ComparisonView';

const EmployeeList = ({ onSelectEmployee, refreshTrigger }) => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedForCompare, setSelectedForCompare] = useState([]);
    const [showCompare, setShowCompare] = useState(false);

    useEffect(() => {
        fetchData();
    }, [refreshTrigger]);

    const fetchData = async () => {
        try {
            const data = await getEmployees();
            setEmployees(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const toggleCompare = (id) => {
        if (selectedForCompare.includes(id)) {
            setSelectedForCompare(prev => prev.filter(x => x !== id));
        } else {
            if (selectedForCompare.length >= 2) return; // Max 2
            setSelectedForCompare(prev => [...prev, id]);
        }
    };

    const getComparisonData = () => {
        return employees.filter(e => selectedForCompare.includes(e.EmployeeID));
    };

    const filtered = employees.filter(e => {
        const matchesSearch = e.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            e.EmployeeID.toLowerCase().includes(searchTerm.toLowerCase()) ||
            e.Department.toLowerCase().includes(searchTerm.toLowerCase());

        if (!matchesSearch) return false;

        if (filter === 'All') return true;
        if (filter === 'High Risk') return e.Risk.Label === 'High Risk';
        if (filter === 'Critical') return e.Impact.category === 'Critical';
        return true;
    });

    if (loading) return <div>Loading list...</div>;

    return (
        <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <h2 style={{ margin: 0 }}>Employee Risk Analysis</h2>
                    <div style={{ position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input
                            type="text"
                            placeholder="Search by name, ID, or dept..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                padding: '0.5rem 0.75rem 0.5rem 2.5rem',
                                borderRadius: '0.5rem',
                                border: '1px solid #e2e8f0',
                                fontSize: '0.9rem',
                                width: '280px',
                                outline: 'none',
                                transition: 'border-color 0.2s'
                            }}
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {['All', 'High Risk', 'Critical'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`btn ${filter === f ? 'btn-primary' : 'btn-outline'} `}
                            style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem' }}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table>
                    <thead>
                        <tr>
                            <th style={{ width: '40px' }}></th>
                            <th>Employee</th>
                            <th>Department</th>
                            <th>Attrition Risk</th>
                            <th>Business Impact</th>
                            <th>Priority Score</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>No records found.</td></tr>
                        ) : (
                            filtered.map((emp) => (
                                <tr key={emp.EmployeeID} style={{ background: selectedForCompare.includes(emp.EmployeeID) ? '#eff6ff' : 'transparent' }}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selectedForCompare.includes(emp.EmployeeID)}
                                            onChange={() => toggleCompare(emp.EmployeeID)}
                                            style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                                        />
                                    </td>
                                    <td>
                                        <div style={{ fontWeight: 500 }}>{emp.Name}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {emp.EmployeeID}</div>
                                    </td>
                                    <td>{emp.Department}</td>
                                    <td>
                                        <RiskBadge label={emp.Risk.Label} />
                                    </td>
                                    <td>
                                        <ImpactBadge category={emp.Impact.category} />
                                    </td>
                                    <td>
                                        <div style={{ fontWeight: 600 }}>{emp.PriorityScore}</div>
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-outline"
                                            style={{ padding: '0.25rem 0.5rem' }}
                                            onClick={() => onSelectEmployee(emp.EmployeeID)}
                                        >
                                            Details <ArrowRight size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Floating Compare Button */}
            {selectedForCompare.length > 0 && (
                <div style={{
                    position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
                    background: '#0f172a', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '2rem',
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: '1rem',
                    zIndex: 40
                }}>
                    <span style={{ fontWeight: 600 }}>{selectedForCompare.length} Selected</span>
                    <button
                        disabled={selectedForCompare.length !== 2}
                        onClick={() => setShowCompare(true)}
                        className="btn btn-primary"
                        style={{ borderRadius: '1.5rem', opacity: selectedForCompare.length !== 2 ? 0.5 : 1 }}
                    >
                        Compare
                    </button>
                    {selectedForCompare.length !== 2 && <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Select 2 to compare</span>}
                    <button onClick={() => setSelectedForCompare([])} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                        <X size={16} />
                    </button>
                </div>
            )}

            {showCompare && (
                <ComparisonView
                    employees={getComparisonData()}
                    onClose={() => setShowCompare(false)}
                />
            )}
        </div>
    );
};

const RiskBadge = ({ label }) => {
    let colorClass = 'badge-slate';
    if (label === 'High Risk') colorClass = 'badge-red';
    if (label === 'Medium Risk') colorClass = 'badge-yellow';
    if (label === 'Low Risk') colorClass = 'badge-green';

    return <span className={`badge ${colorClass} `}>{label}</span>;
};

const ImpactBadge = ({ category }) => {
    return (
        <span style={{
            fontWeight: 500,
            color: category === 'Critical' ? 'var(--primary)' : 'var(--text-muted)'
        }}>
            {category}
        </span>
    );
};

export default EmployeeList;
