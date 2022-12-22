import React, { useRef, useState, useEffect } from "react";
import styles from "./modalcash.module.css";
import { useNavigate } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";
import ModalFinish from './ModalFinish';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button'

const ModalCash = function (props) {
  const {totalAmount, cartItems, closeModal, setShowSum, setChoosePayment, setCartItems} = props;
  const [change, setChange] = useState([])
  const [invalidMoney, setInvalidMoney] = useState(false);
  const [billData, setBillData] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [finishModal, setFinishModal] = useState(false);
  const moneyref = useRef();
  const navigate = useNavigate();
  const [alertColor, setAlertColor] = useState("error");
  // console.log(totalAmount);

  const coins = [1000, 500, 100, 50, 20, 10, 5, 2, 1, 0.5, 0.25]


  useEffect(() => {
    setShowSum(false)
  },[])

  
  useEffect(() => {
    if (moneyref.current.value - totalAmount >= 0) {
      setInvalidMoney(true)
    }
    else {
      setInvalidMoney(false)
    }
  })


  const getMoney = function () {
    console.log(moneyref.current.value - totalAmount)
    setChange(computeChange(coins, moneyref.current.value - totalAmount))
    console.log(change)
  };



  const genBill = async function (e) {
    e.preventDefault();
    
    let quan = []
    for (let i of cartItems) {
      quan.push({
        _id: i._id,
        amount: i.quantity
      })
    }

    // console.log(quan)

    if (moneyref.current.value < totalAmount) {
      setErrorMessage("จำนวนเงินไม่ถูกต้อง");
      setAlertColor("error");
      console.log("XXXXXXXX");
    } else if (isNaN(+moneyref.current.value)) {
      setErrorMessage("จำนวนเงินไม่ถูกต้อง");
      setAlertColor("error");
    }
    else {
      const response = await fetch("https://posme.fun:2096/bills", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payment_method: "เงินสด",
          cash: moneyref.current.value,
          quantity: quan, // เอารูปแบบ array นี้มาใส่
        }),
        credentials: "include",
      });
      const data = await response.json();
      console.log(data);
      // navigate(`/bills/id/${data.bill_id}`, {
        //   // state: { total_amount: props.cash, money: money },
        //   state: { total_amount: totalAmount, money: money },
        // });
        // closeModal(false);
      setBillData(data);
      setFinishModal(true);
      };
    }
      

    // function computeChange(amount) {
    //   let result = [];
    //   const changeArray = [1000,500,100,50,20,10,5,2,1]
    
    //   for (let i = 0; i < changeArray.length; i++) {
    //     let changeAmount = Math.floor(amount / changeArray[i]);
    //     amount -= (changeArray[i] * changeAmount);
    
    //     result.push(changeAmount);
    
    //   }
    //   return result;
    // }


    function computeChange(coins, amount) {
      var coincount = [];
  
      var i = 0; var creminder = amount; var ccoin;
   
      while( i < coins.length )
      { 
        coincount[i] = 0;
        while ( coins[i] <= creminder )
        {
          creminder = creminder - coins[i];
          ccoin = coincount[i];
          ccoin += 1;
          coincount[i] = ccoin;
        }
        i++;
      }
  
      return coincount;
  }
  
  
  return (
    <div className="background">
      <div className="modal_container">
        <button className='close_btn' onClick={() => {closeModal(false); setShowSum(true); setChoosePayment(false)}}>
          <img className='close_add_btn_img' src={require('../../image/logo_err.png')} alt="close" />
        </button>
        <div className={styles.box}>
          <div className={styles.income}>
            {/* <form> */}
              <label for="inputcash">
                <h4>รับมา</h4>
              </label>
              <input
                className={styles.input3}
                id="inputcash"
                type='number'
                step="0.25"
                min = "0.00"
                inputMode="decimal"
                placeholder="ใส่จำนวนเงิน"
                ref={moneyref}
                onChange={getMoney}
              ></input>
              <label>
                <h4 className={styles.baht}>บาท</h4>
              </label>
          </div>
              <div>
                <div className={styles.spc_btw}>
                  <h4>ยอดสุทธิ</h4>
                  <h4>{totalAmount}</h4>
                  <h4>บาท</h4>
                </div>
                {invalidMoney && 
                <div className={styles.spc_btw}>
                  <h4><b>เงินทอน</b></h4> 
                  <h4><b>{moneyref.current.value - totalAmount}</b></h4> 
                  <h4><b>บาท</b></h4> 
                </div>}
                {invalidMoney && 
                <div className={styles.table}>
                  <Table striped bordered hover size="sm">
                    <thead>
                      <tr>
                        <th>เหรียญ / ธนบัตร (บาท)</th>
                        <th>จำนวน (เหรียญ / ใบ)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {change.map((each, i) => 
                        {
                          if (each > 0) {
                            return <tr>
                              <td>{coins[i]}</td>
                              <td>{each}</td>
                            </tr>
                          }
                        }  
                      )}
                    </tbody>
                  </Table>                
                </div>}
                {/* {money && <p>{money - props.cash}฿</p>} */}
              </div>

              <div className={styles.buttom}>
                {/* <input type="button" className={styles.button} onClick={getBill} value="แสดงใบเสร็จ"/> */}
                <Button
									type="button"
									variant="success"
                  size="lg"
                  onClick={genBill}>
                ยืนยันการชำระเงิน
                </Button>
                {/* <input type="button" className={styles.button} onClick={genBill} value="ยืนยัน"/> */}
              </div>
            {/* </form> */}
        </div>
      </div>
      {finishModal && <ModalFinish closeModal={closeModal} closeFinishModal={setFinishModal} bill_id={billData.bill_id} setCartItems={setCartItems} setShowSum={setShowSum} setChoosePayment={setChoosePayment}/>}
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
};
export default ModalCash;