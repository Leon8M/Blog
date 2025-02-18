//And here is the simpleold navbar
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaMedium, FaUserShield } from "react-icons/fa";

//Checking if the user is Admin to allow Admin panel to appear
const Navbar = () => {
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem("isAdmin") === "true");

  useEffect(() => {
    const checkAdminStatus = () => {
      setIsAdmin(localStorage.getItem('isAdmin') === 'true');
    };
  
    window.addEventListener('storage', checkAdminStatus);
  
    return () => {
      window.removeEventListener('storage', checkAdminStatus);
    };
  }, []);
  

  return (
    <nav className="bg-white border-b border-gray-200 py-4 shadow-sm">
      <div className="container mx-auto flex justify-between items-center px-6">
        <Link to="/" className="text-2xl font-bold text-black tracking-wide">The Nex Journal</Link>
        <ul className="flex space-x-6 text-gray-700 text-lg">
          <li>
            <Link to="https://medium.com/@Leonmunene" className="flex items-center space-x-1 hover:text-black transition">
              <FaMedium />
              <span>Medium</span>
            </Link>
          </li>
          {isAdmin && (
            <li>
              <Link to="/admin" className="flex items-center space-x-1 hover:text-black transition">
                <FaUserShield />
                <span>Admin Panel</span>
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
