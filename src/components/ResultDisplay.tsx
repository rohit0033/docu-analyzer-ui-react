
import React from 'react';
import { CheckCircle, XCircle, FileText, Brain, Heart } from 'lucide-react';

interface JobResult {
  summary: string;
  topics: string[];
  sentiment: string;
}

interface JobStatus {
  status: 'processing' | 'completed' | 'failed';
  result?: JobResult;
  error?: string;
}

interface ResultDisplayProps {
  status: JobStatus;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ status }) => {
  if (status.status === 'completed' && status.result) {
    const { summary, topics, sentiment } = status.result;
    
    const getSentimentColor = (sentiment: string) => {
      const lower = sentiment.toLowerCase();
      if (lower.includes('positive')) return 'text-green-600 bg-green-50';
      if (lower.includes('negative')) return 'text-red-600 bg-red-50';
      return 'text-yellow-600 bg-yellow-50';
    };

    const getSentimentIcon = (sentiment: string) => {
      const lower = sentiment.toLowerCase();
      if (lower.includes('positive')) return '😊';
      if (lower.includes('negative')) return '😔';
      return '😐';
    };

    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-6">
          <CheckCircle className="w-6 h-6 text-green-600" />
          <h3 className="text-xl font-bold text-green-800">Analysis Complete!</h3>
        </div>

        <div className="space-y-6">
          {/* Summary Section */}
          <div className="bg-white rounded-lg p-4 border border-green-200">
            <div className="flex items-center space-x-2 mb-3">
              <FileText className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold text-gray-900">📄 Summary</h4>
            </div>
            <p className="text-gray-700 leading-relaxed">{summary}</p>
          </div>

          {/* Topics Section */}
          <div className="bg-white rounded-lg p-4 border border-green-200">
            <div className="flex items-center space-x-2 mb-3">
              <Brain className="w-5 h-5 text-purple-600" />
              <h4 className="font-semibold text-gray-900">🧠 Topics</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {topics.map((topic, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>

          {/* Sentiment Section */}
          <div className="bg-white rounded-lg p-4 border border-green-200">
            <div className="flex items-center space-x-2 mb-3">
              <Heart className="w-5 h-5 text-pink-600" />
              <h4 className="font-semibold text-gray-900">😊 Sentiment</h4>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{getSentimentIcon(sentiment)}</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSentimentColor(sentiment)}`}>
                {sentiment}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status.status === 'failed') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <XCircle className="w-6 h-6 text-red-600" />
          <h3 className="text-xl font-bold text-red-800">Analysis Failed</h3>
        </div>
        <p className="text-red-700">
          {status.error || 'The document analysis failed due to an unexpected error.'}
        </p>
        <div className="mt-4 p-3 bg-red-100 rounded text-sm text-red-600">
          Please try uploading your document again or contact support if the issue persists.
        </div>
      </div>
    );
  }

  return null;
};

export default ResultDisplay;
