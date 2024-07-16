import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { FaEye, FaEyeSlash, FaCheckCircle, FaUser, FaEnvelope, FaLock, FaImage } from 'react-icons/fa';
import "../styles/mix.css"

const Signup = () => {
  const { email: paramEmail } = useParams();
  const [inputData, setInputData] = useState({
    name: '',
    email: paramEmail || '',
    password: '',
    cpassword: ''
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail && storedEmail !== paramEmail) {
      toast.error("Email mismatch. Please use the correct email to sign up.");
      setInputData(prev => ({ ...prev, email: '' })); 
    } else {
      setInputData(prev => ({ ...prev, email: paramEmail }));
      setIsEmailVerified(storedEmail === paramEmail);
    }
  }, [paramEmail]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const validation = ({ name, email, password, cpassword }) => {
    const errors = {};
    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,6}$/;

    if (name === "") {
      errors.name = "Required*";
    }
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
    if (cpassword === "") {
      errors.cpassword = "Required*";
    } else if (password !== cpassword) {
      errors.cpassword = "Password not Matched";
    }

    return errors;
  };

  const handleChange = (e) => {
    setInputData({ ...inputData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validation(inputData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      const formData = new FormData();
      formData.append("name", inputData.name);
      formData.append("email", inputData.email);
      formData.append("password", inputData.password);
      formData.append("cpassword", inputData.cpassword);
      if (image) {
        formData.append('image', image);
    }
      axios
        .post("http://localhost:5001/api/register", formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then((res) => {
          console.log(res);
          toast.success(res.data.message);
          navigate("/signup-success");
        })
        .catch((error) => {
          if (error.response && error.response.data) {
            toast.error(error.response.data.error);
          } else {
            toast.error("Registration failed");
          }
        });
    }
  };

  return (
    <div className="main">
      <div className="overlay">
        <div className="w-25 bg-white rounded p-3">
          <h2 className="text-center text-success">
            <strong>Signup!</strong>
          </h2>
          <ToastContainer />
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>
                <strong>Name</strong>
              </label>
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    <FaUser style={{blockSize: 30}}/>
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="Enter Your Name"
                  autoComplete="off"
                  name="name"
                  className="form-control rounded-0"
                  onChange={handleChange}
                />
              </div>
              {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}
            </div>

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
                  type="email"
                  value={inputData.email}
                  placeholder="Enter Your Email"
                  autoComplete="off"
                  name="email"
                  className="form-control rounded-0"
                  onChange={handleChange}
                  readOnly
                />
              </div>
              {isEmailVerified && (
                <div style={{ color: "green", display: "flex", alignItems: "center", marginTop: "5px" }}>
                  <FaCheckCircle style={{ marginRight: "5px" }} />
                  <span><strong>Email verified</strong></span>
                </div>
              )}
              {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
            </div>

            <div className="mb-3">
              <label>
                <strong>Password</strong>
              </label>
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    <FaLock style={{blockSize: 32}}/>
                  </span>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Your Password"
                  autoComplete="off"
                  name="password"
                  className="form-control rounded-0"
                  onChange={handleChange}
                />
                <div className="input-group-append">
                  <span
                    className="input-group-text"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ cursor: "pointer", blockSize: 45 }}  
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>
              {errors.password && (
                <p style={{ color: "red" }}>{errors.password}</p>
              )}
            </div>

            <div className="mb-3">
              <label>
                <strong>Confirm Password</strong>
              </label>
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    <FaLock style={{blockSize: 32}}/>
                  </span>
                </div>
                <input
                  type={showCPassword ? "text" : "password"}
                  placeholder="Enter Your Confirm Password"
                  autoComplete="off"
                  name="cpassword"
                  className="form-control rounded-0"
                  onChange={handleChange}
                />
                <div className="input-group-append">
                  <span
                    className="input-group-text"
                    onClick={() => setShowCPassword(!showCPassword)}
                    style={{ cursor: "pointer", blockSize: 45 }}
                  >
                    {showCPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>
              {errors.cpassword && (
                <p style={{ color: "red" }}>{errors.cpassword}</p>
              )}
            </div>

            <div className="mb-3">
              <label>
                <strong>Profile Image</strong>
              </label>
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    <FaImage style={{blockSize: 30}}/>
                  </span>
                </div>
                {imagePreview && (
              <img
                src={imagePreview}
                alt="Profile Preview"
                className="rounded-circle mb-2"
                style={{ width: '80px', height: '80px', objectFit: 'cover', border: '2px solid #fff' }}
              />
            )}
                <input
                  type="file"
                  className="form-control rounded-0"
                  onChange={handleImageChange}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-warning text-white w-100 rounded"
            >
              Register
            </button>
          </form>
          
        </div>
      </div>
    </div>
  );
};

export default Signup;
