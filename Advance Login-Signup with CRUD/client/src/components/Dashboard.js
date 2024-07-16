import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/mix2.css";


const Dashboard = () => {
  const [stud, setStud] = useState([]);
  const token = Cookies.get("token");
  const verifyToken = token ? JSON.parse(atob(token.split(".")[1])) : null;

  
  const username = verifyToken ? verifyToken.name : "";
  const image = verifyToken ? verifyToken.image : "";

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  

  const handleLogout = () => {
    Cookies.remove("token");
    navigate("/login");
    return false;
  };

  useEffect(() => {
    axios
      .get("http://localhost:5001/api/dashboard")
      .then((result) => {
        setStud(result.data);
        console.log(result.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = (id) => {
    axios
      .delete("http://localhost:5001/api/deleteStudent/" + id)
      .then((res) => {
        console.log(res);
        setStud(stud.filter((p) => p._id !== id));
      })
      .catch((err) => console.log(err));
  };

  const handleEditProfile = () => {
    navigate("/edit-profile");
  };


  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      return; // User canceled the action
    }

    try {
      const token = Cookies.get("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const userEmail = decodedToken.email;

      const response = await fetch("http://localhost:5001/api/delete-account", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: userEmail }),
      });

      if (response.ok) {
        alert("Account Deleted Successfully");
        Cookies.remove("token");
        navigate("/login");
      } else {
        const errorData = await response.json();
        console.error("Failed to delete account:", errorData);
        alert(`Failed to delete account: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("An error occurred while deleting the account.");
    }
  };


  return (
    <>
      <div className="dashboard">
        <div className="text-center">
          <h1 className="display-1" style={{ color: "rgb(41, 5, 219)" }}>
            <strong>
              <strong>Welcome, {username}</strong>
            </strong>
          </h1>
          {
            <img
              src={`http://localhost:5001/${image}`}
              alt="Profile"
              style={{
                width: "200px",
                height: "200px",
                borderRadius: "50%",
                border: "2px solid #fff",
              }}
            />
          }
          <br />
          <div>
            <p className="fs-2">
              <strong>
                Thank you for logging in!!
                <br />
                We are very happy to have you !!
              </strong>
            </p>
          </div>
        </div>

        <div
        className="container d-flex justify-content-center align-items-start vh-100"
        style={{ marginTop: "5rem" }}
      >
        <div
          className="d-flex w-75 p-3 bg-light rounded flex-column"
          style={{ height: "70vh", overflowY: "auto" }}
        >
          <div
            className="d-flex justify-content-between align-items-center mb-3"
            style={{ backgroundColor: "#F2E7C3" }}
          >
            <h2 className="text-dark">
              <strong>List of Students</strong>
            </h2>
            <Link to="/create">
              <button
                className="rounded text-white bg-dark"
                style={{
                  
                  blockSize: "50px",
                }}
              >
                Add +
              </button>
            </Link>
          </div>
          <table className="table table-striped table-hover table-warning">
            <thead>
              <tr className="table-dark" style={{height:40}}>
                <th>Image</th>
                <th>Student Name</th>
                <th>Gender</th>
                <th>City</th>
                <th>Study Preferences</th>
                <th>Action</th>
              </tr>
            </thead>
              <tbody>
                {stud.map((p, index) => (
                  <tr key={index}>
                    <td>
                      <img
                        src={
                          p.image? `http://localhost:5001/${p.image}`: "/default-profile.png"
                        }
                        alt="Profile"
                        className="rounded-circle"
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                          border: "2px solid #fff",
                        }}
                      />
                    </td>
                    <td>{p.name}</td>
                    <td>{p.gender}</td>
                    <td>{p.city}</td>
                    <td>{p.studyPreferences}</td>
                    <td>
                      <div className="btn-group">
                        <Link
                          to={`/update/${p._id}`}
                          className="btn btn-warning btn-sm"
                        >
                          Edit
                        </Link>
                        <button
                          className="btn btn-danger btn-sm ml-2"
                          onClick={() => handleDelete(p._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="text-center" style={{ marginTop: "-5rem" }}>
          <button className="btn btn-danger border-2" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div className="container w-50 d-flex justify-content-between mt-3">
          <button
            className="btn btn-success border-2 border-success"
            onClick={handleEditProfile}
          >
            Edit Profile
          </button>
          <button
            className="btn btn-success border-2 border-success"
            onClick={handleDeleteAccount}
          >
            Delete Account
          </button>
        </div>

      </div>
    </>
  );
};

export default Dashboard;

