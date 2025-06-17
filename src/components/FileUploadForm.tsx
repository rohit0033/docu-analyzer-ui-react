
import React, { useState, useRef } from 'react';
import { uploadFile } from '../services/api';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';

const FileUploadForm: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (selectedFile: File): boolean => {
    if (!selectedFile.name.endsWith('.txt')) {
      setError('Please select a .txt file');
      return false;
    }
    if (selectedFile.size > 1024 * 1024) { // 1MB limit
      setError('File size must be less than 1MB');
      return false;
    }
    return true;
  };

  const handleFileSelect = (selectedFile: File) => {
    setError(null);
    setJobId(null);
    
    if (validateFile(selectedFile)) {
      setFile(selectedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const response = await uploadFile(file);
      setJobId(response.jobId);
      console.log('File uploaded successfully, jobId:', response.jobId);
    } catch (err) {
      setError('Failed to upload file. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setJobId(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload Document</h2>
      
      {!jobId ? (
        <div className="space-y-4">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver
                ? 'border-blue-400 bg-blue-50'
                : file
                ? 'border-green-300 bg-green-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center space-y-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                file ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                {file ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <Upload className="w-6 h-6 text-gray-400" />
                )}
              </div>
              
              {file ? (
                <div>
                  <p className="text-sm font-medium text-green-700">{file.name}</p>
                  <p className="text-xs text-green-600">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-lg font-medium text-gray-700">
                    Drop your .txt file here, or click to browse
                  </p>
                  <p className="text-sm text-gray-500">Maximum file size: 1MB</p>
                </div>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt"
                onChange={handleFileChange}
                className="hidden"
              />
              
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
              >
                Choose File
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <div className="flex justify-center">
            <button
              onClick={handleUpload}
              disabled={!file || isUploading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
            >
              {isUploading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Uploading...</span>
                </div>
              ) : (
                'Upload & Analyze'
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2 text-green-600 bg-green-50 p-4 rounded-lg">
            <CheckCircle className="w-6 h-6" />
            <span className="font-medium">File uploaded successfully!</span>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Your Job ID:</p>
            <div className="flex items-center justify-center space-x-2">
              <code className="text-lg font-mono bg-white px-3 py-2 border rounded">
                {jobId}
              </code>
              <button
                onClick={() => navigator.clipboard.writeText(jobId)}
                className="px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors text-sm"
              >
                Copy
              </button>
            </div>
          </div>
          
          <button
            onClick={resetForm}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
          >
            Upload Another File
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUploadForm;
