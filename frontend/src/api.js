import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api/v1', // FastAPI URL
});

export const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const getSummary = async () => {
    const response = await api.get('/dashboard/summary');
    return response.data;
};

export const getEmployees = async () => {
    const response = await api.get('/employees');
    return response.data;
};

export const getEmployeeDetail = async (id) => {
    const response = await api.get(`/employees/${id}`);
    return response.data;
};

export const sendChatMessage = async (message, history) => {
    const response = await api.post('/chat', { message, history });
    return response.data;
};

export const simulateRisk = async (employeeId, changes) => {
    const response = await api.post('/simulate', { employee_id: employeeId, changes });
    return response.data;
};
