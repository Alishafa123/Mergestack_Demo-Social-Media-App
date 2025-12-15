import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import Navbar from '../../components/shared/navbar/Navbar';
import Button from '../../components/shared/buttons/Button';

export default function Dashboard() {
  const navigate = useNavigate();

  const handleCreatePost = () => {
    navigate('/create-post');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Create Post Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-lg">U</span>
            </div>
            <button
              onClick={handleCreatePost}
              className="flex-1 bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-3 text-left text-gray-500 transition-colors"
            >
              What's on your mind?
            </button>
            <Button
              onClick={handleCreatePost}
              variant="primary"
              size="md"
              className="flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Create Post</span>
            </Button>
          </div>
        </div>

        {/* Placeholder for posts feed */}
        <div className="text-center py-12">
          <h1 className="text-2xl font-semibold text-gray-700 mb-2">
            Your feed will appear here! 🚀
          </h1>
          <p className="text-gray-500 mb-6">
            Start by creating your first post
          </p>
          <Button
            onClick={handleCreatePost}
            variant="outline"
            size="lg"
            className="flex items-center space-x-2 mx-auto"
          >
            <Plus size={20} />
            <span>Create Your First Post</span>
          </Button>
        </div>
      </main>
    </div>
  );
}