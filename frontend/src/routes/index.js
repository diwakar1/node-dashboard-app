import { Routes, Route } from "react-router-dom";
import { SignUp, Login } from "../features/auth";
import { PrivateComponent } from "../shared/common";
import { AddProduct, ProductList, Update } from "../features/product";
import { Profile } from "../features/profile";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PrivateComponent />}>
        <Route path="/" element={<ProductList />} />
        <Route path="/add" element={<AddProduct />} />
        <Route path="/update/:id" element={<Update />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}
