import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('https://blog-awpc.onrender.com/api/posts');
        setPosts(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) return <div className="text-center text-gray-500 mt-6 flex flex-col">Loading posts...<span className='text-gray-300'>May take a while because back-end hosted on render on a free plan</span></div>;
  if (error) return <div className="text-center text-red-500 mt-6">Error: {error}</div>;

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6 text-black">Latest Posts</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map(post => (
          <div key={post.id} className="border border-gray-200 p-4 rounded-lg shadow-sm transition hover:shadow-md bg-white">
            {post.image_url && (
              <img src={post.image_url} alt="Post preview" className="w-full h-48 object-cover rounded-md mb-3" />
            )}
            <h2 className="text-xl font-semibold text-black">
              <Link to={`/post/${post.id}`} className="hover:underline">{post.title}</Link>
            </h2>
            <p className="text-gray-600 text-sm mt-1">Published on {new Date(post.date_posted).toLocaleDateString()}</p>
            <p className="text-gray-700 mt-3">{post.content.substring(0, 100)}...</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
