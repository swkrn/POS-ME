import React, {useEffect, useState} from 'react'
import Navbar from '../../components/NavbarUserContent'
import { Button } from 'react-bootstrap'
import './styles/DeleteUser.css'
import {Link,useNavigate,Navigate} from 'react-router-dom'
import axios from 'axios'
import logo from '../../image/logo_deletacc.png'

function DeleteUser() {
  const [passwordInfo, setPasswordInfo] = useState("")
  const [eyeicon, setEyeIcon] = useState('FaEye')
  const [type, setType] = useState('password')
  const [delclick,setDelclick] = useState(0)
  const navigate = useNavigate();

  const handlesubmit = () =>{
    axios.delete("https://posme.fun:2096/auth/user",{withCredentials : true})
    localStorage.removeItem('isLoggedIn')
  }

  return (
    <div>
        <Navbar/>
        <div>
            <div className='delete-page'>
                <img src={logo} alt = " " className = 'delete-page-photo'/>
                <div className='delete-text'>
                    <i> 
                        ยืนยันที่จะลบบัญชีผู้ใช้ใช่หรือไม่?
                    </i>
                </div>
                <Link to = '/store/users'>
                    <Button className='delete-backbutt'>
                        ย้อนกลับ
                    </Button>
                </Link>
                <Link to = '/'>
                    <Button onClick={handlesubmit} className='delete-deletebutt'>
                        ลบบัญชี
                    </Button>
                </Link>
            </div>
        </div>
    </div>
  )
}

export default DeleteUser