import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../styles/product.css'

const CreateProduct = () => {
  const [name, setName] = useState("");
  const [color,setColor] = useState("");
  const [price,setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('color',color);
    formData.append('price',price);
    if (image) {
      formData.append('image', image);
    }

    await axios.post("http://localhost:5001/api/createProduct", formData, {
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
    <div className="prod">
    <div className="overlay_prod">
      <div className="w-50 h-70 bg-white rounded p-3 m-auto">
        <form onSubmit={handleSubmit}>
          <h2 className="text-primary text-center"><strong><u>Add Product</u></strong></h2>
          <div className="mb-2 ">
            <label><strong>Product Name</strong></label>
            <input
              type="text"
              placeholder="Product Name"
              className="form-control"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="mb-2">
            <label><strong>Color</strong></label>
            <input
              type="text"
              placeholder="Product Color"
              className="form-control"
              onChange={(e) => setColor(e.target.value)}
            />
          </div>

          <div className="mb-2">
            <label><strong>Price</strong></label>
            <input
              type="text"
              placeholder="Product Price"
              className="form-control"
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div className="mb-2">
            <label><strong>Image</strong></label>
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

          <div className="text-center">
          <button className="btn btn-success justify-content-center">Add Product</button>
          </div>
        </form>
      </div>
      </div>
    </div>
  );
};

export default CreateProduct;
