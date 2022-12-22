import React, { useRef } from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import check from '../../image/checked.png'
import styles from "./modalFinish.module.css";

function ModalFinish(props)  {
    const {closeModal, closeFinishModal, bill_id, setCartItems, setShowSum, setChoosePayment} = props;
    // console.log(bill_id);
    
  useEffect(() => {
    // closeModal(false)
  }, [])

  useEffect(() => {
    setCartItems([])
  })

  return (
    <div className='background'>
        <div className="modal_container4">
            {/* <button className='close_btn' onClick={() => {closeFinishModal(false);}}>
              <h1>x</h1>
            </button> */}
      
            <div className={styles.finish_text}>
              <h3>ชำระเงินเรียบร้อย</h3>
            </div>
            <img className={styles.finish_img} src={check} alt='check' />
            <div>
              <Button
                type="button"
                size="lg"
                variant="outline-primary"
                className={styles.button_1}
                onClick={(e) => {
                  e.preventDefault();
                  closeModal(false);
                  window.open('https://posme.fun:8443/receipt/id/' + bill_id, "_blank");
                  // window.location.href='https://posme.fun:8443/receipt/id/' + bill_id;
                }}
                >แสดงใบเสร็จ</Button>
              <Button size="lg" onClick={() => {closeFinishModal(false);
                                      closeModal(false) ; setShowSum(true); setChoosePayment(false)}}>เสร็จสิ้น</Button>
            </div>
            {/* <button onClick={closeFinishModal(false)}>เสร็จสิ้น</button> */}

        </div>
    </div>
  )
}

export default ModalFinish