import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Cookies from "js-cookie";
import { FaEye, FaEyeSlash,FaEnvelope, FaLock } from "react-icons/fa";
import "../styles/mix.css"

const Login = () => {
  const [email, setEmail] = useState(Cookies.get('rememberedEmail') || "");
  const [password, setPassword] = useState(Cookies.get('rememberedPassword') || "");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(!!Cookies.get('rememberedEmail'));
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

   useEffect(() => {
     if (!Cookies.get("token")) {
       navigate("/login");
    }
   }, [navigate]);

  const validation = ({ email, password }) => {
    const errors = {};
    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,6}$/;

    if (email === "") {
      errors.email = "Required*";
    } else if (!email_pattern.test(email)) {
      errors.email = "Please Enter Valid Email";
    }
    if (password === "") {
      errors.password = "Required*";
    } else if (password.length < 6) {
      errors.password = "Password Length should be Atleast 6 Characters";
    }
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validation({ email, password });
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      axios
        .post("http://localhost:5001/api/login", { email, password })
        .then((res) => {
          console.log(res.data);
          if (rememberMe) {
            // If "Remember Me" is checked, store in cookies
            Cookies.set('rememberedEmail', email, { expires: 7 }); // Expires in 7 days
            Cookies.set('rememberedPassword', password, { expires: 7 });
          } else {
            // If not checked, clear cookies
            Cookies.remove('rememberedEmail');
            Cookies.remove('rememberedPassword');
          }
          Cookies.set("token", res.data.token);
          toast.success(res.data.message);
          alert('Login Successful')
          navigate("/dashboard");
        })
        .catch((error) => {
          if (error.response && error.response.data) {
            toast.error(error.response.data.message);
          } else {   
            toast.error("Login failed");
          }
        });
    }
  };

  return (
    <div className="main">
    <div className="overlay">
      <div className="w-25 bg-white rounded p-3">
        <h2 className="text-center text-success">
          <strong>Login Here!</strong>
        </h2>
        <ToastContainer />
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>
              <strong>Email</strong>
            </label>
            <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    <FaEnvelope style={{blockSize: 30}} />
                  </span>
                </div>
            <input
              type="text"
              placeholder="Enter Your Email"
              autoComplete="off"
              name="email"
              className="form-control rounded-0"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            </div>
            {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
          </div>

          <div className="mb-3">
              <label>
                <strong>Password</strong>
              </label>
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    <FaLock style={{blockSize: 30}}/>
                  </span>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Your Password"
                  value={password}
                  name="password"
                  className="form-control rounded-0"
                  onChange={(e)=> setPassword(e.target.value)}
                />
                <div className="input-group-append">
                  <span
                    className="input-group-text"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ cursor: "pointer", blockSize: 44 }}  
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>
              {errors.password && (
                <p style={{ color: "red" }}>{errors.password}</p>
              )}
            </div>

          <div className="mb-3 form-check">
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              className="form-check-input"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="rememberMe" className="form-check-label">Remember Me</label>
          </div>

          <button
            type="submit"
            className="btn btn-warning text-white w-100 rounded"
          >
            Login
          </button>
        </form>

        <div className="text-end">
          <Link to="/forgot-password" className="w-10 bg-light">
            Forgot Password
          </Link>
        </div>

        <div className="d-flex justify-content-center">
          <p>New User?</p>
          <Link to="/" className="w-10 bg-light">
            Create Account
          </Link>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Login;
