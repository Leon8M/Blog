import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminPanel = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/posts');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleEdit = (post) => {
    setSelectedPost(post);
    setTitle(post.title);
    setContent(post.content);
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      if (image) {
        formData.append('image', image);
      }

      await axios.put(`http://127.0.0.1:5000/api/posts/${selectedPost.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSelectedPost(null);
      setImage(null);
      fetchPosts();
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/api/posts/${id}`);
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post) => (
          <div key={post.id} className="border p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
            <p className="text-gray-700">{post.content.substring(0, 100)}...</p>
            <div className="mt-2 flex space-x-2">
              <button onClick={() => handleEdit(post)} className="bg-blue-600 text-white px-4 py-2 rounded-md">Edit</button>
              <button onClick={() => handleDelete(post.id)} className="bg-red-600 text-white px-4 py-2 rounded-md">Delete</button>
            </div>
          </div>
        ))}
      </div>
      {selectedPost && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
            <h2 className="text-xl font-bold mb-4">Edit Post</h2>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded-md" />
            <textarea value={content} onChange={(e) => setContent(e.target.value)} className="w-full p-2 border rounded-md mt-2 h-32" />
            <input type="file" onChange={(e) => setImage(e.target.files[0])} className="mt-2" />
            <div className="mt-4 flex space-x-2">
              <button onClick={handleUpdate} className="bg-green-600 text-white px-4 py-2 rounded-md">Save</button>
              <button onClick={() => setSelectedPost(null)} className="bg-gray-600 text-white px-4 py-2 rounded-md">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
