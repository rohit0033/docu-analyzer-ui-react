import React, { useState, useEffect } from 'react';
import { checkJobStatus, getJobResults } from '../services/api';
import ResultDisplay from './ResultDisplay';
import { Search, Clock } from 'lucide-react';

interface JobStatus {
  jobId: string;
  status: 'processing' | 'completed' | 'failed';
}

interface JobResult {
  jobId: string;
  status: 'completed';
  summary: string;
  topics: string[];
  sentiment: string;
}

const JobStatusChecker: React.FC = () => {
  const [jobId, setJobId] = useState('');
  const [jobStatus, setJobStatus] = useState<JobStatus | null>(null);
  const [jobResult, setJobResult] = useState<JobResult | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);

  const startPolling = (id: string) => {
    console.log('Starting polling for jobId:', id);
    const interval = setInterval(async () => {
      try {
        const status = await checkJobStatus(id);
        console.log('Polling result:', status);
        setJobStatus(status);
        
        if (status.status === 'completed') {
          try {
            const results = await getJobResults(id);
            setJobResult(results);
          } catch (resultErr) {
            console.error('Failed to get results:', resultErr);
            setError('Job is completed but failed to retrieve results');
          }
          stopPolling();
        } else if (status.status === 'failed') {
          stopPolling();
        }
      } catch (err) {
        console.error('Polling error:', err);
        setError('Failed to check job status');
        stopPolling();
      }
    }, 3000);
    
    setPollingInterval(interval);
  };

  const stopPolling = () => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      setPollingInterval(null);
    }
    setIsChecking(false);
  };

  const handleCheckStatus = async () => {
    if (!jobId.trim()) {
      setError('Please enter a job ID');
      return;
    }

    if (jobId.length < 3) {
      setError('Job ID must be at least 3 characters');
      return;
    }

    setError(null);
    setIsChecking(true);
    setJobStatus(null);
    setJobResult(null);

    try {
      const status = await checkJobStatus(jobId);
      console.log('Initial status check:', status);
      setJobStatus(status);
      
      if (status.status === 'processing') {
        startPolling(jobId);
      } else if (status.status === 'completed') {
        try {
          const results = await getJobResults(jobId);
          setJobResult(results);
        } catch (resultErr) {
          console.error('Failed to get results:', resultErr);
          setError('Job is completed but failed to retrieve results');
        }
        setIsChecking(false);
      } else {
        setIsChecking(false);
      }
    } catch (err) {
      setError('Job not found or failed to check status');
      setIsChecking(false);
      console.error('Status check error:', err);
    }
  };

  const handleReset = () => {
    stopPolling();
    setJobId('');
    setJobStatus(null);
    setJobResult(null);
    setError(null);
  };

  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Check Job Status</h2>
      
      <div className="space-y-4">
        <div className="flex space-x-2">
          <div className="flex-1">
            <input
              type="text"
              value={jobId}
              onChange={(e) => setJobId(e.target.value)}
              placeholder="Enter your Job ID"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isChecking}
            />
          </div>
          <button
            onClick={handleCheckStatus}
            disabled={isChecking}
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-700 font-medium rounded-lg transition-colors flex items-center space-x-2"
          >
            <Search className="w-5 h-5" />
            <span>Check Status</span>
          </button>
        </div>

        {error && (
          <div className="text-red-600 bg-red-50 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {isChecking && !jobStatus && (
          <div className="flex items-center justify-center space-x-2 text-blue-600 bg-blue-50 p-4 rounded-lg">
            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span>Checking job status...</span>
          </div>
        )}

        {jobStatus && (
          <div className="space-y-4">
            {jobStatus.status === 'processing' && isChecking && (
              <div className="flex items-center justify-center space-x-2 text-blue-600 bg-blue-50 p-4 rounded-lg">
                <Clock className="w-5 h-5" />
                <span>Document is being processed... Checking every 3 seconds</span>
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            
            {jobResult && <ResultDisplay result={jobResult} />}
            
            {jobStatus.status === 'failed' && (
              <div className="text-red-600 bg-red-50 p-4 rounded-lg">
                Analysis failed. Please try uploading your document again.
              </div>
            )}
            
            {(jobStatus.status === 'completed' || jobStatus.status === 'failed') && (
              <div className="flex justify-center">
                <button
                  onClick={handleReset}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  Check Another Job
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobStatusChecker;