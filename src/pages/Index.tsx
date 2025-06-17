
import React from 'react';
import Layout from '../components/Layout';
import FileUploadForm from '../components/FileUploadForm';
import JobStatusChecker from '../components/JobStatusChecker';

const Index = () => {
  return (
    <Layout>
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Document Analyzer
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload your text documents for intelligent analysis including summaries, 
            topic extraction, and sentiment analysis.
          </p>
        </div>
        
        <FileUploadForm />
        <JobStatusChecker />
      </div>
    </Layout>
  );
};

export default Index;
