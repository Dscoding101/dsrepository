import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock, FaImage } from 'react-icons/fa';
import Cookies from "js-cookie";
import '../styles/edit.css'


const EditProfile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCpassword] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [currentPassword, setCurrentPassword] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      navigate('/login');
    } else {
      const verifyToken = JSON.parse(atob(token.split('.')[1]));
      setName(verifyToken.name);
      setEmail(verifyToken.email);
      setImage(verifyToken.image);
      if (verifyToken.image) {
        setImagePreview(`http://localhost:5001/${verifyToken.image}`);
      }
      
    }
  }, [navigate]);



const handleFileChange = (e) => {
  setImage(e.target.files[0]);
  setImagePreview(URL.createObjectURL(e.target.files[0]))
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
    } else if (password === currentPassword) {
      errors.password = "New password should be different from the current password";
    }
    if (cpassword === "") {
      errors.cpassword = "Required*";
    } else if (password !== cpassword) {
      errors.cpassword = "Password not Matched";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validation({ name, email, password, cpassword });
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      const token = Cookies.get('token');

      const formData = new FormData();
      formData.append('name', name);
      formData.append('password', password);
      formData.append('image', image);
      formData.append('email', email); // Include email in the form data

      try {
        const response = await fetch('http://localhost:5001/api/profile', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        const data = await response.json();
        if (response.ok) {
          toast.success('Profile updated successfully');

          // Logout user and redirect to login page after profile update
          await fetch('http://localhost:5001/api/logout', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          // Clear cookie on client side
          Cookies.remove('token');

          // Redirect to login page after logout
          setTimeout(() => {
            navigate('/login');
          }, 3000); // Redirect to login after 2 seconds
        } else {
          toast.error(data.message || 'Error updating profile');
        }
      } catch (error) {
        toast.error('Server error');
      }
    }
  };

  return (
    <div className="profile">
    <div className="profile_overlay">
      <div className="w-25 bg-white rounded p-3">
        <h2 className="text-center text-success">
          <strong>Edit Profile</strong>
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
              value={name}
              name="name"
              className="form-control rounded-0"
              onChange={(e) => setName(e.target.value)}
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
              value={email}
              placeholder="Enter Your Email"
              name="email"
              className="form-control rounded-0"
              onChange={(e) => setEmail(e.target.value)}
              readOnly
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
                    <FaLock style={{blockSize: 32}}/>
                  </span>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Your Password"
                  autoComplete="off"
                  name="password"
                  className="form-control rounded-0"
                  onChange={(e)=> setPassword(e.target.value)}
                />
                <div className="input-group-append">
                  <span
                    className="input-group-text"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ cursor: "pointer", blockSize: 46 }}  
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
                  onChange={(e)=> setCpassword(e.target.value)}
                />
                <div className="input-group-append">
                  <span
                    className="input-group-text"
                    onClick={() => setShowCPassword(!showCPassword)}
                    style={{ cursor: "pointer", blockSize: 46 }}
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
            <img
                src={imagePreview ? imagePreview:'./default.png'}
                alt="Profile"
                className="rounded-circle mb-3"
                style={{ width: '100px', height: '100px', objectFit: 'cover', border: '2px solid #fff' }}
              />
            <input
              type="file"
              className="form-control rounded-0"
              onChange={handleFileChange}
            />
          </div>
          </div>

          <div className=" d-flex justify-content-between mt-3">
          <button type="submit" className="btn btn-success ">Update Profile</button>
          <a href="/dashboard"><button type="button" className="btn btn-primary">Go Back to Dashboard</button></a>
          </div>
          
        </form>
        
      </div>
      </div>
    </div>
  );
};

export default EditProfile;

