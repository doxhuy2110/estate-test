import { useEffect, useState } from "react";
import "./editNewsPage.scss";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import apiRequest from "../../lib/apiRequest";
import UploadWidget from "../../components/uploadWidget/UploadWidget";
import { useLoaderData, useNavigate } from "react-router-dom";

function EditNewsPage() {
  const news=useLoaderData();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (news) {
      setTitle(news.title);
      setDesc(news.desc);
      setContent(news.content);
      setImages([news.image]);
    }
  }, [news]);
  
  const navigate = useNavigate();

  // Cấu hình cho ReactQuill
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold", "italic", "underline", "strike",
    "list", "bullet",
    "align",
    "link", "image",
  ];

  // Xử lý khi nội dung thay đổi
  const handleContentChange = (content) => {
    setContent(content);
  };

  // Custom image handler cho ReactQuill
  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'estate');
      formData.append('folder', 'news');

      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/drqpw8wjs/image/upload`,
          {
            method: 'POST',
            body: formData,
          }
        );
        const data = await response.json();
        const quill = document.querySelector('.ql-editor');
        const range = document.getSelection().getRangeAt(0);
        const img = document.createElement('img');
        img.src = data.secure_url;
        range.insertNode(img);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    };
  };

  // Cập nhật modules với custom image handler
  modules.toolbar.handlers = {
    image: imageHandler
  }; 

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !desc || !content) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      const newsData = {
        title,
        desc,
        image: images[0],
        content,
      };
      console.log(newsData);

      const response = await apiRequest.put("/news/"+news.id, newsData);

      if (response.status === 200) {
        navigate("/news/"+news.id);
      }
    } catch (err) {
      console.log(err);
      setError(err.message || "Failed to Edit news");
    }
  };

  return (
    <div className="editNewsPage">
      <div className="formContainer">
        <h1>Edit News</h1>
        <div className="wrapper">
          <form onSubmit={handleSubmit}>
            <div className="item">
              <label htmlFor="title">Title</label>
              <input 
                id="title" 
                name="title" 
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required 
              />
            </div>
            
            <div className="item description">
              <label htmlFor="desc">Description</label>
              <ReactQuill 
                theme="snow" 
                value={desc}
                onChange={setDesc}
                modules={{
                  toolbar: [
                    ["bold", "italic", "underline"],
                    [{ list: "ordered" }, { list: "bullet" }],
                  ]
                }}
              />
            </div>

            <div className="item content">
              <label htmlFor="content">Content</label>
              <ReactQuill
                theme="snow"
                value={content}
                onChange={handleContentChange}
                modules={modules}
                formats={formats}
              />
            </div>
            
            <button className="sendButton" type="submit">Edit</button>
            {error && <span className="error">{error}</span>}
          </form>
        </div>
      </div>
      <div className="sideContainer">
        <h1>Edit thumbnail</h1>
        {images.map((image, index) => (
          <img src={image} key={index} alt="" className="preview-image" />
        ))}
        <UploadWidget
          uwConfig={{
            multiple: true,
            cloudName: "drqpw8wjs",
            uploadPreset: "estate",
            folder: "news",
          }}
          setState={setImages}
        />
      </div>
    </div>
  );
}

export default EditNewsPage;