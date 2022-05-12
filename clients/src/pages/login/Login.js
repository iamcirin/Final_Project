import React from "react";
import { useRef } from "react";
import "./login.css";
import { loginCall } from "../../apiCalls";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link, Navigate } from "react-router-dom";
import Loadder from "../../components/loader/Loader";
import { useEffect } from "react";

const Login = () => {
  const email = useRef();
  const password = useRef();

  const { user, isFetching, error, dispatch } = useContext(AuthContext);

  const handleClick = (e) => {
    e.preventDefault();
    const emailValue = email.current.value;
    const passwordValue = password.current.value;
    loginCall({ email: emailValue, password: passwordValue }, dispatch);
  };

  const LogginForm = () => {
    return (
      <div className="login">
        <div className="loginWrapper">
          <div className="loginLeft">
            <h3 className="loginLogo">UniVault</h3>
            <span className="loginDesc">
              Free access to different apps with a single-sign-on on UniVault.
            </span>
          </div>
          <div className="loginRight">
            <form className="loginBox" onSubmit={handleClick}>
              <input
                type="email"
                required
                placeholder="Email"
                className="loginInput"
                ref={email}
              />
              <input
                type="password"
                required
                placeholder="Password"
                className="loginInput"
                ref={password}
                minLength="6"
              />
              <button className="loginButton">
                {isFetching ? "loading..." : "Log In"}
              </button>
              <span className="loginForgot">Forgot Password</span>
              <Link to="/register" className="loginRegisterButton">
                <button className="registerButton">Create an account</button>
              </Link>
            </form>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="loginLoadderWrapper">
      <LogginForm />
      {isFetching && (
        <div className="wrapper">
          <Loadder />
        </div>
      )}
    </div>
  );
};

export default Login;
