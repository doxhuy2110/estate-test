import "./singlePage.scss";
import Slider from "../../components/slider/Slider";
import Map from "../../components/map/Map";
import { singlePostData, userData } from "../../lib/dummydata";
import DOMPurify from "dompurify";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import prisma from "../../../../api/lib/prisma.js";

function SinglePage() {
  const post = useLoaderData();
  const [saved, setSaved] = useState(post.isSaved);
  const { currentUser } = useContext(AuthContext);
  const [isMe, setIsMe] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  // console.log(post);

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

  const handleSenMessage = async () => {
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
      return currentUser.id === post.userId;
    }
    return false;
  }

  useEffect(() => {
    if (currentUser) {
      setIsMe(checkIsMe());
      if (currentUser.isAdmin) {
        setIsAdmin(true);
      }
    }
  }, [currentUser]);

  const handleDelete = async () => {
    try {
      if (confirm("Do you really want to delete the post?")) {
        await apiRequest.delete("/posts/" + post.id);
        navigate("/profile");
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="singlePage">
      <div className="details">
        <div className="wrapper">
          <Slider images={post.images} />
          <div className="info">
            <div className="top">
              <div className="post">
                <h1>{post.title}</h1>
                <div className="address">
                  <img src="/pin.png" alt="" />
                  <span>{post.address}</span>
                </div>
                <div className="price">$ {post.price}</div>
              </div>
              <div className="user">
                <img src={post.user.avatar || "/noavatar.png"} alt="" />
                <span>{post.user.username}</span>
              </div>
            </div>
            <div className="bottom"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(post.postDetail.desc),
              }}></div>
          </div>
        </div>
      </div>
      <div className="features">
        <div className="wrapper">
          <p className="title">General</p>
          <div className="listVertical">
            <div className="feature">
              <img src="/utility.png" alt="" />
              <div className="featureText">
                <span>Utilities</span>
                {post.postDetail.utilities === "owner" ? (
                  <p>Owner is responsible</p>
                ) : (
                  <p>Tenant is responsible</p>
                )}
              </div>
            </div>
            <div className="feature">
              <img src="/pet.png" alt="" />
              <div className="featureText">
                <span>Pet Policy</span>
                {post.postDetail.pet === "allowed" ? (
                  <p>Pets Allowed</p>
                ) : (
                  <p>Pets not Allowed</p>
                )}
              </div>
            </div>
            <div className="feature">
              <img src="/fee.png" alt="" />
              <div className="featureText">
                <span>Income Policy</span>
                <p>{post.postDetail.income}</p>
              </div>
            </div>
          </div>
          <p className="title">Sizes</p>
          <div className="sizes">
            <div className="size">
              <img src="/size.png" alt="" />
              <span>{post.postDetail.size} sqft</span>
            </div>
            <div className="size">
              <img src="/bed.png" alt="" />
              <span>{post.bedroom} beds</span>
            </div>
            <div className="size">
              <img src="/bath.png" alt="" />
              <span>{post.bathroom} bathroom</span>
            </div>
          </div>
          <p className="title">Nearby Places</p>
          <div className="listHorizontal">
            <div className="feature">
              <img src="/school.png" alt="" />
              <div className="featureText">
                <span>School</span>
                <p>
                  {post.postDetail.school > 999
                    ? post.postDetail.school / 1000 + "km"
                    : post.postDetail.school + "m"}{" "}
                  away
                </p>
              </div>
            </div>
            <div className="feature">
              <img src="/pet.png" alt="" />
              <div className="featureText">
                <span>Bus Stop</span>
                <p>{post.postDetail.bus}m away</p>
              </div>
            </div>
            <div className="feature">
              <img src="/fee.png" alt="" />
              <div className="featureText">
                <span>Restaurant</span>
                <p>{post.postDetail.restaurant}m away</p>
              </div>
            </div>
          </div>
          <p className="title">Location</p>
          <div className="mapContainer">
            <Map items={[post]} />
          </div>
          {!isMe
            ? <div className="buttons">
              <button onClick={() => handleSenMessage()}>
                <img src="/chat.png" alt="" />
                Send a Message
              </button>
              <button
                onClick={handleSave}
                style={{
                  backgroundColor: saved ? "#fece51" : "white",
                }}
              >
                <img src="/save.png" alt="" />
                {saved ? "Saved" : "Save"}
              </button>
              {isAdmin && (
                <button>
                  <img src="/delete.png" alt="" />
                  Delete
                </button>
              )}
            </div>
            : <div className="buttons">
              <Link to={`/edit/${post.id}`}>
                <button>
                  <img src="/edit.png" alt="" />
                  Edit Post
                </button>
              </Link>
              <button onClick={handleDelete}>
                <img src="/delete.png" alt="" />
                Delete Post
              </button>
              
            </div>
          }
        </div>
      </div>
    </div>
  );
}

export default SinglePage;
