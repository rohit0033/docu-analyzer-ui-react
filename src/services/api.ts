
// Mock API service - replace with actual backend endpoints
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data for demo purposes
const mockJobs = new Map<string, any>();

export const uploadFile = async (file: File): Promise<{ jobId: string }> => {
  console.log('Uploading file:', file.name);
  await delay(1000); // Simulate upload time
  
  // Generate a random job ID
  const jobId = `job_${Math.random().toString(36).substr(2, 9)}`;
  
  // Store mock job data
  mockJobs.set(jobId, {
    status: 'processing',
    createdAt: Date.now(),
    fileName: file.name
  });
  
  // Simulate processing completion after 10 seconds
  setTimeout(() => {
    mockJobs.set(jobId, {
      status: 'completed',
      result: {
        summary: `This document "${file.name}" discusses various technological concepts and innovations. The analysis reveals comprehensive coverage of modern development practices, emerging technologies, and their practical applications in today's digital landscape.`,
        topics: [
          'Technology',
          'Innovation',
          'Digital Transformation',
          'Software Development',
          'AI & Machine Learning',
          'Web Development'
        ],
        sentiment: 'Positive'
      }
    });
  }, 10000);
  
  return { jobId };
  
  // Real API call would look like this:
  /*
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    throw new Error('Upload failed');
  }
  
  return response.json();
  */
};

export const checkJobStatus = async (jobId: string): Promise<{
  status: 'processing' | 'completed' | 'failed';
  result?: {
    summary: string;
    topics: string[];
    sentiment: string;
  };
  error?: string;
}> => {
  console.log('Checking status for jobId:', jobId);
  await delay(500); // Simulate API call
  
  // Check mock data
  const job = mockJobs.get(jobId);
  
  if (!job) {
    throw new Error('Job not found');
  }
  
  return job;
  
  // Real API call would look like this:
  /*
  const response = await fetch(`${API_BASE_URL}/analyze/${jobId}/status`);
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Job not found');
    }
    throw new Error('Failed to check status');
  }
  
  return response.json();
  */
};
