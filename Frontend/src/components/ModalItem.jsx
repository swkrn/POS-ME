import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useRef } from 'react';
import ModalEdit from './ModalEdit';
import "./styles/modalitem.css"
import Table from 'react-bootstrap/Table';


function ModalItem(props) {
  const {closeModal,itemID,setArrayItem} = props;
  const [arrayData,setArrayData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editItemID, setEditItemID] = useState("");

  // console.log(arrayData.type_id);
  if (arrayData.type_id === null) {
    arrayData.type_id = "none";
  }
  
  useEffect(() => {
    async function GetItemDetail() {
      const response = await fetch("https://posme.fun:2096/items/"+itemID, {
        method: "GET",
        credentials: "include",
      });
      const alldata = await response.json();
      // console.log(alldata);
      if (alldata.description === "" || alldata.description === undefined) {
        alldata.description = "ไม่มีข้อมูล";
      }
      if (alldata.type_id === null) {
        alldata.type_id = "none";
      }
      else {
        const response2 = await fetch("https://posme.fun:2096/types/"+alldata.type_id, {
          method: "GET",
          credentials: "include",
        });
        const typeres = await response2.json();
        alldata.type_id = typeres.type_name;
      }
      setArrayData(alldata);
      setEditItemID(alldata._id);
    }
    GetItemDetail();
  },[])

  async function handleCloseModal()  {
        const response3 = await fetch("https://posme.fun:2096/items", {
          method: "GET",
          credentials: "include",
        });
        const alldata = await response3.json();
        setArrayItem(alldata);
  }

  return (
    <div className='background'>
        <div className="modal_container">
            <button className='close_btn' onClick={() => {
                  handleCloseModal();
                  closeModal(false);
                  }}>
                <img className='close_btn_img' src={require('../image/logo_err.png')} alt="close" />
            </button>
            <div className="title">
                <h1>{arrayData.name}</h1>
            </div>
            {/* <div className="modal_detail">
              <p className="item_label">หมายเลขบาร์โค้ด :</p> 
              <p className="item_data">{arrayData.barcode}</p>
            </div>
            <div className="modal_detail">
              <p className="item_label">ชื่อสินค้า :</p> 
              <p className="item_data">{arrayData.name}</p>
            </div>
            <div className="modal_detail">
              <p className="item_label">ราคาต่อชิ้น :</p> 
              <p className="item_data">{arrayData.price}  บาท</p>
            </div>
            <div className="modal_detail">
              <p className="item_label">รายละเอียดสินค้า :</p> 
              <p className="item_data">{arrayData.description}</p>
            </div>
            <div className="modal_detail">
              <p className="item_label">ประเภทสินค้า :</p> 
              <p className="item_data">{arrayData.type_id}</p>
            </div> */}
            <Table striped bordered hover>
              <tbody>
                <tr>
                  <td><b>หมายเลขบาร์โค้ด</b></td>
                  <td>{arrayData.barcode}</td>
                </tr>
                <tr>
                  <td><b>ชื่อสินค้า</b></td>
                  <td>{arrayData.name}</td>
                </tr>
                <tr>
                  <td><b>ราคาต่อชิ้น</b></td>
                  <td>{arrayData.price} บาท</td>
                </tr>
                <tr>
                  <td><b>รายละเอียดสินค้า</b></td>
                  <td>{arrayData.description}</td>
                </tr>
                <tr>
                  <td><b>ประเภทสินค้า</b></td>
                  <td>{arrayData.type_id}</td>
                </tr>
              </tbody>
            </Table>   
            <div className='btn_container'>
              <button className='edit_btn' onClick={() => {setOpenModal(true);}}>
                แก้ไขรายละเอียดสินค้า
              </button>
            </div>
        </div>
        {openModal && <ModalEdit closeModal={setOpenModal} arrayData={arrayData} setArrayData={setArrayData}/>}
    </div>
  )
}

export default ModalItem