import React from 'react'
import { Navigate } from 'react-router-dom'
// import MediaQuery from 'react-responsive'
import Navhome from '../components/Navbarhome'
import './styles/Home.style.css'
import cashierButton from '../image/cashierButton.png'
import itemButton from '../image/itemButton.png'
import reportButton from '../image/reportButton.png'
import usersButton from '../image/usersButton.png'

function Home() {
  return (
    <>
      <Navhome />
        <div className='menu'>
          <div className='OutLineMenu'>
            <div className='Upper'>
              <a className='buttonMenu' href='/store/cashier'>
                <img
                  alt=""
                  src={cashierButton}
                  width="150"
                  height="150"
                  className="d-inline-block align-top"
                  />
              </a>
              <a className='buttonMenu' href='/store/items'>
                <img
                  alt=""
                  src={itemButton}
                  width="150"
                  height="150"
                  className="d-inline-block align-top "
                  />
              </a>
            </div>
            <div className='Lower'>
              <a className='buttonMenu' href='/store/reports'>
                <img
                  alt=""
                  src={reportButton}
                  width="150"
                  height="150"
                  className="d-inline-block align-top"
                />
              </a>
              <a className='buttonMenu' href='/store/users'>
                <img
                  alt=""
                  src={usersButton}
                  width="150"
                  height="150"
                  className="d-inline-block align-top"
                />
              </a>
            </div>
          </div>
        </div>
    </>
    
  )
}

export default Home