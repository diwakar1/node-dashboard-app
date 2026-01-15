import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const auth = localStorage.getItem("user");
    if (auth) {
      navigate("/");
    }
  }, []);
  const handleLogin = async () => {
    console.log(email, +" " + password);
    let result = await fetch("http://localhost:5000/login", {
      method: "post",
      body: JSON.stringify({ email, password }),
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
      console.log("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="login-bg" style={{ minHeight: 'calc(100vh - 60px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="login">
        <h1>Login</h1>
        <input
          type="text"
          placeholder="Enter Email"
          className="inputBox"
          name="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter Password"
          className="inputBox"
          name="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="button" className="loginButton" onClick={handleLogin}>
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
