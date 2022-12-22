import React from 'react'
import Navbar from '../components/NavbarReport'
import { Navigate,Link } from 'react-router-dom'
import './styles/Report.css'
import Sales_logo from '../image/sales.png'
import BestSales_logo from '../image/bestseller.png'
import Receipt_logo from '../image/receipt.png'

function Reports() {
  return (
    <div>
      <Navbar/>
      <div className='color'>
        <div>
            <button className = "sales">
                <Link to="/store/reports/sales" className='font'>
                <img src = {Sales_logo} alt = "sales logo" className='salesimg'></img>
                 <div className='font-sales'>
                    ยอดขาย
                 </div>
                </Link>
            </button>
        </div>

        <div>
          <button className= 'best-seller'>
              <Link to="/store/reports/best_seller" className='font'>
              <img src = {BestSales_logo} alt ="" className='bestsellerimg'></img>
              <div className='font-bestseller'>
                  สินค้าขายดี
              </div>
              </Link>
          </button>
        </div>
        <div>   
          <button className='receipt'>
            <Link to="/store/reports/receipt" className='font'>
              <img src= {Receipt_logo} alt="" className='receiptimg'></img>
              <div className='font-receipt'>
                  ใบเสร็จ
              </div>
            </Link>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Reports