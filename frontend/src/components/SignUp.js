import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!email.includes("@")) {
      newErrors.email = "Invalid email address";
    }
    if (name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }
    if (password.length < 8) {
      newErrors.password = "Password should be at least 8 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
    /*  if(!validateForm()){
      return;
    } */
    const isNameValid = validateField("name", name);
    const isEmailValid = validateField("email", email);
    const isPasswordValid = validateField("password", password);

    if (isNameValid && isEmailValid && isPasswordValid) {
      let result = await fetch("http://localhost:5000/register", {
        method: "post",
        body: JSON.stringify({ name, email, password }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      result = await result.json();
      navigate("/login");
    }
  };

  return (
    <div className="container">
      <div className="register">
        <h1>Sign Up</h1>
        <input
          className="inputBox"
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            validateField("name", e.target.value);
          }}
        />
        {errors.name && <span className="error">{errors.name}</span>}
        <input
          className="inputBox"
          type="text"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            validateField("email", e.target.value);
          }}
        />
        {errors.email && <span className="error">{errors.email}</span>}
        <input
          className="inputBox"
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
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
