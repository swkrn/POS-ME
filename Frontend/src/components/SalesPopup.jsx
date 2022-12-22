import {React,useState} from 'react'
import './styles/SalesPopup.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../image/sales.png'
import { Button } from 'react-bootstrap'

function Popup (Props) {
  const { closePopUp, total } = Props
  const [showModal, setShowModal] = useState(false)
  return (
    <div className='popupval'>
      <div onClick={() => setShowModal(true)}></div>
      <h1 className='value-total'>

      <Button className='closeButton'
          onClick={() => closePopUp(false)}>
          ปิด
      </Button>
          <img src={logo} alt="logo" className='popup-img'/>
            <h1>ยอดขายรวม</h1>
            <h1>{total} บาท</h1>
        </h1>
    </div>
  )
}

export default Popup