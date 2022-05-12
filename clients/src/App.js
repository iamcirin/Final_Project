import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Profile from "./pages/profile/Profile";
import Weather from "./pages/weather/Weather";
import Notification from "./pages/notification/Notification";
import "./app.css";
import FollowNotif from "./pages/notification/FollowNotif";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Register from "./pages/register/Register";
import Messenger from "./pages/messenger/Messenger";
import { useEffect } from "react";
import { useState } from "react";
import Façade from "./pages/façadePage/Façade";

function App() {
  const { user, token } = useContext(AuthContext);
  const [accessToken, setAccessToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    localStorage.setItem("token", token);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route
          path="/login"
          element={user ? <Navigate to="/main" /> : <Login />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/main" /> : <Register />}
        />
        <Route path="/profile/:id" element={<Profile token={accessToken} />} />
        <Route
          path="/messenger"
          element={user ? <Messenger /> : <Navigate to="/main" />}
        />
        <Route
          path="/notifications/:id"
          element={user ? <Notification /> : <Navigate to="/main" />}
        />
        <Route
          path="/notifications/follow/:id"
          element={user ? <FollowNotif /> : <Navigate to="/main" />}
        />
        <Route path="/main" element={user ? <Façade /> : <Login />} />
        <Route path="/weather" element={<Weather />} />
      </Routes>
    </Router>
  );
}

export default App;
