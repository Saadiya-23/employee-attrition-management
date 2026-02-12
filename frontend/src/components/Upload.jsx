import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { uploadFile } from '../api';

const Upload = ({ onUploadSuccess }) => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    const onDrop = useCallback(async (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (!file) return;

        setUploading(true);
        setError(null);

        try {
            const result = await uploadFile(file);
            onUploadSuccess(result);
        } catch (err) {
            console.error(err);
            const backendMsg = err.response?.data?.detail;
            setError(backendMsg || "Failed to upload file. Please check the format.");
        } finally {
            setUploading(false);
        }
    }, [onUploadSuccess]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'text/csv': ['.csv'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'application/vnd.ms-excel': ['.xls'],
            'application/pdf': ['.pdf']
        },
        maxFiles: 1
    });

    return (
        <div className="card" style={{ padding: '3rem', maxWidth: '600px', margin: '0 0' }}>
            <div
                {...getRootProps()}
                style={{
                    border: '2px dashed #cbd5e1',
                    borderRadius: '0.75rem',
                    padding: '4rem 2rem',
                    textAlign: 'center',
                    cursor: uploading ? 'wait' : 'pointer',
                    background: isDragActive ? '#f1f5f9' : '#f8fafc',
                    transition: 'all 0.2s'
                }}
            >
                <input {...getInputProps()} disabled={uploading} />

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ width: '64px', height: '64px', background: '#dbeafe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {uploading ? (
                            <div style={{ animation: 'spin 1s linear infinite' }}>
                                <UploadCloud size={32} color="#2563eb" />
                            </div>
                        ) : (
                            <UploadCloud size={32} color="#2563eb" />
                        )}
                    </div>

                    <div>
                        {uploading ? (
                            <p style={{ fontWeight: 500 }}>Analyzing Workforce Data...</p>
                        ) : isDragActive ? (
                            <p style={{ color: '#2563eb', fontWeight: 600 }}>Drop the file here...</p>
                        ) : (
                            <div>
                                <p style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.5rem' }}>Click to upload or drag and drop</p>
                                <p style={{ fontSize: '0.9rem', color: '#64748b' }}>CSV or Excel (XLSX). PDF supported with warnings.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {error && (
                <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#fee2e2', border: '1px solid #fca5a5', color: '#991b1b', borderRadius: '0.5rem', display: 'flex', alignItems: 'start', gap: '0.75rem' }}>
                    <AlertCircle size={20} style={{ marginTop: '2px' }} />
                    <div>
                        <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Upload Failed</div>
                        <div style={{ fontSize: '0.9rem' }}>{error}</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Upload;
