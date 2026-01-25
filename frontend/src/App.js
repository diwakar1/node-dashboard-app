import "./styles/App.css";
import Footer from "./shared/layout/Footer";
import Nav from "./shared/layout/Nav";
import { Routes, Route, useLocation } from "react-router-dom";
import SignUp from "./features/auth/SignUp";
import PrivateComponent from "./shared/common/PrivateComponent";
import Login from "./features/auth/Login";
import AddProduct from "./features/product/AddProduct";
import ProductList from "./features/product/ProductList";
import Update from "./features/product/Update";
import Profile from "./features/profile/Profile";

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const isSignUpPage = location.pathname === "/signup";
  return (
    <div className="App">
      <Nav />
      <Routes>
        <Route element={<PrivateComponent/>}>
          <Route path="/" element={<ProductList/>} />
          <Route path="/add" element={<AddProduct/>} />
          <Route path="/update/:id" element={<Update/>} />
          <Route path="/logout" element={<h1>logout Component</h1>} />
          <Route path="/profile" element={<Profile/>} />
        </Route>
        <Route path="/signup" element={<SignUp/>} />
        <Route path="/login" element ={<Login/>}/>
      </Routes>
      {!(isLoginPage || isSignUpPage) && <Footer />}
    </div>
  );
}

export default App;
