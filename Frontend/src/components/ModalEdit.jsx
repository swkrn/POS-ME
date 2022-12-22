import React, { useRef } from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Snackbar, Alert } from "@mui/material"

function ModalEdit(props) {
    const {closeModal,arrayData,setArrayData} = props;
    const [arrayType, setArrayType] = useState([]);
    const barnum = useRef();
    const itemname = useRef();
    const itemprice = useRef();
    const itemdes = useRef();
    const navigate = useNavigate();
    const selecttype = useRef();
    let itemtypeid = arrayData.type_id;
    const [errorMessage, setErrorMessage] = useState(null);
    const [alertColor, setAlertColor] = useState("error");
    
    async function GetType() {
        const response1 = await fetch("https://posme.fun:2096/types", {
            method: "GET",
            credentials: "include",
        });
        const alltype = await response1.json();
        console.log(alltype);
        var filtered = alltype.filter(function(el) {return el.type_name !== arrayData.type_id});
        setArrayType(filtered);
        console.log(arrayType);
        const arr = [
            {type_name: 'none'},
        ];
        const arrType = [...filtered,...arr]
        if (itemtypeid !== "none") {
            setArrayType(arrType);
            console.log(arrayType);
            // setArrayType(filtered);
        }
    }
    
    useEffect(() => {
        GetType();
    },[])

      const handleChange = async function(e) {
        const typename = e.target.value;
        const response_typeid = await fetch("https://posme.fun:2096/types/name/"+typename, {
          method: "GET",
          credentials: "include",
        });
        const typeid = await response_typeid.json();
        console.log(e.target.value);
        if (e.target.value !== "0" && e.target.value !== "none") {
          itemtypeid = typeid._id;
        }
      }

    const submitHandler = async function (event) {
        event.preventDefault();
        const barcode_input = barnum.current.value;
        const itemname_input = itemname.current.value;
        const itemprice_input = itemprice.current.value;
        const itemdes_input = itemdes.current.value;
        console.log(selecttype.current.value)
        if (selecttype.current.value === "0") {
            const response = await fetch("https://posme.fun:2096/items/"+arrayData._id, {
            method: "PUT",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              barcode: barcode_input,
              name: itemname_input,
              price: itemprice_input,
              description: itemdes_input,
            }),
          });
          const data = await response.text();
          console.log(data);
          if (response.ok) {
            const response = await fetch("https://posme.fun:2096/items/"+arrayData._id, {
                method: "GET",
                credentials: "include",
            });
            const alldata = await response.json();
            console.log(alldata);
            if (alldata.type_id !== null) {
                const response2 = await fetch("https://posme.fun:2096/types/"+alldata.type_id,{
                    method: "GET",
                    credentials: "include",
                });
                const itemtype = await response2.json();
                console.log(itemtype);
                alldata.type_id = itemtype.type_name;
            }
            setArrayData(alldata);
            closeModal(false);
          }
          else {
            setErrorMessage("เลขบาร์โค้ดซ้ำกับรายการที่มีอยู่แล้ว")
            setAlertColor("error")
          }
        }
        else {
            if (selecttype.current.value === "none") {
                itemtypeid = null;
            }
            const response = await fetch("https://posme.fun:2096/items/"+arrayData._id, {
            method: "PUT",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              barcode: barcode_input,
              name: itemname_input,
              price: itemprice_input,
              description: itemdes_input,
              type_id: itemtypeid,
            }),
          });
          const data = await response.text();
          console.log(data);
          if (response.ok) {
            const response = await fetch("https://posme.fun:2096/items/"+arrayData._id, {
                method: "GET",
                credentials: "include",
            });
            const alldata = await response.json();
            console.log(alldata);
            if (selecttype.current.value !== "none") {

                const response2 = await fetch("https://posme.fun:2096/types/"+alldata.type_id,{
                    method: "GET",
                    credentials: "include",
                });
                const itemtype = await response2.json();
                console.log(itemtype);
                alldata.type_id = itemtype.type_name;
            }
            setArrayData(alldata);
            closeModal(false);
          }
          else {
            setErrorMessage("เลขบาร์โค้ดซ้ำกับรายการที่มีอยู่แล้ว")
            setAlertColor("error")
          }
        }
      };


    async function DeleteItem() {
        const del_res = await fetch("https://posme.fun:2096/items/"+arrayData._id, {
            method: "DELETE",
            credentials: "include",
        });
        const delres = await del_res.json();
        if (del_res.ok) {
            window.location.reload(false);
        }
    }

  return (
    <div className='background'>
        <div className="modal_container2">
        <button className='close_btn' onClick={() => {
                  closeModal(false);
                  }}>
                <img className='close_btn_img' src={require('../image/logo_err.png')} alt="close" />
            </button>
            <form action='#' onSubmit={submitHandler}>
                <h3>แก้ไขรายละเอียดสินค้า</h3>
                <div className='edit_detail'>
                    <label>หมายเลขบาร์โค้ด : </label>
                    <input id="barcode_num" ref={barnum} required pattern="[0-9]{13}" className='editinput' placeholder='หมายเลขบาร์โค้ด' type="tel" defaultValue={arrayData.barcode}></input>
                </div>
                <div className='edit_detail'>
                    <label>ชื่อสินค้า : </label>
                    <input id="item_name" ref={itemname} required className='editinput' placeholder='ชื่อสินค้า' type="text" defaultValue={arrayData.name}></input>
                </div>
                <div className='edit_detail'>
                    <label>ราคาต่อชิ้น : </label>
                    <input id='item_price' ref={itemprice} required className='editinput price_edit_input' step="0.25" min = "0.00" placeholder='ราคา' type="number" defaultValue={arrayData.price}></input>
                    <label>฿</label>
                </div>
                <div className='edit_detail'>
                    <label>รายละเอียดสินค้า : </label>
                    <input id='item_desc' ref={itemdes} className='editinput' placeholder='รายละเอียดสินค้า' type="text" defaultValue={arrayData.description}></input>
                </div>
                {/* <div className='edit_detail'>
                    <label>ประเภทสินค้า : </label>
                    <select ref={selecttype} className='editinput' onChange={handleChange}>
                        <option value="0">{arrayData.type_id}</option>
                        {React.Children.toArray(arrayType.map(eachtype =>
                            <option value={eachtype.index}>{eachtype.type_name}</option>
                        ))}
                    </select>
                </div> */}
                <div class="row g-3 align-items-center mb-3">
                  <div class="col-auto">
                    <label class="col-form-label">ประเภทสินค้า :</label>
                  </div>
                  <div class="col-auto">
                    <select ref={selecttype} className='form-select' onChange={handleChange}>
                      <option value="0">{arrayData.type_id}</option>
                      {React.Children.toArray(arrayType.map(eachtype => 
                        <option value={eachtype.index}>{eachtype.type_name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div class="d-grid gap-4 d-md-flex mb-3 mt-3">
                    {/* <input type='submit' className='accept_edit_btn' value="ยืนยันการแก้ไข" />
                    <input type='button' className='delete_item_btn' onClick={DeleteItem} value="ลบสินค้า"/> */}
                    <button type="submit" class="btn btn-success">ยืนยันการแก้ไข</button>
                    <button type="button" class="btn btn-danger" onClick={DeleteItem}>ลบสินค้า</button>
                </div>
            </form>
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
  )
}

export default ModalEdit