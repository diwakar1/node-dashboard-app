import "./App.css";
import Footer from "./components/Footer";
import Nav from "./components/Nav";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./components/SignUp";
import PrivateComponent from "./components/PrivateComponent";
import Login from "./components/Login"
import AddProduct from "./components/AddProduct";
import ProductList from "./components/ProductList";
import Update from "./components/Update";
import Profile from "./components/Profile"
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route element={<PrivateComponent />}>
            <Route path="/" element={<ProductList/>} />
            <Route path="/add" element={<AddProduct/>} />
            <Route path="/update/:id" element={<Update/>} />
            <Route path="/logout" element={<h1>logout Component</h1>} />
            <Route path="/profile" element={<Profile/>} />
          </Route>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element ={<Login/>}/>
        </Routes>
      </BrowserRouter>
      <Footer />
    </div>
  );
}

export default App;
