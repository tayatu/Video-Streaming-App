import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const UploadPage = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState();
  const [video, setVideo] = useState();
  
  const [selectedTags, setSelectedTags] = useState([]);
  const predefinedTags = ['Tag1', 'Tag2', 'Tag3', 'Tag4'];

  const navigate = useNavigate();


  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleVideoChange = (e) => {
    console.log(e.target.files[0]);
    const file = e.target.files[0];
    setVideo(file);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", name);
    formData.append("desc", description);
    formData.append("image", image);
    formData.append("video", video);

    if (name && description  && video) {
      const response = await axios.post(
        `/videos`,
        formData,{
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

      if (response.status === 201) {
        console.log("Video uploaded successfully.");
        navigate("/");
      } else {
        console.error("Error uploading video.");
      }
    } else {
      console.error("Please fill in all fields.");
    }
  };

  return (
    <div>
      <h1>Upload Page</h1>
      <form onSubmit={handleSubmit} enctype="multipart/form-data">
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={handleDescriptionChange}
            required
          />
        </div>
        <div>
          <label>Image:</label>
          <input
            type="file"
            name = "image"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
        </div>
        <div>
          <label>Video:</label>
          <input
            type="file"
            name = "video"
            id = "video"
            accept=".mp4"
            onChange={handleVideoChange}
            required
          />
        </div>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default UploadPage;
