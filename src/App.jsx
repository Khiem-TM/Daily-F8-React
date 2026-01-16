import Nav from "./components/Nav";
import {Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Dashboard from "./pages/Users/Dashboard.jsx";
import "./App.css";
import MainLayout from "./layouts/MainLayout";
import UserLayout from "./layouts/UserLayout.jsx";
import AuthMiddleware from "./middleware/AuthMiddleware.jsx";
import Login from "./pages/Login.jsx";
import Sale from "./pages/Users/Sale.jsx";
import CreateOrder from "./pages/Users/CreateOrder.jsx";
import UserProducts from "./pages/Users/UserProducts.jsx";
import RoleMiddleware from "./middleware/RoleMiddleware.jsx";
export default function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:productId/:slug" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
        </Route>

        <Route element = {<AuthMiddleware />}>
          <Route element={<UserLayout />} path="/users">
            <Route index element={<Dashboard />} />
            <Route path="products" element={<UserProducts />} />
            <Route path="order/:productId" element={<CreateOrder />} />
            <Route element={<RoleMiddleware />}>
              <Route path="sales" element={<Sale />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </div>
  )
}