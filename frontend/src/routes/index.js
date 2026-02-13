import { Routes, Route, Navigate } from "react-router-dom";
import { SignUp, Login } from "../features/auth";
import { PrivateComponent } from "../shared/common";
import { AddProduct, ProductList, Update } from "../features/product";
import { Profile } from "../features/profile";
import { Dashboard } from "../features/dashboard";
import { OrderList, OrderDetails } from "../features/order";
import { Checkout } from "../features/checkout";
import { Cart } from "../features/cart";
import { Home } from "../features/home";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PrivateComponent />}>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/add" element={<AddProduct />} />
        <Route path="/update/:id" element={<Update />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<OrderList />} />
        <Route path="/orders/:id" element={<OrderDetails />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}
