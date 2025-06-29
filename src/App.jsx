import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import TaskManager from './components/TaskManager';
import Card from './components/Card';
import Button from './components/Button';

// API Integration Component
const ApiDataDisplay = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://jsonplaceholder.typicode.com/posts');
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      const data = await response.json();
      setPosts(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter posts based on search term
  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.body.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  if (loading) {
    return (
      <Card title="API Data" className="mt-8">
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600 dark:text-gray-400">Loading posts...</span>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card title="API Data" className="mt-8">
        <div className="text-center py-8">
          <p className="text-red-600 dark:text-red-400 mb-4">Error: {error}</p>
          <Button onClick={fetchPosts} variant="primary">
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card title="API Data" className="mt-8">
      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
        />
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {currentPosts.map((post) => (
          <div
            key={post.id}
            className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-700 transition-colors"
          >
            <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-gray-100">
              {post.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {post.body.length > 150 ? `${post.body.substring(0, 150)}...` : post.body}
            </p>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-500">
              Post ID: {post.id}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-6">
          <Button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            variant="secondary"
            size="sm"
          >
            Previous
          </Button>
          <span className="text-gray-600 dark:text-gray-400">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            variant="secondary"
            size="sm"
          >
            Next
          </Button>
        </div>
      )}

      {/* Results count */}
      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
        Showing {currentPosts.length} of {filteredPosts.length} posts
        {searchTerm && ` matching "${searchTerm}"`}
      </div>
    </Card>
  );
};

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col">
        <Navbar />
        
        <main className="flex-grow max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <TaskManager />
          <ApiDataDisplay />
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App; 