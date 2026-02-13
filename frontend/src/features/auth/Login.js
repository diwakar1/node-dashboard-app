import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { useForm } from "../../hooks/useForm";
import { VALIDATION_RULES } from "../../constants/config";
import { AUTH_ERRORS } from "../../constants/errorMessages";

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const { values, errors, handleChange, validate, setFieldError } = useForm({
    initialValues: { email: "", password: "" },
    validationRules: {
      email: { 
        required: true, 
        pattern: VALIDATION_RULES.EMAIL_PATTERN,
        message: AUTH_ERRORS.INVALID_EMAIL 
      },
      password: { 
        required: true, 
        minLength: VALIDATION_RULES.PASSWORD_MIN_LENGTH,
        message: AUTH_ERRORS.INVALID_PASSWORD 
      },
    }
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async () => {
    if (!validate()) {
      return;
    }
    
    const result = await login(values.email, values.password);
    if (!result.success) {
      setFieldError("server", result.error);
    } else {
      // Navigate to role-specific page
      navigate(result.redirectPath || "/");
    }
  };

  return (
    <div className="login-bg">
      <div className="login">
        <h1>Login</h1>
        {errors.server && (
          <div className="error-message">
            {errors.server}
          </div>
        )}
        <input
          type="text"
          placeholder="Enter Email"
          className="inputBox"
          name="email"
          value={values.email}
          onChange={handleChange}
        />
        {errors.email && <span className="error">{errors.email}</span>}
        <div style={{ position: 'relative', width: '100%' }}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter Password"
            className="inputBox"
            name="password"
            value={values.password}
            onChange={handleChange}
            style={{ paddingRight: '50px' }}
          />
          {errors.password && <span className="error">{errors.password}</span>}
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            style={{
              position: 'absolute',
              right: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              color: '#5b86e5',
              cursor: 'pointer',
              fontSize: '22px',
              padding: '0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
            }}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        <button
          type="button"
          className="loginButton"
          onClick={handleLogin}
        >
          Login
        </button>
        <div style={{ marginTop: '32px', textAlign: 'center', color: '#888' }}>
          <span>Or sign in with</span>
          <div style={{ marginTop: '12px' }}>
            <a
              href="#"
              title="Facebook"
              onClick={e => { e.preventDefault(); alert('Single sign on will be implemented soon.'); }}
              style={{ margin: '0 10px', color: '#4267B2', fontSize: '24px', textDecoration: 'none' }}
            >
              <i className="fab fa-facebook"></i> Facebook
            </a>
            <a
              href="#"
              title="Google"
              onClick={e => { e.preventDefault(); alert('Single sign on will be implemented soon.'); }}
              style={{ margin: '0 10px', color: '#DB4437', fontSize: '24px', textDecoration: 'none' }}
            >
              <i className="fab fa-google"></i> Google
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
