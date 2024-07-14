import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import '../styles/product.css'

const UpdateProduct = () => {
  const { id } = useParams();

  const [name, setName] = useState("");
  const [color, setColor] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5001/api/updateProduct/" + id)
      .then((result) => {
        console.log(result);
        setName(result.data.name);
        setColor(result.data.color);
        setPrice(result.data.price);
        setImage(result.data.image);
        setImagePreview(`http://localhost:5001/${result.data.image}`);
      })
      .catch((err) => console.log(err));
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("color", color);
    formData.append("price", price);
    if (image) {
      formData.append("image", image);
    }
    axios
      .put("http://localhost:5001/api/editProduct/" + id, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((result) => {
        console.log(result);
        navigate("/dashboard");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="prod">
    <div className="overlay_prod">
      <div className="w-50 h-70 bg-white rounded p-3 m-auto">
        <form onSubmit={handleSubmit}>
          <h2 className="text-center text-primary"><strong><u>Update Product</u></strong></h2>
          <div className="mb-2">
            <label><strong>Image</strong></label>
            <img
              src={imagePreview ? imagePreview : "/default-profile.png"}
              alt="Profile"
              className="rounded-circle mb-3"
              style={{
                width: "100px",
                height: "100px",
                objectFit: "cover",
                border: "4px solid #fff",
              }}
            />
            <input
              type="file"
              onChange={handleImageChange}
              className="form-control mb-3"
            />
          </div>
          <div className="mb-2">
            <label><strong>Product Name</strong></label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="mb-2">
            <label><strong>color</strong></label>
            <input
              type="text"
            
              className="form-control"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>

          <div className="mb-2">
            <label><strong>Price</strong></label>
            <input
              type="text"
             
              className="form-control"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div className="text-center">
          <button className="btn btn-success">Update</button>
          </div>
        </form>
      </div>
      </div>
    </div>
  );
};

export default UpdateProduct;
