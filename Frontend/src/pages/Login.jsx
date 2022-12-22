import React from "react";
import styles from "./styles/Login.module.css";
import { useState, useRef, useEffect } from "react";
import { useNavigate,Navigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Backdrop from "../components/BackdropLogin";
import logo from "../image/logo_name.png"

function Login(props) {
  const [wrongLogin, setWrongLogin] = useState(false);
  const [statusLogin, setStatusLogin] = useState(false);
  const usernameRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();

  const closeOverlay = function () {
    setWrongLogin(false);
  };

  const submitHandler = async function (e) {
    e.preventDefault();

    const username_input = usernameRef.current.value;
    const password_input = passwordRef.current.value;
    try {
      const response = await fetch("https://posme.fun:2096/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username_input,
          password: password_input,
        }),
      });
      const data = await response.json();
      setStatusLogin(true);
    } catch (err) {
      setWrongLogin(true);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const userData = await fetch("https://posme.fun:2096/auth/user",{
        method: "GET",
        credentials: 'include',
      });
      const userInfo = await userData.json();
      //console.log(userInfo);
      if (userData.ok) {
        navigate("/store/home")
      }
    }
    fetchData();
    //console.log(storeData.store_name)
  },[])

  return (
    <div className={styles.main}>
      <section className={styles.section_register}>
        <div className={styles.center}>
          <img
            className={styles.lock_image}
            src={logo}
            alt="img"
          />
          <form action="#" onSubmit={submitHandler}>
            <input
              className={`${styles.block} ${styles.input_field}`}
              cols="40"
              placeholder="username"
              ref={usernameRef}
            />
            <input
              type='password'
              className={`${styles.block} ${styles.input_field}`}
              cols="40"
              placeholder="password"
              ref={passwordRef}
            />
              <button className={`${styles.block} ${styles.login_btn}`}>
                เข้าสู่ระบบ
              </button>
          </form>
          {wrongLogin && <Backdrop close={closeOverlay} />}
          {statusLogin && <Navigate to="/store/home" setLogginToF/>}

          <Link to="/register">
            <button className={`${styles.block} ${styles.register_btn}`}>
              ลงทะเบียน
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Login;
