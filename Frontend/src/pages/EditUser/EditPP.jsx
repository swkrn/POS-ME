import React, {useState,useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import Navbar from '../../components/NavbarUserContent'
import axios from 'axios'
import { Button,Form } from 'react-bootstrap'
import './styles/EditPP.css'
import logo from '../../image/promptpay.png'

function EditPP() {
  const navigate = useNavigate();	
  const [paynumber,setPayNumber] = useState()
  const [pdata,setPdata] = useState("")

  const handlesubmit = async function(e) {
    e.preventDefault();
    const promtnum = {
      "promptpay_number": paynumber
    }
    console.log(promtnum)
    axios.put("https://posme.fun:2096/auth/edit",promtnum,{withCredentials : true})
    navigate("/store/users")
  }


  useEffect(() => {
    axios.get("https://posme.fun:2096/auth/user",
    {withCredentials : true}).then(
      (result) => 
      {setPdata(result.data)
      console.log(result.data)
      setPayNumber(result.data.promptpay_number)
    })
  },[])
  return (
    <div>
        <Navbar/>
        <div className='payment-page'>
            <div className='photo-payment'>
                <img src ={logo} alt = "logo" className='pay-logo' width='50%'/>
            </div>
            <div>
                <span className="p-text">
                    Promtpay Number
                </span>
            </div>
            <Form required onSubmit =  {handlesubmit}>
                <input defaultValue = {pdata.promptpay_number} className='new-number' type="tel" pattern="[0-9]{10}" placeholder = 'Ex.0812345678' onChange ={e => setPayNumber(e.target.value)}/>
                < input value="SAVE" type = 'submit' className='save-number'/>
            </Form>
        </div>
    </div>
  )
}

export default EditPP