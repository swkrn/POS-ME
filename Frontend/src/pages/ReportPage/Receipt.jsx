import React from "react";
import styles from "./styles/Receipt.module.css";
import { useParams, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import { Fragment } from "react";
import QRCode from "qrcode.react";

const Receipt = function (props) {
  const params = useParams();
  const location = useLocation();
  const [bill, setBill] = useState(false);
  const [qrCode, setqrCode] = useState("sample");
  const [printBtn, setPrintBtn] = useState(true);
  const [total, setTotal] = useState(0);
  const id = params.id;

  useEffect(() => {
    const sendData = async function () {
      const response = await fetch(`https://posme.fun:2096/bills/id/${id}`, {
        method: "GET",
        // credentials: 'include',
      });
      console.log(response);
      const data = await response.json();
      console.log(data);
      setBill(data);
    };
    sendData();
    setqrCode(`https://posme.fun:8443/receipt/id/${id}`);
  }, [id]);

  const handlePrint = async () => {
    await setPrintBtn(false)
    await window.print()
    // setTimeout(function () { setPrintBtn(true) }, 100)
    return false
  }

  const showItem = function () {
    return React.Children.toArray(bill.quantity.map((item) => {
      return (
        <div>
          {/* <h4 className={styles.merchname}>{item.item_name}</h4>
          <h4>{item.price_each}</h4>
          <h4>{item.quantity}</h4>
          <h4>{item.price_each * item.quantity}</h4> */}
          <div className="row">
            <div className="col"><p className="text-left fs-5 lh-sm">{item.item_name}</p></div>
            <div className="col"><p className="text-center fs-5 lh-1">{item.price_each.toFixed(2)}</p></div>
            <div className="col"><p className="text-center fs-5 lh-1">{item.quantity}</p></div>
            <div className="col"><p className="text-center fs-5 lh-1">{(item.price_each * item.quantity).toFixed(2)}</p></div>
          </div>
        </div>
      );
    }));
  };

  const check = function () {
    if (location.state?.payment_method === "cash") {
      console.log("1");
    } else {
      console.log("2");
    }
  };

  // console.log(location.state.payment_method)

  return (
    <Fragment>
      {!bill && <p>Loading</p>}
      {/* {check()} */}
      {bill &&
        location.state?.payment_method !== "QR" &&
        location.state?.payment_method !== "cash" && (
          <div className={styles.main}>
            <div className="row">
              <div className="col-2">
                { printBtn && <button className="btn btn-primary" onClick={handlePrint}>Print
                </button> } 
              </div>
              <div className="col-8">
                <p className="text-center fs-5 fw-bold lh-1">{bill.user_id.store_name}</p>
                <p className="text-center fs-5 lh-sm">{bill.user_id.address}</p>
                <p className="text-center fs-5 lh-1">
                  หมายเลขประจำตัวผู้เสียภาษี {bill.user_id.tax_id}
                </p>
              </div>
              <div className="col-2 text-end">
                <QRCode value={qrCode} size={100} />
                {/* <sub style={{'wordBreak': 'break-all'}}>{window.location.href}</sub> */}
              </div>
            </div>
            <hr></hr>
            <div>
              <p className="text-center fs-4 fw-bold lh-base">ใบเสร็จรับเงิน/ใบกำกับภาษีแบบย่อ</p>
              <div className="row">
                <div className="col">
                  <p className="text-left fs-5 lh-1">เลขที่ใบเสร็จ {bill.receipt_no}</p>
                </div>
                <div className="col">
                  <p className="text-end fs-5 lh-1">วันที่ {bill.date} {bill.time} น.</p>
                </div>
                <hr></hr>
              </div>
            </div>
            <div>
              <div className="row">
                <div className="col"><p className="text-center fs-5 lh-1">รายการสินค้า</p></div>
                <div className="col"><p className="text-center fs-5 lh-1">หน่วยละ (บาท)</p></div>
                <div className="col"><p className="text-center fs-5 lh-1">จำนวน</p></div>
                <div className="col"><p className="text-center fs-5 lh-1">รวมเงิน (บาท)</p></div>
                <hr></hr>
              </div>
            </div>
            {showItem()}
            <hr></hr>
            <div>
              <div className="row">
                <div className="col"><p className="text-left fs-5 lh-1">จำนวนรวม &ensp; {bill.quantity.reduce((a, c) => a + c.quantity, 0)} &ensp; ชิ้น</p></div>
              </div>
              <div className="row">
                <div className="col"><p className="text-left fs-5 lh-1">ราคาไม่รวมภาษีมูลค่าเพิ่ม</p></div>
                <div className="col"><p className="text-end fs-5 lh-1">{(bill.quantity.reduce((a, c) => (a + c.quantity * c.price_each), 0) * (100 / 107)).toFixed(2)} &ensp; บาท</p></div>
              </div>
              <div className="row">
                <div className="col"><p className="text-left fs-5 lh-1">ภาษีมูลค่าเพิ่ม 7%</p></div>
                <div className="col"><p className="text-end fs-5 lh-1">{(bill.quantity.reduce((a, c) => a + c.quantity * c.price_each, 0) - bill.quantity.reduce((a, c) => (a + c.quantity * c.price_each ), 0) * (100 / 107)).toFixed(2)} &ensp; บาท</p></div>
                <hr></hr>
              </div>
              <div className="row">
                <div className="col"><p className="text-left fs-5 lh-1">รวมทั้งสิ้น</p></div>
                <div className="col"><p className="text-end fs-5 lh-1">{bill.quantity.reduce((a, c) => a + c.quantity * c.price_each, 0).toFixed(2)} &ensp; บาท</p></div>
                <hr className={styles.s9}></hr>
              </div>
              <div className="row">
                <div className="col"><p className="text-left fs-5 lh-1">ชำระโดย{bill.payment_method}</p></div>
                <div className="col"><p className="text-center fs-5 lh-1">รับมา &ensp; {bill.cash.toFixed(2)} &ensp; บาท</p></div>
                <div className="col"><p className="text-end fs-5 lh-1">เงินทอน &ensp; {(bill.cash-bill.quantity.reduce((a, c) => a + c.quantity * c.price_each, 0)).toFixed(2)} &ensp; บาท</p></div>
              </div>
              {/* <p className="text-right fs-5 lh-1">ราคาไม่รวมภาษีมูลค่าเพิ่ม &ensp; {bill.quantity.reduce((a, c) => a + c.quantity * c.price_each * 0.93, 0)} บาท</p>
              <p className="text-right fs-5 lh-1">ภาษีมูลค่าเพิ่ม 7% &ensp; {bill.quantity.reduce((a, c) => a + c.quantity * c.price_each * 0.07, 0)} บาท</p>
              <p className="text-right fs-5 lh-1">รวมทั้งสิ้น &ensp; {bill.quantity.reduce((a, c) => a + c.quantity * c.price_each, 0)} บาท</p>
              <h2 className={styles.totalPrice}>รับมา &ensp; {bill.cash} บาท</h2>
              <h2 className={styles.totalPrice}>เงินทอน &ensp; {bill.cash-bill.quantity.reduce((a, c) => a + c.quantity * c.price_each, 0)} บาท</h2>
              <hr className={styles.s9}></hr>
              <h2 className={styles.totalPrice}>ชำระโดย &ensp; {bill.payment_method}</h2> */}
            </div>
            <br></br>
            <div className={styles.box}>
              {/* <QRCode value={qrCode} size={150} /> */}
              <p className="text-center fs-5 lh-lg">.</p>
              <p className="text-center fs-5 lh-lg mt-2">ขอบคุณที่ใช้บริการ</p>
            </div>
          </div>
        )}
      {/* {bill && location.state?.payment_method === "cash" && (
        <div className={styles.main}>
          <div>
            <p className="text-center fs-5 fw-bold lh-1">{bill.user_id.store_name}</p>
            <p className="text-center fs-5 lh-1">{bill.user_id.address}</p>
            <p className="text-center fs-5 lh-1">
              หมายเลขประจำตัวผู้เสียภาษี {bill.user_id.tax_id}
            </p>
          </div>
          <hr></hr>
          <div>
            <p className="text-center fs-4 fw-bold lh-base">ใบเสร็จรับเงิน/ใบกำกับภาษีแบบย่อ</p>
            <div className="row">
              <div className="col">
                <p className="text-left fs-5 lh-1">เลขที่ใบเสร็จ {bill.receipt_no}</p>
              </div>
              <div className="col">
                <p className="text-end fs-5 lh-1">วันที่ {bill.date} {bill.time} น.</p>
              </div>
              <hr></hr>
            </div>
          </div>
          <div>
            <div className="row">
              <div className="col"><p className="text-center fs-5 lh-1">รายการสินค้า</p></div>
              <div className="col"><p className="text-center fs-5 lh-1">หน่วยละ (บาท)</p></div>
              <div className="col"><p className="text-center fs-5 lh-1">จำนวน</p></div>
              <div className="col"><p className="text-center fs-5 lh-1">รวมเงิน (บาท)</p></div>
              <hr></hr>
            </div>
          </div>
          {showItem()}
          <hr></hr>
          <div>
            <div className="row">
              <div className="col"><p className="text-left fs-5 lh-1">จำนวนรวม &ensp; {bill.quantity.reduce((a, c) => a + c.quantity, 0)} &ensp; ชิ้น</p></div>
            </div>
            <div className="row">
              <div className="col"><p className="text-left fs-5 lh-1">ราคาไม่รวมภาษีมูลค่าเพิ่ม</p></div>
              <div className="col"><p className="text-end fs-5 lh-1">{bill.quantity.reduce((a, c) => Math.round(a + c.quantity * c.price_each * (93/100)), 0)} &ensp; บาท</p></div>
            </div>
            <div className="row">
              <div className="col"><p className="text-left fs-5 lh-1">ภาษีมูลค่าเพิ่ม 7%</p></div>
              <div className="col"><p className="text-end fs-5 lh-1">{bill.quantity.reduce((a, c) => Math.round(a + c.quantity * c.price_each * (7/100)), 0)} &ensp; บาท</p></div>
              <hr></hr>
            </div>
            <div className="row">
              <div className="col"><p className="text-left fs-5 lh-1">รวมทั้งสิ้น</p></div>
              <div className="col"><p className="text-end fs-5 lh-1">{bill.quantity.reduce((a, c) => a + c.quantity * c.price_each, 0)} &ensp; บาท</p></div>
              <hr className={styles.s9}></hr>
            </div>
            <div className="row">
              <div className="col"><p className="text-left fs-5 lh-1">ชำระโดย &ensp; {bill.payment_method}</p></div>
              <div className="col"><p className="text-center fs-5 lh-1">รับมา &ensp; {bill.cash} &ensp; บาท</p></div>
              <div className="col"><p className="text-end fs-5 lh-1">เงินทอน &ensp; {bill.cash-bill.quantity.reduce((a, c) => a + c.quantity * c.price_each, 0)} &ensp; บาท</p></div>
            </div>
          </div>
          <br></br>
          <div className={styles.box}>
            <QRCode value={qrCode} size={150} />
            <p className="text-center fs-5 lh-lg">ขอบคุณที่ใช้บริการ</p>
          </div>
        </div>
      )}

      {bill && location.state?.payment_method === "QR" && (
        <div className={styles.main}>
          <div>
            <p className="text-center fs-5 fw-bold lh-1">{bill.user_id.store_name}</p>
            <p className="text-center fs-5 lh-1">{bill.user_id.address}</p>
            <p className="text-center fs-5 lh-1">
              หมายเลขประจำตัวผู้เสียภาษี {bill.user_id.tax_id}
            </p>
          </div>
          <hr></hr>
          <div>
            <p className="text-center fs-4 fw-bold lh-base">ใบเสร็จรับเงิน/ใบกำกับภาษีแบบย่อ</p>
            <div className="row">
              <div className="col">
                <p className="text-left fs-5 lh-1">เลขที่ใบเสร็จ {bill.receipt_no}</p>
              </div>
              <div className="col">
                <p className="text-end fs-5 lh-1">วันที่ {bill.date} {bill.time} น.</p>
              </div>
              <hr></hr>
            </div>
          </div>
          <div>
            <div className="row">
              <div className="col"><p className="text-center fs-5 lh-1">รายการสินค้า</p></div>
              <div className="col"><p className="text-center fs-5 lh-1">หน่วยละ (บาท)</p></div>
              <div className="col"><p className="text-center fs-5 lh-1">จำนวน</p></div>
              <div className="col"><p className="text-center fs-5 lh-1">รวมเงิน (บาท)</p></div>
              <hr></hr>
            </div>
          </div>
          {showItem()}
          <hr></hr>
          <div>
            <div className="row">
              <div className="col"><p className="text-left fs-5 lh-1">จำนวนรวม &ensp; {bill.quantity.reduce((a, c) => a + c.quantity, 0)} &ensp; ชิ้น</p></div>
            </div>
            <div className="row">
              <div className="col"><p className="text-left fs-5 lh-1">ราคาไม่รวมภาษีมูลค่าเพิ่ม</p></div>
              <div className="col"><p className="text-end fs-5 lh-1">{bill.quantity.reduce((a, c) => Math.round(a + c.quantity * c.price_each * (93/100)), 0)} &ensp; บาท</p></div>
            </div>
            <div className="row">
              <div className="col"><p className="text-left fs-5 lh-1">ภาษีมูลค่าเพิ่ม 7%</p></div>
              <div className="col"><p className="text-end fs-5 lh-1">{bill.quantity.reduce((a, c) => Math.round(a + c.quantity * c.price_each * (7/100)), 0)} &ensp; บาท</p></div>
              <hr></hr>
            </div>
            <div className="row">
              <div className="col"><p className="text-left fs-5 lh-1">รวมทั้งสิ้น</p></div>
              <div className="col"><p className="text-end fs-5 lh-1">{bill.quantity.reduce((a, c) => a + c.quantity * c.price_each, 0)} &ensp; บาท</p></div>
              <hr className={styles.s9}></hr>
            </div>
            <div className="row">
              <div className="col"><p className="text-left fs-5 lh-1">ชำระโดย &ensp; {bill.payment_method}</p></div>
              <div className="col"><p className="text-center fs-5 lh-1">รับมา &ensp; {bill.cash} &ensp; บาท</p></div>
              <div className="col"><p className="text-end fs-5 lh-1">เงินทอน &ensp; {bill.cash-bill.quantity.reduce((a, c) => a + c.quantity * c.price_each, 0)} &ensp; บาท</p></div>
            </div>
          </div>
          <br></br>
          <div className={styles.box}>
            <QRCode value={qrCode} size={150} />
            <p className="text-center fs-5 lh-lg">ขอบคุณที่ใช้บริการ</p>
          </div>
        </div>
      )} */}
    </Fragment>
  );
};
export default Receipt;