import Nav from "./components/Nav";
import {Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import BestSellerProduct from "./pages/BestSellerProduct";

export default function App() {
  return (
    <>
      <Nav />
      <hr />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/products" >
          <Route index element={<Products />} />
          <Route path=":id/:slug" element={<ProductDetail />} />
          <Route path="best-seller" element={<BestSellerProduct />} />
        </Route>
      </Routes>
    </>
  )
}