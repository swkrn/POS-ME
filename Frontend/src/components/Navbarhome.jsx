import React from 'react'
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/component.css'
import posmeLogoL from '../image/logoLarge.png'
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Navhome() {
  const navigate = useNavigate();
  const [storeData, setStoreData] = useState([])
  const submitHandler = async function (e) {
    e.preventDefault();
  
    try {
      const response = await fetch("https://posme.fun:2096/auth/logout",{
        credentials: 'include',
        method: "POST",
      });
      const data = await response.json();
    }
    catch (err) {
      console.log("Not Login");
    }
    navigate("/")
  };

  useEffect(() => {
    const fetchData = async () => {
      const userData = await fetch("https://posme.fun:2096/auth/user",{
        method: "GET",
        credentials: 'include',
      });
      const userInfo = await userData.json();
      //console.log(userInfo);
      setStoreData(userInfo)
      if (!userData.ok) {
        navigate("/login")
      }
    }
    fetchData();
    //console.log(storeData.store_name)
  },[])
  
  return (
    <div>
      <Navbar bg="warning" variant="dark" sticky="top">
        <Container>
          <Navbar.Brand href="/store/home">
            <div className='name'>
              <img
                alt="app-logo"
                src={posmeLogoL}
                width="132.2"
                height="40"
                className="d-inline-block align-top"
              />{' '}
            </div>
          </Navbar.Brand>
          <Navbar.Brand>
            <div className='logout'>
              ร้าน {' '}{' '}{storeData.store_name} {' '}
              <a>
                <button onClick={submitHandler} type='button' className="btn btn-danger">
                  logout
                </button>{' '}
              </a>
            </div>
          </Navbar.Brand>
        </Container>
      </Navbar>
    </div>
  );
}

export default Navhome;