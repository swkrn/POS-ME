import {React, useReducer, useRef, useState} from 'react'
import './Cashier/cashier.css'
import Navcashier from '../components/NavbarCashier'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ListGroup from 'react-bootstrap/ListGroup'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import ModalAddCart from '../components/cashier/ModalAddCart'
import ScannerCart from '../components/scanner/ScannerCart'
import { useEffect } from 'react'
import ModalCash from '../components/cashier/ModalCash'
import ModalPromptpay from '../components/cashier/ModalPromptpay'

function Cashier() {
  const [cartItems, setCartItems] = useState([])
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  //button
  const [choosePayment, setChoosePayment] = useState(false);
  const [emptyCart, setEmptyCart] = useState(false);
  const [scanning, setScanning] = useState(false);


  //summaryCard
  const [showSum, setShowSum] = useState(true);


  const [results, setResults] = useState("");

  //modal
  const [modalAddCart, setModalAddCart] = useState(false);
  const [paymentByCash, setPaymentByCash] = useState(false);
  const [modalPromptpay, setModalPromptpay] = useState(false);


  const scannerRef = useRef(null);

  const CheckEAN = (ean) => {
    var checkSum = ean.split('').reduce(function(p,v,i) {
        return i % 2 === 0 ? p + 1 * v : p + 3 * v;
    }, 0);

    if (checkSum % 10 !== 0) {
        console.log("invalid barcode number")
    } else {
        setResults(ean);
        AddByBarcode(ean)
    }
  }

  useEffect(() => {
	if (cartItems.length !== 0) {
		setEmptyCart(true);
	}
	else {
		setEmptyCart(false);
		setChoosePayment(false);
	}
  })


  const sleep = ms => new Promise(
    resolve => setTimeout(resolve, ms)
  );


  const AddByBarcode = async (ean) => {
    const response = await fetch("https://posme.fun:2096/items/barcode/" + ean, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        }
      });
    const item = await response.json();
    if (item !== null) {
      let new_in_cart = {
        _id: item._id,
        name: item.name,
        price: item.price,
        quantity: 1
      }
	  sleep((Math.random() * (750 - 100) + 100))
      if (cartItems.every( vendor => vendor['_id'] !== new_in_cart._id )) {
        setCartItems(prev => [...prev, new_in_cart]);
      }
    }
	}

	const handleClick = () => {
		setChoosePayment(true);
	}

	const OpenCashPayment = () => {
		setPaymentByCash(true);
		console.log(paymentByCash);
	}


  return (
    <>
      <Navcashier/>

      <div>
      <div className='position-sticky cashier-body'>
        <div className="d-grid mt-sm-2 mb-sm-2 m-1">
            <Button
              type="button"
							size="lg"
              variant="warning"
              className="cam-space"
              onClick={() => {
                if (!scanning) {
                  setScanning(!scanning)
                }
              } }>
              <div ref={scannerRef} className="scanner-cart">
                        {scanning ? <ScannerCart scannerRef={scannerRef} onDetected={(result) => CheckEAN(result)} /> : <i className="fas fa-barcode fa-5x"></i>}
              </div>
            </Button>
              
        </div>
        <div className="d-grid mt-sm-2 mb-sm-2 m-1">
          <Button
            type="button"
			className="add-button"
            size="lg"
            variant="warning"
            onClick={() => {
              setModalAddCart(true);
            }}>
            เพิ่มสินค้า
          </Button>
        </div>
      </div>
				
			<Row>
				<Col>
						<ListGroup>
							{cartItems.map((item) => (
								<ListGroup.Item key={item._id}>
									<Row className="align-items-center item-group">
										<Col md={4}>
											{item.name}
										</Col>
                    <Col md={2} justify-content style={{color: "gray"}}>
											 <div>฿ {item.price}</div>
										</Col>
										<Col md={3}>
											<Button
												onClick={() => {
                          if (item.quantity >=2 ) item.quantity = item.quantity - 1;
                          else if (item.quantity <=1 ) {
                            setCartItems(cartItems.filter((v) => {
                              return item !== v
                            }))
                          }
                          forceUpdate();
                          console.log(item.quantity)
                        }}
												variant="light"
											>
												<i className="fas fa-minus-circle"></i>
											</Button>{' '}
											<span>{item.quantity}</span>{' '}
											<Button
												variant="light"
												onClick={() => {
                          item.quantity = item.quantity + 1
                          forceUpdate();
                          console.log(item.quantity)
                        }}
											>
												<i className="fas fa-plus-circle"></i>
											</Button>
										</Col>	
                    <Col md={2} justify-content-end>
											฿ {item.price * item.quantity}
										</Col>
										<Col md={1}>
											<Button
												onClick={() =>
                          setCartItems(cartItems.filter((v) => {
                            return item !== v
                          }))
												}
												variant="light"
											>
												<i className="fas fa-trash"></i>
											</Button>
										</Col>
									</Row>
								</ListGroup.Item>
							))}
						</ListGroup>
				</Col>
				<div className="d-grid mt-sm-2 fixed-bottom">
					<Row>
						<Col>
							{ showSum && <Card>
								<Card.Body>
									<ListGroup variant="flush">
										<ListGroup.Item>
											<div className="d-flex justify-content-between">
												<h3>
													ยอดสุทธิ (
													{cartItems.reduce(
														(a, c) =>
															a + c.quantity,
														0
													)}{' '}
													ชิ้น)
												</h3>
												<h3>
													{cartItems.reduce(
														(a, c) =>
															a +
															c.price *
																c.quantity,
														0
													)}{' '}
													บาท
												</h3>
											</div>
										</ListGroup.Item>
										<ListGroup.Item>
											<div className="d-grid">
												{emptyCart && !choosePayment && <Button
													type="button"
													variant="primary"
                          size="lg"
													onClick={handleClick}
												>
													ชำระเงิน
												</Button>}
												{choosePayment && 
												<div className="d-grid">
													<Button className="mb-sm-2" onClick={() => setPaymentByCash(true)} type='button' variant="success" size="lg" >ชำระด้วยเงินสด</Button>
													<Button type='button' onClick={() => setModalPromptpay(true)} variant="primary" size="lg" >ชำระด้วยพร้อมเพย์</Button>
												</div>
												}
											</div>
										</ListGroup.Item>
									</ListGroup>
								</Card.Body>
							</Card>}
						</Col>
					</Row>
				</div>
			</Row>
      {modalAddCart && <ModalAddCart
            closeModal={setModalAddCart}
            cartItems={cartItems}
            setCartItems={setCartItems}
			setChoosePayment={setChoosePayment}
			setShowSum={setShowSum}
      />} 
	  {paymentByCash && <ModalCash
        	cartItems={cartItems}
	  		totalAmount={cartItems.reduce((a, c) => a + c.price * c.quantity,0)}
	  		closeModal={setPaymentByCash}
			  setCartItems={setCartItems}
			  setChoosePayment={setChoosePayment}
			  setShowSum={setShowSum}
			/>}
    {modalPromptpay && <ModalPromptpay
			cartItems={cartItems}
	  		totalAmount={cartItems.reduce((a, c) => a + c.price * c.quantity,0)}
	  		closeModal={setModalPromptpay}
			  setCartItems={setCartItems}
			  setChoosePayment={setChoosePayment}
			  setShowSum={setShowSum}
			/>}
		</div>
    </>
  )
}

export default Cashier