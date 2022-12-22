import React, { useRef } from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import Scanner from './Scanner';
import Result from './Result';
import './styles/cammodal.css'
import Button from 'react-bootstrap/Button';


function CamModal(props)  {
    const {closeModal, setScanBarNum,barnum,setArrayItem} = props;
    const [scanning, setScanning] = useState(false);
    const [results, setResults] = useState("");
    const scannerRef = useRef(null);

    const checkEAN = (ean) => {
        var checkSum = ean.split('').reduce(function(p,v,i) {
            return i % 2 === 0 ? p + 1 * v : p + 3 * v;
        }, 0);
  
        if (checkSum % 10 !== 0) {
            console.log("invalid barcode number")
        } else {
            setResults(ean);
            setScanBarNum(ean);
            barnum.current.value = ean;
            SearchFromBarNum(ean);
            closeModal(false);
        }
    }

    async function SearchFromBarNum(ean) {
        const response2 = await fetch("https://posme.fun:2096/items/filter", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          keyword : ean
        }),
      });
      const data = await response2.json();
      console.log(data);
      setArrayItem(data);
    }



  return (
    <div className='background'>
        <div className="modal_container2">
        <button className='close_btn' onClick={() => {closeModal(false);}}>
            <img className='close_btn_img' src={require('../../image/logo_err.png')} alt="close" />
        </button>
                <div>
                    <div className='d-grid gap-2 col-6 mx-auto'>
                        <Button variant="warning" onClick={() => setScanning(!scanning) }>{scanning ? 'Stop Camera' : 'Start Camera'}</Button>
                    </div>
                    <h1>{results}</h1>
                    {/* <ul className="results">
                        {results.map((result) => (result.codeResult && <Result key={result.codeResult.code} result={result} />))}
                    </ul> */}
                    {/* <div ref={scannerRef} style={{position: 'relative', border: '3px solid red'}}> */}
                    <div ref={scannerRef}>
                        {/* <canvas className="drawingBuffer" style={{
                            position: 'absolute',
                            top: '0px',
                            // left: '0px',
                            // height: '100%',
                            // width: '100%',
                            border: '3px solid green',
                        }} width="640" height="480" /> */}
                        {/* <canvas className="drawingBuffer" width="640" height="480" /> */}
                        {scanning ? <Scanner scannerRef={scannerRef} onDetected={(result) => checkEAN(result)} /> : null}
                    </div>
                </div>
        </div>
    </div>
  )
}

export default CamModal