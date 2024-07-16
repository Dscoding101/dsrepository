import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/student.css"

const CreateStudent = () => {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [city, setCity] = useState("");
  const [studyPreferences, setStudyPreferences] = useState([]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleStudyPreferencesChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setStudyPreferences((prev) => [...prev, value]);
    } else {
      setStudyPreferences((prev) => prev.filter((edu) => edu !== value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('gender', gender);
    formData.append('city', city);
    formData.append('studyPreferences', studyPreferences.join(','));
    if (image) {
      formData.append('image', image);
    }

    await axios.post("http://localhost:5001/api/createStudent", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then((result) => {
        alert("Data Saved");
        console.log(result);
        navigate("/dashboard");
      })
      .catch((err) => {
        alert(err);
        console.log(err);
      });
  };

  return (
    <div className="studs">
    <div className="overlay_studs">
      <div className="w-50 h-70 bg-white rounded p-3 m-auto">
        <form onSubmit={handleSubmit}>
          <h2>Add Student</h2>
          
          <div className="mb-2">
            <label>Name:</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="mb-2">
            <label>Gender:</label>
            <div>
              <input
                type="radio"
                id="male"
                name="gender"
                value="Male"
                checked={gender === "Male"}
                onChange={(e) => setGender(e.target.value)}
              />
              <label htmlFor="male">Male</label>
            </div>
            <div>
              <input
                type="radio"
                id="female"
                name="gender"
                value="Female"
                checked={gender === "Female"}
                onChange={(e) => setGender(e.target.value)}
              />
              <label htmlFor="female">Female</label>
            </div>
            <div>
              <input
                type="radio"
                id="other"
                name="gender"
                value="Other"
                checked={gender === "Other"}
                onChange={(e) => setGender(e.target.value)}
              />
              <label htmlFor="other">Other</label>
            </div>
          </div>

          <div className="mb-2">
            <label>City:</label>
            <select
              className="form-control"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            >
              <option value="">Select City</option>
              <option value="Kolkata">Kolkata</option>
              <option value="Howrah">Howrah</option>
              <option value="Hooghly">Hooghly</option>
              <option value="Konnagar">Konnagar</option>
              <option value="Durgapur">Durgapur</option>
            </select>
          </div>

          <div className="mb-2">
            <label>Study Preferences:</label>
            <div>
              <input
                type="checkbox"
                id="math"
                value="Math"
                checked={studyPreferences.includes("Math")}
                onChange={handleStudyPreferencesChange}
              />
              <label htmlFor="math">Math</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="science"
                value="Science"
                checked={studyPreferences.includes("Science")}
                onChange={handleStudyPreferencesChange}
              />
              <label htmlFor="science">Science</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="history"
                value="History"
                checked={studyPreferences.includes("History")}
                onChange={handleStudyPreferencesChange}
              />
              <label htmlFor="history">History</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="literature"
                value="Literature"
                checked={studyPreferences.includes("Literature")}
                onChange={handleStudyPreferencesChange}
              />
              <label htmlFor="literature">Literature</label>
            </div>
          </div>

          <div className="mb-2">
            <label>Profile Picture:</label>
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Profile Preview"
                className="rounded-circle mb-3"
                style={{ width: '100px', height: '100px', objectFit: 'cover', border: '4px solid #fff' }}
              />
            )}
            <input
              type="file"
              onChange={handleImageChange}
              className="form-control mb-3"
            />
          </div>

          <button className="btn btn-success">Submit</button>
        </form>
      </div>
      </div>
    </div>
  );
};

export default CreateStudent;
