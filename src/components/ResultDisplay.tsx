import React from 'react';

interface ResultProps {
  result: {
    jobId: string;
    status: 'completed';
    summary: string;
    topics: string[];
    sentiment: string;
  };
}

const ResultDisplay: React.FC<ResultProps> = ({ result }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Document Analysis Results</h3>
        <p className="text-sm text-gray-500">Job ID: {result.jobId}</p>
      </div>
      
      <div>
        <h4 className="text-lg font-semibold text-gray-700 mb-2">Summary</h4>
        <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{result.summary}</p>
      </div>
      
      <div>
        <h4 className="text-lg font-semibold text-gray-700 mb-2">Key Topics</h4>
        <div className="flex flex-wrap gap-2">
          {result.topics.map((topic, index) => (
            <span 
              key={index}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
            >
              {topic}
            </span>
          ))}
        </div>
      </div>
      
      <div>
        <h4 className="text-lg font-semibold text-gray-700 mb-2">Document Sentiment</h4>
        <div className={`inline-block px-3 py-1 rounded-lg text-sm ${
          result.sentiment === 'Positive' ? 'bg-green-100 text-green-800' :
          result.sentiment === 'Negative' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {result.sentiment}
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;