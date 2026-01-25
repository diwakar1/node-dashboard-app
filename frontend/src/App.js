import "./styles/App.css";
import { Footer, Nav } from "./shared/layout";
import { useLocation } from "react-router-dom";
import AppRoutes from "./routes";

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const isSignUpPage = location.pathname === "/signup";
  
  return (
    <div className="App">
      <Nav />
      <AppRoutes />
      {!(isLoginPage || isSignUpPage) && <Footer />}
    </div>
  );
}

export default App;
