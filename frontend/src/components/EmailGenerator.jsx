import React, { useState } from 'react';
import { sendChatMessage } from '../api';
import { Mail, Copy, Check } from 'lucide-react';

const EmailGenerator = ({ employee }) => {
    const [emailContent, setEmailContent] = useState(null);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const prompt = `Draft a professional, empathetic, and confidential retention email to an employee named ${employee.Name}. 
            Context: They are at ${employee.Risk.Label} risk of leaving. 
            Key concern factors: ${employee.KeyFactors.join(', ')}. 
            Their Department: ${employee.Department}.
            Goal: Schedule a 1:1 meeting to discuss their career growth and satisfaction. 
            Tone: Supportive, not accusatory. Do not mention "attrition score" directly.`;

            const res = await sendChatMessage(prompt, []); // No history needed for single shot
            setEmailContent(res.response);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        if (!emailContent) return;
        navigator.clipboard.writeText(emailContent);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div style={{ background: 'white', borderRadius: '0.5rem', border: '1px solid #e2e8f0', padding: '1.5rem' }}>
            {!emailContent ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Generate Retention Email</div>
                        <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Use AI to draft a personalized meeting request based on risk factors.</div>
                    </div>
                    <button
                        onClick={handleGenerate}
                        disabled={loading}
                        className="btn btn-primary"
                    >
                        {loading ? 'Drafting...' : 'Draft Email'} <Mail size={16} style={{ marginLeft: '8px' }} />
                    </button>
                </div>
            ) : (
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #f1f5f9' }}>
                        <div style={{ fontWeight: 600, color: '#1e293b' }}>Draft Logic</div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button onClick={handleGenerate} className="btn btn-outline" style={{ fontSize: '0.8rem' }}>Regenerate</button>
                            <button onClick={handleCopy} className="btn btn-primary" style={{ fontSize: '0.8rem' }}>
                                {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy'}
                            </button>
                        </div>
                    </div>
                    <div style={{
                        whiteSpace: 'pre-wrap',
                        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                        fontSize: '0.9rem',
                        color: '#334155',
                        background: '#f8fafc',
                        padding: '1rem',
                        borderRadius: '0.5rem'
                    }}>
                        {emailContent}
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmailGenerator;
