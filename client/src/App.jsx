import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Post from './components/Post';
import CreatePost from './components/CreatePost';
import Navbar from './components/Navbar';
import AdminPanel from './components/AdminPanel';


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/post/:id" element={<Post />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/admin" element={<AdminPanel />} /> {/* Admin panel route */}
      </Routes>
    </Router>
  );
}

export default App;
