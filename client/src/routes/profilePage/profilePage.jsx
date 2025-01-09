import { Suspense, useContext, useEffect, useState } from "react";
import Chat from "../../components/chat/Chat";
import List from "../../components/list/List";
import apiRequest from "../../lib/apiRequest";
import "./profilePage.scss";
import { Await, Link, useLoaderData, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext"

function ProfilePage() {

  const data = useLoaderData();
  const [isAdmin, setIsAdmin] = useState(false);

  const { updateUser, currentUser } = useContext(AuthContext);

  const navigate = useNavigate();


  const handleLogout = async () => {
    try {
      await apiRequest.post("/auth/logout");
      updateUser(null);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  }



  const checkAdmin = async () => {
    try {
      const res = await apiRequest.get("/test/should-be-admin");
      if (res.data.isAdmin) {
        setIsAdmin(true);
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    checkAdmin();
  }, []);

  return (
    (< div className="profilePage" >
      <div className="details">
        <div className="wrapper">
          <div className="title">
            <h1>User Information</h1>
            {
              isAdmin && (
                <Link to="/admin">
                  <button>Admin Panel</button>
                </Link>
              )
            }
            <Link to="/profile/update">
              <button>Update Profile</button>
            </Link>
          </div>
          <div className="info">
            <span>
              Avatar:
              <img
                src={currentUser.avatar || "/noavatar.png"}
              />
            </span>
            <span>
              Username: <b>{currentUser.username}</b>
            </span>
            <span>
              E-mail: <b>{currentUser.email}</b>
            </span>
            <button onClick={handleLogout}>Logout</button>
          </div>
          <div className="title">
            <h1>My List</h1>
            <Link to="/add">
              <button>Create New Post</button>
            </Link>
          </div>
          <Suspense fallback={<p>Loading...</p>}>
            <Await
              resolve={data.postResponse}
              errorElement={<p>Error loading posts!</p>}
            >
              {(postResponse) => <List posts={postResponse.data.userPosts} />}
            </Await>
          </Suspense>
          <div className="title">
            <h1>Saved List</h1>
          </div>
          <Suspense fallback={<p>Loading...</p>}>
            <Await
              resolve={data.postResponse}
              errorElement={<p>Error loading posts!</p>}
            >
              {(postResponse) => <List posts={postResponse.data.savedPosts} />}
            </Await>
          </Suspense>
        </div>
      </div>
      <div className="chatContainer">
        <div className="wrapper">
          <Suspense fallback={<p>Loading...</p>}>
            <Await
              resolve={data.chatResponse}
              errorElement={<p>Error loading chats!</p>}
            >
              {(chatResponse) => <Chat chats={chatResponse.data} />}
            </Await>
          </Suspense>
        </div>
      </div>
    </div >)
  );
}

export default ProfilePage;
