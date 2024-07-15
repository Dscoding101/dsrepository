import React, { useState } from 'react';
//import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import {  FaEnvelope} from 'react-icons/fa';
import "../styles/mix.css"


function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState({});
    

    const validation = ({ email }) => {
        const errors = {};
        const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,6}$/;

        if (!email) {
            errors.email = 'Required*';
        } else if (!email_pattern.test(email)) {
            errors.email = 'Please Enter Valid Email';
        }
        return errors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validation({ email });
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            axios.post('http://localhost:5001/api/forgot-password', { email })
            .then(res => {
                if (res.status === 200) {
                    toast.success(res.data.message);
                  
                } else {
                    toast.error(res.data.message);
                }
            })
            .catch(err => {
                toast.error(err.response?.data?.message || 'An error occurred');
                console.log(err);
            });
        }
    };

    return(
        <div className="main">
        <div className='overlay'>
            <div className="w-25 bg-white rounded p-3">
                <h2 className='text-center text-success'><strong>Forgot Password</strong></h2>
                <ToastContainer />
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label><strong>Email</strong></label>
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
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        </div>
                        {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
                    </div>
                    <button type="submit" className="btn btn-warning text-white w-100 rounded">Send</button>
                </form>
            </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
