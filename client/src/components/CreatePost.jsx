//I create Posts Here
import React, { useState } from 'react';
import axios from 'axios';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState(null);
  const [mediumLink, setMediumLink] = useState('');

  //For submiting
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      setMessage('Title and content are required.');
      return;
    }
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('medium_link', mediumLink);
    if (image) formData.append('image', image);
    try {
      await axios.post('https://blog-awpc.onrender.com/api/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage('Post created successfully!');
      setTitle('');
      setContent('');
      setMediumLink('');
      setImage(null);
    } catch (error) {
      setMessage('Error creating post. Try again.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create a New Post</h1>
      {message && <p className="mb-4 text-red-500">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Title:</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>
        <div>
          <label className="block font-medium">Content:</label>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} required
            className="w-full p-2 border rounded-md h-32 focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>
        <div>
        <label className="block font-medium">Medium Article Link:</label>
        <input type="url" value={mediumLink} onChange={(e) => setMediumLink(e.target.value)}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />
      </div>
        <div>
          <label className="block font-medium">Image:</label>
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Submit</button>
      </form>
    </div>
  );
};

export default CreatePost;
