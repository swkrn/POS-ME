import React from "react";
// import { ImCross } from "react-icons/im";
import styles from "./styles/BackdropLogin.module.css";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import errIcon from "../image/logo_err.png"

const Backdrop = function (props) {
  return (
    <div className={styles.background}>
      <div className={styles.warning_box}>
        {/* <ImCross className={styles.logo} /> */}
        <img
          src={errIcon}
          alt="Error sign"
          className={styles.errIcon}
        />
        <p className={styles.textWarning}>ไม่สามารถเข้าสู่ระบบได้</p>
        <p className={styles.text}>ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง</p>
        <p className={styles.text}>กรุณาลองใหม่อีกครั้ง</p>
        <Link to="/Login" onClick={props.close}>
          <button type="button" className="btn btn-outline-danger btn-lg">Close</button>
        </Link>
      </div>
    </div>
  );
};

export default Backdrop;
