import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminPanel = () => {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [posts, setPosts] = useState([]);

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
        password
      });
  
      console.log("API Response:", response.data); // 🔍 Debugging
  
      if (response.data.authenticated) {
        localStorage.setItem("isAdmin", "true");  // ✅ Store in localStorage
        console.log("isAdmin set to:", localStorage.getItem("isAdmin")); // 🔍 Debugging
        setAuthenticated(true);
        window.location.reload();  // ✅ Reload to update Navbar
      } else {
        alert("Incorrect password");
      }
    } catch (error) {
      console.error("Error during authentication:", error);
      alert("Error connecting to the server.");
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

      <button
        onClick={() => navigate("/create")}
        className="bg-black text-white px-4 py-2 rounded-md mb-4"
      >
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;
