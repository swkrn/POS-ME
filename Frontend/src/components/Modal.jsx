import React from 'react'
import { useRef } from 'react';
import "./styles/modal.css"
import { useState } from 'react';
import { useEffect } from 'react';
import { Snackbar, Alert } from "@mui/material"

function Modal(props) {
  const typeitem = useRef();
  const [arrayType,setArrayType] = useState([]);
  const [editType, setEditType] = useState(null);
  const [errAdd, setErrAdd] = useState(false);
  const [errtext, setErrtext] = useState();

  const newType = useRef();



  const [errorMessage, setErrorMessage] = useState(null)
  const [alertColor, setAlertColor] = useState("error")

  const submitHandler = async function (event) {
    event.preventDefault();
    const typeitem_input = typeitem.current.value;
    const response = await fetch("https://posme.fun:2096/types", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type_name: typeitem_input,
        }),
      });
      const data = await response.text();
    //   console.log(data);
      setErrtext(response.status);
    //   console.log(errtext);
      if (response.ok) {
        // window.location.reload(false);
        // props.closeModal(false);
      }
      else {
        setErrAdd(true);
        // console.log(errAdd);
        setErrorMessage("รายการสินค้าซ้ำกับรายการที่มีอยู่แล้ว")
        setAlertColor("error")
      }
      GetAllType();
  }
  
  const DeleteInputValue = () => {
    typeitem.current.value = "";
  }
  async function GetAllType() {
    const response2 = await fetch("https://posme.fun:2096/types", {
      method: "GET",
      credentials: "include",
    });
    const alltype = await response2.json();
    // console.log(alltype);
    setArrayType(alltype);
    props.setEditArrayType(alltype);
    DeleteInputValue();
  }

  useEffect(() => {
    GetAllType();
  },[])

  async function DeleteType(type_id) {
    await fetch("https://posme.fun:2096/types/"+type_id, {
      method: "DELETE",
      credentials: "include",
    });
    GetAllType();
  }

  async function updateType(typeold,typenew) {
    console.log(typeold);
    console.log(typenew);
    if (typeold == typenew || typenew == "") {
      setEditType(null);
    }
    else {

      const response3 = await fetch("https://posme.fun:2096/types/edit/"+typeold+"/"+typenew, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          
        }),
      });
      if (response3.ok) {
        setEditType(null);
        GetAllType();
      } else {
        setErrorMessage("ประเภทสินค้าซ้ำกับประเภทที่มีอยู่")
        setAlertColor("error")
      }
    }
  }
    


  console.log(editType);
  console.log(editType==null);

  return (
    <div className='background'>
        <div className="modal_container d-flex flex-column">
            <button className='close_add_btn' onClick={() => {
                  props.closeModal(false);
                  }}>
                <img className='close_add_btn_img' src={require('../image/logo_err.png')} alt="close" />
            </button>
            <div className="title">
                <h1>ประเภทสินค้า</h1>
            </div>
            {React.Children.toArray(arrayType.map((eachType, i) => {
              if (i != editType || editType == null) {
                return <div className='type'>
                  <div className='type_item'>
                    <p className="type_name">{eachType.type_name}</p>
                    <button className="btn_del" onClick={() => DeleteType(eachType._id)}>
                      <img className='btn_img' src={require('../image/logo_deletacc.png')} alt='Delete' />
                    </button>
                    <button className="btn_del" onClick={() => setEditType(i)}>
                      <img className='btn_img' src={require('../image/pencil.png')} alt='Edit' />
                    </button>
                  </div> 
                </div>
              }
              else {
                return <div className='type'>
                  <div className="type_item">
                    <label className='edit_type_label'>แก้ไข : </label>
                    <input className="type_name" ref={newType} placeholder={eachType.type_name} defaultValue={eachType.type_name}/>
                    <button className="btn_del" onClick={() => updateType(eachType.type_name,newType.current.value)}>
                        <img className='btn_img' src={require('../image/checked.png')} alt='Edit' />
                      </button>
                  </div> 
                </div> 
              }
            }
            
              
              
              
              
              ))}
            <form action='#' onSubmit={submitHandler}>
              <div className="add_type">
                  <input 
                    className='input_add_type'
                    id='new_type' 
                    type="text" 
                    placeholder='เพิ่มประเภทสินค้า'
                    required
                    ref={typeitem}
                    >
                  </input>
                  <div className="submit">
                    <button className='submit_btn' onClick={() => GetAllType}>
                      <img className='submit_btn_img' src={require('../image/plus_green.png')} alt="add type" />
                    </button>
                  </div>
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

export default Modal