import React from 'react'
import Navbar from '../components/NavbarUser'
import { Navigate,Link } from 'react-router-dom'
import './styles/user.css'
import profileLogo from '../image/logo_editProfile.png'
import passwordLogo from '../image/logo_editpass.png'
import ppLogo from '../image/promptpay.png'
import delLogo from '../image/logo_deletacc.png'

function Users() {
  return (
    <div>
      <Navbar/>
      <div className='user_button'>
        <Link to='/store/users/edit_profile' className='font'>
          <div className='bg-editbox'>
            <div className='edit-box'>
              <img src={profileLogo}
                   alt="Edit Profile" 
                   width="80"
                   className="resume-logo"/>
              <span> แก้ไขข้อมูลส่วนตัว </span>
            </div>
          </div>
        </Link>
        <Link to='/store/users/edit_password' className='font'>
          <div className='psswd-box'>
            <img src={passwordLogo}
                 alt="edit password" 
                 width='80'
                 className = "lock-photo2"/>
            <span className='psswd-text'> เปลี่ยนรหัสผ่าน </span>
          </div>
        </Link>
        <Link to="/store/users/edit_promptpay" className='font'>
          <div className='pp-box'>
            <img src={ppLogo}
                 alt="edit pp" 
                 width='80'
                 className='pay-logo2'/>
            <span> เปลี่ยนเบอร์ที่ผูกพร้อมเพย์ </span>
          </div>
        </Link>
        <Link to='/store/users/delete_profile' className='font'>
          <div className='delete-box'>
            <img src={delLogo}
            alt="delete acc" 
            width='80'
            className='bin-photo'/>
            <span> ลบบัญชีถาวร </span>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default Users