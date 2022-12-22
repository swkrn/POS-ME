import React from "react";
import styles from "./styles/Register.module.css";
import { useNavigate, Link } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import logo from "../image/logoLarge.png";
import Backdrop from "../components/BackdropRegister";

const Register = function (props) {
  const navigate = useNavigate();	
  const [wrongRegister, setWrongRegister] = useState(false);
  const fnameref = useRef();	
  const lnameref = useRef();	
  const storenameref = useRef();	
  const addressref = useRef();	
  const emailref = useRef();	
  const ppref = useRef();
  const taxref = useRef();	
  const usernameref = useRef();	
  const cpasswordref = useRef();	
  const passwordref = useRef();	
  const [showErrorMessage, setShowErrorMessage] = useState(false);	
  const [cPasswordClass, setCPasswordClass] = useState("form-control");	
  const [isCPasswordDirty, setIsCPasswordDirty] = useState(false);

  const closeOverlay = function () {
    setWrongRegister(false);
  };

  useEffect(() => {	
    if (isCPasswordDirty) {	
      if (passwordref.current.value === cpasswordref.current.value) {	
        setShowErrorMessage(false);	
        setCPasswordClass("form-control is-valid");	
      } else {	
        setShowErrorMessage(true);	
        setCPasswordClass("form-control is-invalid");	
      }	
    }	
  }, [isCPasswordDirty]);	
  const checkPasswords = (e) => {	
    setIsCPasswordDirty(true);	
    if (isCPasswordDirty) {	
      if (passwordref.current.value === cpasswordref.current.value) {	
        setShowErrorMessage(false);	
        setCPasswordClass("form-control is-valid");	
      } else {	
        setShowErrorMessage(true);	
        setCPasswordClass("form-control is-invalid");	
      }	
    }	
  };

  const submitHandler = async function (e) {
    e.preventDefault();

    const firstname_input = fnameref.current.value;
    const lastname_input = lnameref.current.value;
    const storename_input = storenameref.current.value;
    const address_input = addressref.current.value;
    const email_input = emailref.current.value;
    const pp_input = ppref.current.value;
    const username_input = usernameref.current.value;
    const password_input = passwordref.current.value;
    const tax_input = taxref.current.value;
    const cpassword_input = cpasswordref.current.value;

    try {
      if (cpassword_input === password_input) {
        const response = await fetch("https://posme.fun:2096/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            username: username_input,
            password: password_input,
            store_name: storename_input,
            address: address_input,
            f_name: firstname_input,
            l_name: lastname_input,
            email: email_input,
            tax_id: tax_input,
            promptpay_number: pp_input,
          }),
        });
        const data = await response.json();
        console.log(data);
        if (response.ok) {
          navigate("/login");
        }
        else {
          setWrongRegister(true);
        }
      }  
    } catch (err) {
      console.log("ERR");
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
      <div className={styles.center}>
        <img
          className={styles.regisLogo}
          src={logo}
          alt="register_logo"
        ></img>
        <form action="#" onSubmit={submitHandler}>
        <div>
            <label className={styles.label} for="username">
              ชื่อบัญชีผู้ใช้:{" "}
            </label>
            <input
              className={styles.input2}
              id="username"
              type="text"
              placeholder="username"
              required
              ref={usernameref}
            ></input>
          </div>

          <div>
            <label className={styles.label} for="password">
              รหัสผ่าน:{" "}
            </label>
            <input
              className={styles.input2}
              id="password"
              type="password"
              placeholder="Password อย่างน้อย 8 ตัวอักษร"
              pattern=".{8,}"
              required
              ref={passwordref}
            ></input>
          </div>

          <div>
            <label className={styles.label} for="confirmpassword">
              ยืนยันรหัสผ่าน:{" "}
            </label>
            <input
              className={styles.input2}
              id="confirmpassword"
              type="password"
              placeholder="Confirm Password"
              pattern=".{8,}"
              required
              ref={cpasswordref}
              onChange={checkPasswords}
            ></input>
          </div>
          {showErrorMessage && isCPasswordDirty ? (	
            <div> Passwords did not match </div>	
          ) : (	
            ""	
          )}

          <div>
            <label className={styles.label} for="personalinfo">
              ชื่อจริง:{" "}
            </label>
            <input
              className={styles.input3}
              id="personalinfo"
              type="text"
              placeholder="firstname"
              required
              ref={fnameref}
            ></input>
          </div>
          <div>
            <label className={styles.label} for="personalinfo">
              นามสกุล:{" "}
            </label>
            <input
              className={styles.input3}
              id="personalinfo"
              type="text"
              placeholder="lastname"
              required
              ref={lnameref}
            ></input>
          </div>
          <div>
            <label className={styles.label} for="personalinfo">
              ชื่อร้านค้า:{" "}
            </label>
            <input
              className={styles.input3}
              id="peronalinfo"
              type="text"
              placeholder="storename"
              required
              ref={storenameref}
            ></input>
          </div>

          <div className={styles.box}>
            <label className={styles.label_address} for="address">
              ที่อยู่:
            </label>
            <textarea
              className={styles.input1}
              id="address"
              name="address"
              rows="4"
              cols="50"
              required
              ref={addressref}
            ></textarea>
          </div>

          <div>
            <label className={styles.label} for="email">
              email :{" "}
            </label>
            <input
              className={styles.input2}
              id="email"
              type="email"
              placeholder="email"
              required
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
              ref={emailref}
            ></input>
          </div>

          <div>
            <label className={styles.label} for="taxid">
              หมายเลขประจำตัวผู้เสียภาษี:{" "}
            </label>
            <input
              className={styles.input2}
              id="taxid"
              type="text"
              placeholder="taxid (13 หลัก)"
              pattern="[0-9]{13}"
              required
              ref={taxref}
            ></input>
          </div>

          <div>
            <label className={styles.label} for="promptpay">
              เลขพร้อมเพย์:{" "}
            </label>
            <input
              className={styles.input2}
              id="promptpay"
              type="tel"
              placeholder="promtpay number (10 หลัก)"
              pattern="[0-9]{10}"
              required
              ref={ppref}
            ></input>
          </div>

            <button className={`${styles.block} ${styles.register_btn}`}>ลงทะเบียน</button>
        </form>
        {wrongRegister && <Backdrop close={closeOverlay} />}
        <Link to="/login">
            <button className={`${styles.block} ${styles.login_btn}`}>
              กลับสู่หน้า login
            </button>
        </Link>
      </div>
    </div>
  );
};
export default Register;