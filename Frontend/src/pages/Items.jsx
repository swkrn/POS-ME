import React, { useRef,useEffect,useState } from 'react'
import {Navigate,Link} from 'react-router-dom'
import Navbar from '../components/NavbarItem'
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/Item.css'
import ModalItem from '../components/ModalItem';
import CamModal from '../components/scanner/CamModal';
import Modal from '../components/Modal';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import InputLabel from '@mui/material/InputLabel';

import Button from 'react-bootstrap/Button';
// import InputLabel from '@mui/material/InputLabel';
// import MenuItem from '@mui/material/MenuItem';
// import FormControl from '@mui/material/FormControl';
// import Select from '@mui/material/Select';

function Items() {
  const [arrayItem,setArrayItem] = useState([]);
  const [openModalType, setOpenModalType] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [itemID, setItemId] = useState("");
  const [camModal, setCamModal] = useState(false);
  const barnum = useRef();
  const [scanBarNum,setScanBarNum] = useState("");
  const [arrayType,setArrayType] = useState([]);
  const filType = useRef();

  const [selectedType, setSelectedType] = useState({});
  const handleChangeType = (event) => {
    setSelectedType(event.target.value);
  };

  useEffect(() => {
    async function GetAllItem() {
      const response1 = await fetch("https://posme.fun:2096/items", {
          method: "GET",
          credentials: "include",
        });
        const alldata = await response1.json();
        // console.log(alldata);
        setArrayItem(alldata);
    }
    GetAllItem();
    async function GetAllType() {
      const response2 = await fetch("https://posme.fun:2096/types", {
        method: "GET",
        credentials: "include",
      });
      const alltype = await response2.json();
      // console.log(alltype);
      setArrayType(alltype);
    }
    GetAllType();
  },[])

  function PassName(itemid) {
    setItemId(itemid);
  }

  const handleChange = async function () {
    console.log(barnum.current.value);
    console.log(filType.current.value);
    const response_typeid = await fetch("https://posme.fun:2096/types/name/"+filType.current.value, {
      method: "GET",
      credentials: "include",
    });
    const typeid = await response_typeid.json();
    console.log(typeid);
    const response2 = await fetch("https://posme.fun:2096/items/filter", {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              keyword : barnum.current.value,
              type_id : typeid,
            }),
          });
          const data = await response2.json();
          console.log(data);
          setArrayItem(data);
  }
  return (
    <div>
      <Navbar/>
      <div className="mid">
        <div className="search_container">
          <div >
            <div  >
              <Paper
                component="form"
                sx={{ p: '2px 4px', m: 2, display: 'flex', alignItems: 'center', width: 400 }}
              >
                <div style={{display: 'inline'}}>
                <IconButton sx={{ p: '10px' }} aria-label="search">
                    <SearchIcon />
                </IconButton>
                  <InputBase
                    sx={{ml: 0.5, mr: 4, flex: 1, p: 1 }}
                    placeholder="ค้นหา ชื่อ / บาร์โค้ด"
                    inputRef={barnum}
                    onChange={handleChange}
                  />
                {/* <Divider sx={{ height: 1, m: 0.2}} orientation="vertical" /> */}
                  <IconButton color="primary" sx={{ p: '10px' }} aria-label="scan-barcode" onClick={() => {
                          setCamModal(true);
                        }}>
                      <img className='scanner_btn_img' src={require('../image/barcode-scanner.png')}/>
                  </IconButton>   
              </div>  
              
                
              </Paper>
            </div>

          {/* <input className='search' ref={barnum} type="text" placeholder="Search..." onChange={handleChange}/>
          <button className='scanner_btn_Item'  
                onClick={() => {
                  setCamModal(true);
                }}>
                <img className='scanner_btn_img' src={require('../image/barcode-scanner.png')}/>
          </button> */}
          
          <div className='container mb-4' style={{width: '100%'}}>
            <div className="row ">
              <div className='col-2'>
                <label className='filter_label'> ประเภท </label>
              </div>
              <div className='col-8'>
                <select className='form-select' ref={filType} onChange={handleChange}>
                  <option value="0">ทั้งหมด</option>
                  {React.Children.toArray(arrayType.map(eachtype => 
                  <option value={eachtype.index}>
                    {eachtype.type_name}
                  </option>
                  ))}
                </select>
              </div>
              <div className='col-2'>
                <Button
                  variant="light"
                  onClick={() => {
                    setOpenModalType(true);
                  }}>
                      🖊️
                </Button>
              </div>
            </div>         
          </div>
          </div>
        
        </div>
          {React.Children.toArray(arrayItem.map(eachItem => 
            <div className="container-sm">
              <div className="mb-1">
                <Card>
                    <CardContent>
                      <div className='containter' onClick={() => {
                              window.scrollTo(0,0);
                              PassName(eachItem._id);
                              setOpenModal(true);
                            }}>
                              <div className='row'>
                                <div className='col-4'>
                                  <Typography color="text.secondary">
                                  {eachItem.barcode}
                                  </Typography>
                                </div>
                                <div className="col-6">
                                  <Typography component="div">
                                    {eachItem.name}
                                  </Typography>
                                </div>
                                <div className='col-2'>
                                  <Typography color="text.secondary">
                                  {eachItem.price.toFixed(2)} บาท
                                  </Typography>
                                </div>                             
                              </div>
                      </div> 
                    </CardContent>
                  </Card>
              </div>
                
            </div>
            
                  
            ))}
            {openModal && <ModalItem closeModal={setOpenModal} itemID={itemID} setArrayItem={setArrayItem}/>}
      </div>
      <Link to={'/store/items/additem'}>
        <img className='add_button' src={require('../image/plus.png')} alt='Add-Item'/>
      </Link>
        {openModalType && <Modal 
            closeModal={setOpenModalType}
            setEditArrayType={setArrayType} 
            />} 
        
        {camModal && <CamModal 
            closeModal={setCamModal}
            setScanBarNum={setScanBarNum}
            barnum={barnum}
            setArrayItem={setArrayItem}
            />} 
    </div>
  )
}

export default Items