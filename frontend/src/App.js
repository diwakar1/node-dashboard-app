import "./styles/App.css";
import { Nav } from "./shared/layout";
import AppRoutes from "./routes";

function App() {
  return (
    <div className="App">
      <Nav />
      <AppRoutes />
    </div>
  );
}

export default App;
