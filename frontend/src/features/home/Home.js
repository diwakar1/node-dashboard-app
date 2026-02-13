import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Home = () => {
  const { isAdmin } = useAuth();
  
  // Redirect admin to dashboard, users to products
  return <Navigate to={isAdmin() ? '/dashboard' : '/products'} replace />;
};

export default Home;
