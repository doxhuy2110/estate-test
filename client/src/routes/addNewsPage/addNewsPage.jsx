import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./AddNewsPage.css";
import apiRequest from "../../lib/apiRequest";
import { useNavigate } from "react-router-dom";

function AddNewsPage() {
  const [value, setValue] = useState(""); // Nội dung bài viết
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Cấu hình các module của ReactQuill
  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["image"],
        ["link", "blockquote", "code-block"],
      ],
      handlers: {
        image: () => handleImageUpload(),
      },
    },
  };

  // Hàm xử lý upload hình ảnh
  const handleImageUpload = async () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "estate"); // Đổi theo cấu hình Cloudinary của bạn

      try {
        const res = await fetch("https://api.cloudinary.com/v1_1/lamadev/image/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        const imageURL = data.secure_url;

        const quill = document.querySelector(".ql-editor");
        const range = quill.__quill.getSelection(true);
        quill.__quill.insertEmbed(range.index, "image", imageURL);
      } catch (error) {
        console.error("Upload failed:", error);
      }
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await apiRequest.post("/posts", {
        postData: {
          content: value, // Nội dung bài viết với hình ảnh được nhúng
        },
      });
      navigate("/" + res.data.id);
    } catch (err) {
      console.log(err);
      setError(err.message);
    }
  };

  return (
    <div className="addNewsPage">
      <h1>Create News</h1>
      <form onSubmit={handleSubmit}>
        <div className="item">
          <label htmlFor="desc">Description</label>
          <ReactQuill
            theme="snow"
            value={value}
            onChange={setValue}
            modules={modules}
          />
        </div>
        <button className="sendButton">Add</button>
        {error && <span>{error}</span>}
      </form>
    </div>
  );
}

export default AddNewsPage;
