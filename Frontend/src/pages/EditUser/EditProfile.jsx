import React, { useEffect,useState } from 'react'
import {useNavigate} from 'react-router-dom'
import Navbar from '../../components/NavbarUserContent'
import './styles/EditProfile.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'
import { Button,Form } from 'react-bootstrap'
import logo from '../../image/logo_editProfile.png'

function EditProfile() {
  const navigate = useNavigate();	
  const [eusername,setEUsername] = useState("")
  const [estorename,setEStorename] = useState("")
  const [eaddress,setEAddress] = useState("")
  const [efname,setEFname] = useState("")
  const [elname,setELname] = useState("")
  const [email,setEMail] = useState("")
  const [etax,setETax] = useState("")
  const [edata,setEdata] = useState("")


  useEffect (() => {
    axios.get("https://posme.fun:2096/auth/user",
      {withCredentials: true}
    ).then((result) =>{
      setEdata(result.data)
      setEStorename(edata.store_name)
      setEAddress(edata.address)
      setEFname(edata.f_name)
      setELname(edata.l_name)
      setEMail(edata.email)
      setETax(edata.tax_id)
    })
  },[])

  useEffect (() => {
    axios.get("https://posme.fun:2096/auth/user",
      {withCredentials: true}
    ).then((result) =>console.log(result.data))
    
  },[])

  let u = edata.username

  const handlesubmit = async function (e) {
    e.preventDefault();
    const euser = {
      "username" : eusername,
      "f_name": efname,
      "l_name": elname,
      "store_name": estorename,
      "address": eaddress,
      "email": email,
      "tax_id": etax,
    }
    console.log(euser)
    axios.put("https://posme.fun:2096/auth/edit",euser,{withCredentials: true})
    navigate("/store/users")
  }

  return (
    <div>
        <Navbar/>
        <div className='editpf'>
            <img src = {logo} alt = "logo" className = "resume-page-logo" width="20%"/>'
            <div className="e-info">
                <span className="fix-u-text">ชื่อบัญชีผู้ใช้ : {edata.username} </span>
            </div>
            <Form onSubmit = {handlesubmit}>
                <div className="e-info">
                    <span className="u-text">ชื่อร้านค้า (Store Name)</span>
                    <input defaultValue= {edata.store_name} className='e-storename' required placeholder='ชื่อร้านค้า' onChange = {e => setEStorename(e.target.value)}/>
                </div>
                <div className="e-info">
                    <span className="u-text">ที่อยู่ร้านค้า (Address)</span>
                    <textarea defaultValue= {edata.address}row="3" className='e-address' required placeholder='ที่อยู่' onChange = {e => setEAddress(e.target.value)}/>
                </div>
                <div className="e-info" >
                    <span className="u-text">ชื่อจริง (Firstname)</span>
                    <input defaultValue= {edata.f_name} className='e-fname' type = "text" pattern = "^[a-zA-Z]*$" required placeholder='ชื่อจริง (ภาษาอังกฤษ)' onChange = {e => setEFname(e.target.value)}/>
                </div>
                <div className="e-info">
                    <span className="u-text">นามสกุล (Lastname)</span>
                    <input defaultValue= {edata.l_name} className='e-lname'  type = "text" pattern = "^[a-zA-Z]*$" required placeholder='นามสกุล (ภาษาอังกฤษ)' onChange = {e => setELname(e.target.value)}/>
                </div>
                <div className="e-info">
                    <span className="u-text">อีเมลล์ (Email)</span>
                    <input defaultValue= {edata.email} className='e-mail' required pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$" placeholder='hello@aol.com' onChange = {e => setEMail(e.target.value)}/>
                </div>
                <div className="e-info">
                    <span className="u-text">หมายเลขประจำตัวผู้เสียภาษี (Tax number)</span>
                    <input defaultValue= {edata.tax_id} className='e-tax' required placeholder='เลขประจำตัวผู้เสียภาษี 13 หลัก'  type="tel" pattern="[0-9]{13}" onChange={e => setETax(e.target.value)}/>
                </div>
                <button className='btn btn-warning btn-lg save-editpage' type = 'submit'>
                    SAVE
                </button>
            </Form>
        </div>
    </div>
  )
}

export default EditProfile