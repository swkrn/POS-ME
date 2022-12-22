import React, { useEffect } from 'react'
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/component.css'
import backIcon from '../image/backIcon.png'
import { useNavigate } from "react-router-dom";

function Navitem() {
  const navigate = useNavigate();
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
      if (!userData.ok) {
        navigate("/login")
      }
    }
    fetchData();
    //console.log(storeData.store_name)
  },[])
  return (
    <>
        <Navbar bg="warning" variant="dark" sticky="top">
          <Container>
            <Navbar.Brand href="/store/home">
              <div className='backIcon'>
                <img
                  alt="backIcon"
                  src={backIcon}
                  width="40"
                  height="40"
                  className="d-inline-block align-top"
                />{' '}
              </div>
            </Navbar.Brand>
            <div className='pagename'>
                Items
            </div>
            <Navbar.Brand>
              <div className='logout'>
                <a>
                  <button onClick={submitHandler} type='button' className="btn btn-danger">
                    logout
                  </button>{' '}
                </a>
              </div>
            </Navbar.Brand>
          </Container>
        </Navbar>
    </>
  );
}

export default Navitem;