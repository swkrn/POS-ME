import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import styles from "./styles/PreviousReceipt.module.css";
import Navbar from "../../components/NavbarReportContent"

const PreviousReceipt = function () {
  const [allBills, setAllBills] = useState([]);
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const receipt_no = searchParams.get("receipt_no");
  const navigate = useNavigate();
  const dateRef = useRef();
  const id = params.id;

  useEffect(() => {
    const getAllBills = async function () {
      const response = await fetch("https://posme.fun:2096/bills", {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      setAllBills(data);
    };
    getAllBills();
  }, []);

  const gotoPost = function (id) {
    // setSearchParams({receipt_no: id})
    // navigate(`/receipt/id/${id}`);
    window.open('https://posme.fun:8443/receipt/id/' + id, "_blank");
  };

  const genAllBills = function (allBills) {
    return allBills.slice(0).reverse().map((bill) => {
      return (
        <li
          key={bill._id}
          className={styles.receipt_box}
          onClick={gotoPost.bind(this, bill._id)}
          >
          <p className={styles.receipt_no}>หมายเลขใบเสร็จ: {bill.receipt_no}</p>
          <div className={styles.receipt_info_box}>
            <p className={styles.date}>{bill.date} {bill.time} น.</p>
            <p className={styles.price}>{bill.quantity.reduce((a, c) => a + c.quantity * c.price_each, 0)}฿</p>
          </div>
        </li>
      );
    });
  };

  const submitForm = async function (e) {
    e.preventDefault();
    const date = dateRef.current.value;
    const response = await fetch(`https://posme.fun:2096/bills?date=${date}`, {
      method: "GET",
      credentials: "include",
    });

    const data = await response.json();
    setAllBills(data);
  };

  let currentDate = new Date();
  let cDay = currentDate.getDate();
  let cMonth = currentDate.getMonth() + 1;
  let cYear = currentDate.getFullYear();
  let CurrentDate = cYear + "-" + cMonth + "-" + cDay;
  console.log(CurrentDate);

  return (
    <div>
      <Navbar/>
      <section className={styles.section_prev_receipt}>
        <div className={styles.container}>
          <div className={styles.month_box}>
            <label htmlFor="month">ค้นหาจากวันที่:</label>
            <form action="#" onChange={submitForm}>
              <input type="date" name="month" max={CurrentDate} id="month" ref={dateRef} />
            </form>
          </div>
          <ul className={styles.all_receipt_box}>
            <p className={styles.receipt_heading}>รายการใบเสร็จ</p>
            {genAllBills(allBills)}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default PreviousReceipt;