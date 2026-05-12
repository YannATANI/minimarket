import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Blog from "./pages/Blog";
import Article from "./pages/Article";
import Contact from "./pages/Contact";
import Login from "./auth/Login";
import Register from "./auth/Signin";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminBlog from "./pages/admin/Adminblog"; "./pages/admin/AdminBlog"
import "./index.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/"         element={<Home />} />
          <Route path="/shop"     element={<Shop />} />
          <Route path="/blog"     element={<Blog />} />
          <Route path="/blog/:id" element={<Article />} />
          <Route path="/contact"  element={<Contact />} />
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/products" element={<ProtectedRoute adminOnly><AdminProducts /></ProtectedRoute>} />
          <Route path="/admin/blog"     element={<ProtectedRoute adminOnly><AdminBlog /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
export default App;