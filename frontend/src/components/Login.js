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
  }, []);
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
    <div className="login-bg" style={{ minHeight: 'calc(100vh - 60px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="login">
        <h1>Login</h1>
        {errorMsg && (
          <div style={{ color: 'red', marginBottom: '10px', fontWeight: 500 }}>
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
        {/* Password input with show/hide toggle */}
        <div style={{ position: 'relative' }}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter Password"
            className="inputBox"
            name="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            style={{ paddingRight: 60 }}
          />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              style={{
                position: 'absolute',
                right: 18,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: '#5b86e5',
                cursor: 'pointer',
                fontSize: 22,
                padding: 0,
                display: 'flex',
                alignItems: 'center',
              }}
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
        </div>
        <button
          type="button"
          className="loginButton"
          onClick={handleLogin}
          disabled={!form.email.trim() || !form.password.trim()}
          style={{
            opacity: (!form.email.trim() || !form.password.trim()) ? 0.6 : 1,
            cursor: (!form.email.trim() || !form.password.trim()) ? 'not-allowed' : 'pointer',
          }}
        >
          Login
        </button>
        {/* Social sign-in footer */}
        <div style={{ marginTop: 32, textAlign: 'center', color: '#888' }}>
          <span>Or sign in with</span>
          <div style={{ marginTop: 12 }}>
            <a
              href="#"
              style={{ margin: '0 10px', color: '#4267B2', fontSize: 24 }}
              title="Facebook"
              onClick={e => { e.preventDefault(); alert('Single sign on will be implemented soon.'); }}
            >
              <i className="fab fa-facebook"></i> Facebook
            </a>
            <a
              href="#"
              style={{ margin: '0 10px', color: '#DB4437', fontSize: 24 }}
              title="Google"
              onClick={e => { e.preventDefault(); alert('Single sign on will be implemented soon.'); }}
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
