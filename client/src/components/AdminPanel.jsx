//Here lies the Admin Panel
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminPanel = () => {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (authenticated) {
      fetchPosts();
    }
  }, [authenticated]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get("https://blog-awpc.onrender.com/api/posts");
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post("https://blog-awpc.onrender.com/api/admin/authenticate", {
        password,
      });

      if (response.data.authenticated) {
        localStorage.setItem("isAdmin", "true"); // ✅ I am trying to Save into localStorage
        setAuthenticated(true);
        window.dispatchEvent(new Event("storage")); // ✅ Notify other components about the change
      } else {
        alert("Incorrect password");
      }
    } catch (error) {
      console.error("Error during authentication:", error);
      alert("Error connecting to the server.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://blog-awpc.onrender.com/api/posts/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      fetchPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleUpdate = async () => {
    if (!selectedPost) return;

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      if (image) {
        formData.append("image", image);
      }

      await axios.put(`https://blog-awpc.onrender.com/api/posts/${selectedPost.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSelectedPost(null);
      setImage(null);
      fetchPosts();
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  if (!authenticated) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Admin Panel Login</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="Enter password"
          />
          <button onClick={handleLogin} className="bg-black text-white px-4 py-2 mt-2 rounded-md w-full">
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>

      <button onClick={() => navigate("/create")} className="bg-black text-white px-4 py-2 rounded-md mb-4">
        Create New Post
      </button>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post) => (
          <div key={post.id} className="border p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
            <p className="text-gray-700">{post.content.substring(0, 100)}...</p>
            <button
              onClick={() => handleDelete(post.id)}
              className="bg-red-600 text-white px-4 py-2 mt-2 rounded-md"
            >
              Delete
            </button>
            <button
              onClick={() => {
                setSelectedPost(post);
                setTitle(post.title);
                setContent(post.content);
              }}
              className="bg-blue-500 text-white px-4 py-2 mt-2 ml-2 rounded-md"
            >
              Edit
            </button>
          </div>
        ))}
      </div>

      {selectedPost && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit Post</h2>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded-md mb-2"
              placeholder="Title"
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2 border rounded-md mb-2"
              placeholder="Content"
            />
            <input
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full mb-2"
            />
            <div className="flex justify-end">
              <button onClick={() => setSelectedPost(null)} className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2">
                Cancel
              </button>
              <button onClick={handleUpdate} className="bg-green-500 text-white px-4 py-2 rounded-md">
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
