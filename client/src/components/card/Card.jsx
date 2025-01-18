import { Link, useNavigate } from "react-router-dom";
import "./card.scss";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";


function Card({ item }) {
  const [post, setPost] = useState(item);
  const [saved, setSaved] = useState(item.isSaved);

  useEffect(() => {
    getPost();
  }, []);

  useEffect(() => {
    setSaved(post.isSaved);
  }, [post]);
  const [isMe, setIsMe] = useState(false);

  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const getPost = async () => {
    try {
      const res = await apiRequest.get("/posts/" + item.id);
      setPost(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSave = async () => {
    if (!currentUser) {
      navigate("/login");
    }
    // AFTER REACT 19 UPDATE TO USEOPTIMISTIK HOOK
    setSaved((prev) => !prev);
    try {
      await apiRequest.post("/users/save", { postId: post.id });
    } catch (err) {
      console.log(err);
      setSaved((prev) => !prev);
    }
  };

  const handleSendMessage = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    try {
      const chat = await apiRequest.post("/chats/find/" + post.userId);
      console.log(chat);
      if (chat.data === null) {
        await apiRequest.post("/chats", { receiverId: post.userId });
      }
      navigate("/profile/", {
        state: {
          chatId: chat.data.id,
          receiver: {

            id: post.userId,
            username: post.user.username, // Thêm username nếu có
            avatar: post.user.avater // Thêm avatar nếu có
          }
        }
      });
    }
    catch (err) {
      console.log(err);
    }
  };

  const checkIsMe = () => {
    if (currentUser) {
      return currentUser.id === item.userId;
    }
    return false;
  }

  useEffect(() => {
    if (currentUser) {
      setIsMe(checkIsMe());
    }
    getPost();
  }, [currentUser]);

  return (
    <div className="card">
      <Link to={`/${item.id}`} className="imageContainer">
        <img src={item.images[0]} alt="" />
      </Link>
      <div className="textContainer">
        <h2 className="title">
          <Link to={`/${item.id}`}>{item.title}</Link>
        </h2>
        <p className="address">
          <img src="/pin.png" alt="" />
          <span>{item.address}</span>
        </p>
        <p className="price">$ {item.price}</p>
        <div className="bottom">
          <div className="features">
            <div className="feature">
              <img src="/bed.png" alt="" />
              <span>{item.bedroom} bedroom</span>
            </div>
            <div className="feature">
              <img src="/bath.png" alt="" />
              <span>{item.bathroom} bathroom</span>
            </div>
          </div>
          {!isMe && <div className="icons">
            <div className="icon"
              onClick={handleSave}
              style={{
                backgroundColor: saved ? "#fece51" : "white",
              }}
            >
              <img src="/save.png" alt="" />
            </div>
            <div className="icon" onClick={() => handleSendMessage()}>
              <img src="/chat.png" alt="" />
            </div>
          </div>}
        </div>
      </div>
    </div>
  );
}

export default Card;
