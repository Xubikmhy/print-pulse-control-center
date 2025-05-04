
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-app-gray-50 dark:bg-app-gray-900 p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-app-blue">404</h1>
        <h2 className="mt-4 text-2xl font-bold text-app-gray-900 dark:text-white">Page Not Found</h2>
        <p className="mt-2 text-app-gray-600 dark:text-app-gray-400">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-app-blue hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-app-blue"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
