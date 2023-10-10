import axios from "axios";
import React, { useState } from "react";
import "./UploadPage.css";

const UploadPage = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState();
  const [video, setVideo] = useState();

  const [selectedTags, setSelectedTags] = useState([]);
  const predefinedTags = ["music", "movies", "sports", "education", "other"];

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
    const file = e.target.files[0];
    setVideo(file);
  };
  const handleTagChange = (e) => {
    const value = e.target.value;
    if (selectedTags.includes(value)) {
      setSelectedTags(selectedTags.filter((tag) => tag !== value));
    } else {
      setSelectedTags([...selectedTags, value]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", name);
    formData.append("desc", description);
    formData.append("image", image);
    formData.append("video", video);
    selectedTags.forEach((tag) => {
      formData.append("tags", tag);
    });

    if (name && description && image && video) {
      await axios
        .post(`/videos`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((success) => {
          alert("success");
        })
        .catch((error) => {
          console.log(error);
          alert(error);
        });
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
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
        </div>
        <div>
          <label>Video:</label>
          <input
            type="file"
            name="video"
            id="video"
            accept=".mp4"
            onChange={handleVideoChange}
            required
          />
        </div>
        <div>
          <label>Tags:</label>
          <div>
            {predefinedTags.map((tag) => (
              <label key={tag}>
                <input
                  type="checkbox"
                  value={tag}
                  checked={selectedTags.includes(tag)}
                  onChange={handleTagChange}
                />{" "}
                {tag}
              </label>
            ))}
          </div>
        </div>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default UploadPage;
