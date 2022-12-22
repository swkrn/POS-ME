import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./PromptpayQR.module.css";
import QRCode from "qrcode.react";
import photo from "./thai_qr.png";
import ModalFinish from './ModalFinish';
import Button from 'react-bootstrap/Button'

const generatePayload = require("promptpay-qr");



function ModalPromptpay(props)  {
      const {closeModal, totalAmount, cartItems, setCartItems, setShowSum, setChoosePayment} = props;
      const [phoneNumber, setPhoneNumber] = useState("");
      const [amount, setAmount] = useState(totalAmount);
      const [qrCode, setqrCode] = useState("sample");
      const [billData, setBillData] = useState([]);
      const [finishModal, setFinishModal] = useState(false);
      const navigate = useNavigate();
      // const [showQR, setShowQR] = useState(false);


      useEffect(() => {
        setShowSum(false)

        const getData = async function () {
          const response = await fetch("https://posme.fun:2096/auth/user", {
            method: "GET",
            credentials: "include",
          });
          const data = await response.json();
          // console.log(data);
          const number = data.promptpay_number;
          setPhoneNumber(number);
        };
        getData();
        // console.log(phoneNumber);
        // setAmount(totalAmount);
        setqrCode(generatePayload(phoneNumber,{amount}));
      // }, [phoneNumber, props.cash]);
      }, [phoneNumber, amount]);


      const genBill = async function (e) {
        e.preventDefault();
        let quan = []
        for (let i of cartItems) {
          quan.push({
            _id: i._id,
            amount: i.quantity
          })
        }

        console.log(quan)
        const response = await fetch("https://posme.fun:2096/bills", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            payment_method: "พร้อมเพย์",
            cash: totalAmount,
            quantity: quan, // เอารูปแบบ array นี้มาใส่
          }),
          credentials: "include",
        });
      const data = await response.json();
      console.log(data);
        console.log(data);
        // navigate(`/bills/id/${data.bill_id}`, {
        //   state: { payment_method: data.payment_method },
        // });
        setBillData(data);
        setFinishModal(true);
      };


  return (
    <div className='background'>
      <div className="modal_container3">
        <button className='close_btn' onClick={() => {closeModal(false); setShowSum(true); setChoosePayment(false)}}>
          <img className='close_add_btn_img' src={require('../../image/logo_err.png')} alt="close" />
        </button>

        <div className={styles.price_box}>
          <h4 className={styles.price_total_text}>ยอดสุทธิ</h4>
          <h4 className={styles.price_total}>{totalAmount} บาท</h4>
        </div>

        <div className={styles.u_center}>
          <div className={styles.qr_box}>
            <img src={photo} alt="Promptpay" className={styles.qr_img} />
            <div className={styles.qr_card}>
              <QRCode value={qrCode} size={200} />
              <h4 className={styles.qr_phone_num}>{phoneNumber}</h4>
              <h4 className={styles.qr_amount}>{totalAmount} บาท</h4>
            </div>
          </div>
          <div>
              <Button
                type="button"
                variant="success"
                size="lg"
                onClick={genBill}>
              ยืนยันการชำระเงิน
              </Button>
          </div>
        </div>
        {/* <div className="mid">
          <div className={styles.section_QR}>
            <div className={styles.container}>
              <div className={styles.price_box}>
                <p className={styles.price_total_text}>Total</p>
                <p className={styles.price_total}>{totalAmount} ฿</p>
              </div>
              <div className={styles.u_center}>
                <div className={styles.qr_box}>
                  <img src={photo} alt="Promptpay" className={styles.qr_img} />
                  <div className={styles.qr_card}>
                    <QRCode value={qrCode} size={200} />
                    <p className={styles.qr_phone_num}>{phoneNumber}</p>
                    <p className={styles.qr_amount}>{totalAmount} บาท</p>
                  </div>
                </div>
                <button className={styles.button} onClick={genBill}>
                  เสร็จสิ้น
                </button>
              </div>
            </div>
          </div>
        </div> */}
      </div>
      {finishModal && <ModalFinish closeModal={closeModal} closeFinishModal={setFinishModal} bill_id={billData.bill_id} setCartItems={setCartItems} setShowSum={setShowSum} setChoosePayment={setChoosePayment}/>}
    </div>
  )
}

export default ModalPromptpay;