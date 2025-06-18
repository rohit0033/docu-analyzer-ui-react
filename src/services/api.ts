// API service for document analysis backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Define types for API responses
interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

// Define types for job data
interface JobResult {
  summary: string;
  topics: string[];
  sentiment: string;
}

interface Job {
  jobId: string;
  status: 'processing' | 'completed' | 'failed';
  createdAt?: number;
  fileName?: string;
  result?: JobResult;
  error?: string;
}

interface JobStatus {
  jobId: string;
  status: 'processing' | 'completed' | 'failed';
}

interface JobResultResponse {
  jobId: string;
  status: 'completed';
  summary: string;
  topics: string[];
  sentiment: string;
}

/**
 * Upload a file for analysis
 * @param file File to analyze
 * @returns Promise containing the job ID
 */
export const uploadFile = async (file: File): Promise<{ jobId: string }> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Upload failed');
  }
  
  const responseData = await response.json() as ApiResponse<{ jobId: string }>;
  
  if (!responseData.success || !responseData.data || !responseData.data.jobId) {
    throw new Error('Invalid response from server');
  }
  
  return { jobId: responseData.data.jobId };
};

/**
 * Check the status of an analysis job
 * @param jobId ID of the job to check
 * @returns Promise with the job status
 */
export const checkJobStatus = async (jobId: string): Promise<JobStatus> => {
  const response = await fetch(`${API_BASE_URL}/analyze/${jobId}/status`);
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Job not found');
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to check status');
  }
  
  const responseData = await response.json() as ApiResponse<JobStatus>;
  
  if (!responseData.success || !responseData.data) {
    throw new Error('Invalid response from server');
  }
  
  return responseData.data;
};

/**
 * Get the analysis results for a completed job
 * @param jobId ID of the completed job
 * @returns Promise with the analysis results
 */
export const getJobResults = async (jobId: string): Promise<JobResultResponse> => {
  const response = await fetch(`${API_BASE_URL}/analyze/${jobId}/result`);
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Results not found');
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to retrieve results');
  }
  
  const responseData = await response.json() as ApiResponse<JobResultResponse>;
  
  if (!responseData.success || !responseData.data) {
    throw new Error('Invalid response from server');
  }
  
  return responseData.data;
};