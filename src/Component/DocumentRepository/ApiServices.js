import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://empolyee-backedn.onrender.com/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds for file uploads
});

// Add request interceptor for authentication (if needed)
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const documentService = {
  // Upload document
  uploadDocument: async (file, userId, userName) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('uploadedBy', userId);
    formData.append('uploadedByName', userName);
    
    return apiClient.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Get user documents
  getUserDocuments: async (userId) => {
    return apiClient.get(`/documents/user/${userId}`);
  },

  // Get all documents (admin)
  getAllDocuments: async () => {
    return apiClient.get('/documents');
  },

  // Delete document
  deleteDocument: async (documentId) => {
    return apiClient.delete(`/documents/${documentId}`);
  },

  // Get file URL for viewing
  getFileViewUrl: (documentId) => {
    return `${API_BASE_URL}/documents/file/${documentId}`;
  },

  // Get file URL for downloading
  getFileDownloadUrl: (documentId) => {
    return `${API_BASE_URL}/documents/download/${documentId}`;
  },
};

export default documentService;