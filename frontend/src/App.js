import "./App.css";
import Footer from "./components/Footer";
import Nav from "./components/Nav";
import { Routes, Route, useLocation } from "react-router-dom";
import SignUp from "./components/SignUp";
import PrivateComponent from "./components/PrivateComponent";
import Login from "./components/Login"
import AddProduct from "./pages/AddProduct";
import ProductList from "./pages/ProductList";
import Update from "./pages/Update";
import Profile from "./pages/Profile"

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
