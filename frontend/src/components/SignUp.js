import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");
  


  const validateField = (fieldName, value) => {
    let message = "";
    if (!value.trim()) {
      message = `${
        fieldName[0].toUpperCase() + fieldName.slice(1)
      } is required`;
    } else {
      switch (fieldName) {
        case "name":
          if (value.length < 2) {
            message = "Name must be at least two characters";
          }
          break;
        case "email":
          if (!value.includes("@")) {
            message = "Invalid email address";
          }
          break;
        case "password":
          if (value.length < 8) {
            message = "Password should be at least 8 characters";
          }
          break;
        default:
          break;
      }
    }

    setErrors((prev) => ({ ...prev, [fieldName]: message }));
    return message === "";
  };

  const navigate = useNavigate();

  const collectData = async () => {
    const isNameValid = validateField("name", form.name);
    const isEmailValid = validateField("email", form.email);
    const isPasswordValid = validateField("password", form.password);

    if (isNameValid && isEmailValid && isPasswordValid) {
      let result = await fetch("http://localhost:5000/register", {
        method: "post",
        body: JSON.stringify(form),
        headers: {
          "Content-Type": "application/json",
        },
      });
      result = await result.json();
      setSuccessMsg("Sign up successful! Redirecting to login...");
      setTimeout(() => {
        setSuccessMsg("");
        navigate("/login");
      }, 1500);
    }
  };

  return (
    <div className="container">
      <div className="register">
        <h1>Sign Up</h1>
        {successMsg && <div className="success-message" style={{ color: 'green', marginBottom: '10px' }}>{successMsg}</div>}
        <input
          className="inputBox"
          type="text"
          placeholder="Enter Name"
          value={form.name}
          onChange={(e) => {
            setForm({ ...form, name: e.target.value });
            validateField("name", e.target.value);
          }}
        />
        {errors.name && <span className="error">{errors.name}</span>}
        <input
          className="inputBox"
          type="text"
          placeholder="Enter Email"
          value={form.email}
          onChange={(e) => {
            setForm({ ...form, email: e.target.value });
            validateField("email", e.target.value);
          }}
        />
        {errors.email && <span className="error">{errors.email}</span>}
        <input
          className="inputBox"
          type="password"
          placeholder="Enter Password"
          value={form.password}
          onChange={(e) => {
            setForm({ ...form, password: e.target.value });
            validateField("password", e.target.value);
          }}
        />
        {errors.password && <span className="error">{errors.password}</span>}
        <button className="appButton" type="button" onClick={collectData}>
          Sign Up
        </button>
      </div>
    </div>
  );
};
export default SignUp;
