import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Post = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`https://blog-awpc.onrender.com/api/posts/${id}`);
        setPost(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) return <div className="text-center text-gray-500 mt-6">Loading post...</div>;
  if (error) return <div className="text-center text-red-500 mt-6">Error: {error}</div>;
  if (!post) return <div className="text-center text-gray-500 mt-6">Post not found.</div>;

  return (
    <div className="container mx-auto max-w-3xl py-8">
      <h1 className="text-4xl font-bold text-black mb-2">{post.title}</h1>
      <p className="text-gray-500 text-sm mb-4">Published on {new Date(post.date_posted).toLocaleDateString()}</p>

      {/* Medium Link Button */}
      {post.medium_link && (
        <a
          href={post.medium_link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-black text-white px-4 py-2 rounded-md hover:bg-gray-900 transition mb-4"
        >
          Read on Medium
        </a>
      )}

      {/* Image if exists */}
      {post.image_url && (
        <img src={post.image_url} alt="Post cover" className="w-full max-h-96 object-cover rounded-md mb-4" />
      )}

      {/* Content */}
      <div className="text-gray-700 leading-relaxed space-y-4 text-lg">
        {post.content.split(/\n+/).map((paragraph, index) => (
          <p key={index} className="tracking-wide">{paragraph.trim()}</p>
        ))}
      </div>
    </div>
  );
};

export default Post;
