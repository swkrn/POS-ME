import React, {useState} from 'react'
import { Card } from 'react-bootstrap';
import Navbar from '../../components/NavbarReportContent'
import './styles/Sales.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Popup from '../../components/SalesPopup'
import logo from '../../image/sales.png'
import Button from 'react-bootstrap/Button'
import { useRef } from 'react';
import { Snackbar, Alert } from "@mui/material"

const Salespage=()=> {
    const [popUp,setPopUp] = useState(false);
    const [total,setTotal] = useState('');
    const [monthPick,setMonthPick] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [alertColor, setAlertColor] = useState("error");
    const pickDate = useRef();

 
    // const getMonth = async function(e) {
    //     const date = e.target.value
        
    //     const sendData = {
    //       'date': date
    //     }
    //     const response = await fetch('https://posme.fun:2096/bills/total',{
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json'
    //       },
    //       credentials: 'include',
    //       body:JSON.stringify(sendData)
    //     })
    //     const data = await response.json()
    //     setTotal(data)
    //     // console.log(data)
    // }

    let currentDate = new Date();
    let cDay = currentDate.getDate();
    let cMonth = currentDate.getMonth() + 1;
    let cYear = currentDate.getFullYear();
    let CurrentMonth = cYear + "-" + cMonth;
    console.log(CurrentMonth);



    const getMonth = async function() {
      if (monthPick == true) {

        const date = pickDate.current.value;
        console.log(date);
        
        const sendData = {
          'date': date
        }
        const response = await fetch('https://posme.fun:2096/bills/total',{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body:JSON.stringify(sendData)
        })
        const data = await response.json();
        setTotal(data);
        setPopUp(true);
      }
      else {
        setErrorMessage("โปรดเลือกเดือนที่ต้องการ")
        setAlertColor("error")
      }
      // console.log(data)
  }
  
    return (
        <div>
            <Navbar/>
            <div className='color-sales'>
              <img src = {logo} alt = "sales" className='salesimg2' width='250'></img>
                <div className='sel-month' >
                  {/* เดือน : <input className='picker' type='month' ref={pickDate} onChange={getMonth}/> */}
                  เดือน : <input className='picker' type='month' max={CurrentMonth} ref={pickDate} onChange={() => {setMonthPick(true)}}/>
                </div>
                {/* <button variant="primary" type="submit" className='btn btn-warning selectBut' onClick={() => {setPopUp(true)}}> */}
                <button variant="primary" type="submit" className='btn btn-warning selectBut' onClick={getMonth}>

                  ยืนยัน
                </button>
                {popUp && <Popup closePopUp={setPopUp} total={total.total}/>}
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
  export default Salespage