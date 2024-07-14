/*import React, { useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ResetPassword() {
    const [password, setPassword] = useState('');
    const [cpassword, setCpassword] = useState('');
    const [errors, setErrors] = useState('');
    
    const { id, token } = useParams();
    const navigate = useNavigate();

    const validation = ({ password, cpassword }) => {
        const errors = {};

        if (password === '') {
            errors.password = 'Required*';
        } else if (password.length < 6) {
            errors.password = 'Password Length should be Atleast 6 Characters';
        }
        if (cpassword === '') {
            errors.cpassword = 'Required*';
        } else if (password !== cpassword) {
            errors.cpassword = 'Password not Matched';
        }

        return errors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validation({ password, cpassword });
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            axios.post(`http://localhost:5000/reset-password/${id}/${token}`, { password })
        
                .then(res => {
                    if (res.data.status === 200) {
                    //toast.success(res.data.message);
                    //console.log("hey")
                    navigate('/login')
                    } else {
                        toast.error(res.data.Status);  
                    } 
                })
                .catch(err => {
                    console.log(err);
                    toast.error('Error resetting password');
                });
        }
    };

    return (
        <div className="d-flex vh-100 bg-primary justify-content-center align-items-center">
            <div className="w-25 bg-white rounded p-3">
                <h2 className='text-center text-success'><strong>Reset Password</strong></h2>
                <ToastContainer />
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label><strong>Password</strong></label>
                        <input
                            type="password"
                            placeholder="Enter Your Password"
                            autoComplete="off"
                            name="password"
                            className="form-control rounded-0"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
                    </div>

                    <div className="mb-3">
                        <label><strong>Confirm Password</strong></label>
                        <input
                            type="password"
                            placeholder="Enter Your Confirm Password"
                            autoComplete="off"
                            name="cpassword"
                            className="form-control rounded-0"
                            onChange={(e) => setCpassword(e.target.value)}
                        />
                        {errors.cpassword && <p style={{ color: 'red' }}>{errors.cpassword}</p>}
                    </div>
                    <button type="submit" className="btn btn-warning text-white w-100 rounded">Reset</button>
                </form>
            </div>
        </div>
    );
}

export default ResetPassword;*/

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { FaEye, FaEyeSlash, FaLock } from 'react-icons/fa';
import "../styles/mix.css"

function Resetpassword() {
  const navigate = useNavigate();
  const { id, token } = useParams();
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  const [errors, setErrors] = useState("");

  const validation = ({ password, cpassword }) => {
    const errors = {};

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

  const handelSubmit = (e) => {
    const validationErrors = validation({ password, cpassword });
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      e.preventDefault();
      axios
        .post(`http://localhost:5001/reset-password/${id}/${token}`, {
          password,
        })
        .then((res) => {
          //if (res.data.status === 200) {
          toast.success(res.data.message);
          console.log(res.data.message);
          navigate("/login");
        }) //else {
        //toast.error(res.data.Status);
        //}

        .catch((error) => {
          /*if (error.response&&error.response.data) {
                setErr(error.response.data.error)
            }
            console.log(error)*/
          console.log(error);
          toast.error("Error resetting password");
        });
    }
  };
  return (

    <div className="main">
    <div className="overlay">
      <div className="w-25 bg-white rounded p-3">
        <h2 className="text-center text-success">
          <strong>Reset Password</strong>
        </h2>
        <ToastContainer />
        <form onSubmit={handelSubmit}>
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
                  onChange={(e)=> setCpassword(e.target.value)}
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
          <button
            type="submit"
            className="btn btn-warning text-white w-100 rounded"
          >
            Reset
          </button>
        </form>
      </div>
      </div>
    </div>
  );
}

export default Resetpassword;
