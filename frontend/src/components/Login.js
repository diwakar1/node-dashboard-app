import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = localStorage.getItem("user");
    if (auth) {
      navigate("/");
    }
  }, [navigate]);

  const handleLogin = async () => {
    if (!form.email.trim() || !form.password.trim()) {
      setErrorMsg("Email and password should not be empty.");
      return;
    } else {
      setErrorMsg("");
    }
    let result = await fetch("http://localhost:5000/login", {
      method: "post",
      body: JSON.stringify(form),
      headers: {
        "Content-Type": "application/json",
      },
    });
    result = await result.json();
    if (result.auth) {
      localStorage.setItem("user", JSON.stringify(result.user));
      localStorage.setItem("token", JSON.stringify(result.auth));
      navigate("/");
    } else {
      setErrorMsg("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="login-bg">
      <div className="login">
        <h1>Login</h1>
        {errorMsg && (
          <div className="error-message">
            {errorMsg}
          </div>
        )}
        <input
          type="text"
          placeholder="Enter Email"
          className="inputBox"
          name="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <div style={{ position: 'relative', width: '100%' }}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter Password"
            className="inputBox"
            name="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            style={{ paddingRight: '50px' }}
          />
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
          disabled={!form.email.trim() || !form.password.trim()}
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
