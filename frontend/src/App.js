import "./styles/App.css";
import { Footer, Nav } from "./shared/layout";
import { Routes, Route, useLocation } from "react-router-dom";
import { SignUp, Login } from "./features/auth";
import { PrivateComponent } from "./shared/common";
import { AddProduct, ProductList, Update } from "./features/product";
import { Profile } from "./features/profile";

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
