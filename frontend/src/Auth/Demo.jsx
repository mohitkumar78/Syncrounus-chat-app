import React, { useState } from "react";
import axios from "axios";

const CloudinaryUpload = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");

  const CLOUDINARY_URL =
    "https://api.cloudinary.com/v1_1/dcmtnw3ko/image/upload";
  const UPLOAD_PRESET = "chatapp";

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!image) {
      alert("Please select an image to upload");
      return;
    }

    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const response = await axios.post(CLOUDINARY_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(response);
      setUploadedImageUrl(response.data.secure_url);
      alert("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image.");
    }
  };

  return (
    <div>
      <h2>Upload an Image to Cloudinary</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {preview && (
        <img
          src={preview}
          alt="Preview"
          style={{ width: "200px", margin: "10px 0" }}
        />
      )}
      <button onClick={handleUpload}>Upload to Cloudinary</button>
      {uploadedImageUrl && (
        <div>
          <h3>Uploaded Image:</h3>
          <img
            src={uploadedImageUrl}
            alt="Uploaded"
            style={{ width: "200px", margin: "10px 0" }}
          />
        </div>
      )}
    </div>
  );
};

export default CloudinaryUpload;
