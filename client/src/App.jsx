import HomePage from "./routes/homePage/homePage";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import ListPage from "./routes/listPage/listPage";
import { Layout, RequiredAuth } from "./routes/layout/layout";
import SinglePage from "./routes/singlePage/singlePage";
import ProfilePage from "./routes/profilePage/profilePage";
import Login from "./routes/login/login";
import Register from "./routes/register/register";
import ProfileUpdatePage from "./routes/profileUpdatePage/profileUpdatePage";
import NewPostPage from "./routes/newPostPage/newPostPage";
import { listPageLoader, newsListLoader, newsPageLoader, profilePageLoader, singlePageLoader } from "./lib/loaders";
import AdminPage from "./routes/adminPage/adminPage";
import UpdatePostPage from "./routes/updatePostPage/updatePostPage";
import NewsList from "./routes/newsList/newsList";
import NewsPage from "./routes/newsPage/newsPage";
import AddNewsPage from "./routes/addNewsPage/addNewsPage";
import EditNewsPage from "./routes/editNewsPage/editNewsPage";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <HomePage />
        },
        {
          path: "/list",
          element: <ListPage />,
          loader: listPageLoader,
        },
        {
          path: "/news",
          element: <NewsList />,
          loader: newsListLoader,
        },
        {
          path: "/news/:id",
          element: <NewsPage />,
          loader: newsPageLoader,
        },
        {
          path: "/:id",
          element: <SinglePage />,
          loader: singlePageLoader,
        },
        {
          path: "/login",
          element: <Login />
        },
        {
          path: "/register",
          element: <Register />
        }
      ]
    },
    {
      path: "/",
      element: <RequiredAuth />,
      children: [
        {
          path: "/profile",
          element: <ProfilePage />,
          loader: profilePageLoader,
        },
        {
          path: "/profile/update",
          element: <ProfileUpdatePage />
        },
        {
          path: "/add",
          element: <NewPostPage />
        },
        {
          path: "/edit/:id",
          element: <UpdatePostPage />,
          loader: singlePageLoader,
        },
        {
          path: "/news/add",
          element: <AddNewsPage />
        },
        {
          path: "/news/edit/:id",
          element: <EditNewsPage />,
          loader: newsPageLoader,
        }
      ],
    },
    {
      path: "/admin",
      element: <AdminPage />,
    }
  ]);

  return (
    <RouterProvider router={router} />
  );
}

export default App;
