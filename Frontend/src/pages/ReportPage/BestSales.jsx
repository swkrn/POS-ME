import { React, useEffect, useState } from "react";
import Navbar from '../../components/NavbarReportContent'
import { Button, Card } from "react-bootstrap";
import Calendar from "react-calendar";
import DatePicker from '../../components/DateRangePicker'
import './styles/BestSales.css'
import logo from '../../image/bestseller.png'
import { Snackbar, Alert } from "@mui/material"

function Bestseller() {
    const [total, setTotal] = useState([]);
    
    const [monthYear, setmonthYear] = useState("");
    const [buttonColor1, setButtonColor1] = useState(false);
    const [buttonColor2, setButtonColor2] = useState(false);
    const [firstTimeClick, setFirstTimeClick] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);
    const [alertColor, setAlertColor] = useState("error");
    let defaultdate = null;
  
  
    async function sortRevenue() {
      const sendData = {
        date: monthYear,
        sort: "total_sales",
      };
      const response = await fetch("https://posme.fun:2096/bills/bestselling", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(sendData),
      });
      const data = await response.json();
      setTotal(data);
      setButtonColor2(true);
      setButtonColor1(false);
    }
  
    async function sortAmount() {
      setFirstTimeClick(false)
      const sendData = {
        date: monthYear,
        sort: "amount",
      };
      const response1 = await fetch("https://posme.fun:2096/bills/bestselling", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(sendData),
      });
      const data1 = await response1.json();
      setTotal(data1);
      setButtonColor2(false);
      setButtonColor1(true);
    }
  
    const handleChange = async function(e) {
      setFirstTimeClick(false)
      const date = e.target.value;
      setmonthYear(date);
      defaultdate = date;
      const sendData = {
        date: defaultdate,
        sort: "total_sales",
      };
      const response = await fetch("https://posme.fun:2096/bills/bestselling", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(sendData),
      });
      setButtonColor2(true);
      setButtonColor1(false);
      const data = await response.json();
      setTotal(data);
    }
  
    const handleClickAmount = async function() {
      if (firstTimeClick) {
        setErrorMessage("โปรดเลือกวันที่")
        setAlertColor("error")
      }
      else {
        sortAmount();
      }
    }
    const handleClickRevenue = async function() {
      if (firstTimeClick) {
        setErrorMessage("โปรดเลือกวันที่")
        setAlertColor("error")
      }
      else {
        sortRevenue();
      }
    }

    let currentDate = new Date();
    let cDay = currentDate.getDate();
    let cMonth = currentDate.getMonth() + 1;
    let cYear = currentDate.getFullYear();
    let CurrentMonth = cYear + "-" + cMonth;
    console.log(CurrentMonth);
  
    return (
        <div>
            <Navbar/>
            <div className="color-best">
                <div className="best-seller2">
                    <img
                        src={logo}
                        alt=""
                        className="bestsellerimg2"
                        />
                </div>
                <div className="sel-month">
                    <input type="month" max={CurrentMonth} onChange= {handleChange}/>
                </div>
                <div className="sort">
                    <span className="sort-font">จัดเรียงโดย</span>
                    <button
                        className="sort-Amount"
                        onClick={handleClickAmount}
                        style={{ backgroundColor: buttonColor1 ? "#EAC43D" : "white" }}
                        >
                        จำนวน
                    </button>
                    <button
                        className="sort-Revenue"
                        onClick={handleClickRevenue}
                        style={{ backgroundColor: buttonColor2 ? "#EAC43D" : "white" }}
                        >
                        ยอดขายรวม
                    </button>
                </div>
                {total.map(listItem => 
                    // <Card className="list-item">
                    // <p className="itemName">สินค้า: {listItem.item_name}</p>
                    // <p className="itemDetail">จำนวน: {listItem.amount} ชิ้น</p>
                    // <p className="itemDetail">ยอดขายรวม: {listItem.total_sales} ฿</p>
                    // </Card>
                    <ul className="all-box">
                      <Card className="list-item">
                        <p className="itemName">สินค้า: {listItem.item_name}</p>
                        <div className="info_box">
                          <p>จำนวน: {listItem.amount} ชิ้น</p>
                          <p>ยอดขายรวม: {listItem.total_sales} ฿</p>
                        </div>
                      </Card>
                    </ul>
                )}
                {/* <div className="fill_empty">
                x
                </div> */}
            </div>
            {
              errorMessage && 
              <Snackbar  open={errorMessage} onClose={() => setErrorMessage(false)} anchorOrigin={{vertical: 'bottom', horizontal: 'center'}} autoHideDuration={5000} bodyStyle={{ height: 200, width: 200, flexGrow: 0 }}>
                <Alert onClose={() => setErrorMessage(false)} severity={alertColor} sx={{ width: '100%' }}>
                  <div className="errormssg">
                  {errorMessage}
                  </div>
                </Alert>
              </Snackbar>
            }

        </div>


    );
    }
  
  export default Bestseller;