import React, { useRef, useState } from 'react'
import ReactDOM from 'react-dom'

import useWebcam from './useWebcam'
import useModel from './useModel'
import useBoxRenderer from './useBoxRenderer'
import axios from 'axios';

import styles from './styles.module.css'

const MODEL_PATH = process.env.PUBLIC_URL + '/model_web'
let  loadingName = true;
let  loadingAddress = true;
let  loadingID = true;

const App = () => {
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [fullID, setFullID] = useState('');

  //const [loadingName, setLoadingName] = useState(false);
  const videoRef = useRef()
  const canvasRef = useRef()

  const cameraLoaded = useWebcam(videoRef)
  const model = useModel(MODEL_PATH)

  const onNameReset = () => {
    loadingName = true;
    
    // console.log(fullName + loadingName);


    // if (data.fullName == '') alert('full name is empty');
    // else alert('full name is NOT')
  }

  const onFullIDReset = () => {
    loadingID = true;
   // setData({ ...data, fullID: '' });
  }

  const onAddressReset = () => {
    loadingAddress = true;

   // setData({ ...data, address: '' });
  }
  // imgString.substring(23, imgString.length)

  const trigger = (img, name) => {
    console.log(name + ' AND ' + loadingName);
    var imgString = String(img);
    // console.log(name + loadingName);
    if (name == 'Name' && loadingName == true) {
      axios.post('http://localhost:8080/', {
        image: imgString,//.substring(23, imgString.length),
        name: 'name'
      }).then((result) => {
        //console.log('RECIEVED MSG');
        console.log(result);
        if (result.data) {
          // loadingName = false;
          //console.log(result.data)

          setFullName(result.data);
          // alert('Changed name to ' + result.data + ' and loading is ' + loadingName);
        }
      }).catch((error) => {
        //console.log('ERROR ' + error);
      });
    }
    else if (name == 'Address' && loadingAddress == true) {
      axios.post('http://localhost:8080/', {
        image: imgString,//.substring(23, imgString.length),
        name: 'address'
      }).then((result) => {
        if (result.data) {
          // loadingAddress = false;
          setAddress(result.data);
        }
      }).catch((error) => {
        // console.log('ERROR ' + error);
      });
    }
    else if (name == 'FullID' && loadingID == true) {
      axios.post('http://localhost:8080/', {
        image: imgString,//.substring(23, imgString.length),
        name: 'fullid'
      }).then((result) => {
        if (result.data) {
          loadingID=false;
          console.log(result.data);
        }
      }).catch((error) => {
        // console.log('ERROR ' + error);
      });
    }
  }

  //console.log(obj);


  const onNameChange = (event) => {
    setFullName(event.target.value);
  }

  const onAddressChange = (event) => {
    setAddress(event.target.value);
  }

  const onFullIDChange = (event) => {
    setFullID(event.target.value);
  }

  const onCaptureClick = () => {
    // var canvas = document.getElementById('canvastest');
    // canvas.getContext('2d').drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    // console.log(canvas.toDataURL('image/png'));
    var canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 450;
    var ctx = canvas.getContext('2d');
    //draw image to canvas. scale to target dimensions
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    //convert to desired file format
    var dataURI = canvas.toDataURL('image/jpeg',1); // can also use 'image/png'
    console.log(dataURI);
  }

  useBoxRenderer(model, videoRef, canvasRef, cameraLoaded, trigger)

  return (
    <>
      <div>
        <video
          autoPlay
          playsInline
          muted
          ref={videoRef}
          width="600"
          height="450"
        />
        <canvas
          id="canvastest"
          style={{ 'position': 'fixed', 'top': 0, 'left': 0 }}
          ref={canvasRef}
          width="600"
          height="450"
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div>
          <div style={{ padding: 10 }}>
            <label style={{ marginRight: 10, fontSize: 20 }}>Full Name!:</label>
            <input onChange={onNameChange} value={fullName} dir="rtl" style={{ paddingTop: 5, paddingBottom: 5, width: 300, fontSize: 20 }} type="text"></input>
            <input onClick={onNameReset} style={{ paddingTop: 5, paddingBottom: 5 }} value="ReScan" type="button" />
          </div>
          <div style={{ padding: 10 }}>
            <label style={{ marginRight: 10, fontSize: 20 }}>Address:</label>
            <input onChange={onAddressChange} value={address} dir="rtl" style={{ paddingTop: 5, paddingBottom: 5, width: 300, fontSize: 20 }} type="text"></input>
            <input onClick={onAddressReset} style={{ paddingTop: 5, paddingBottom: 5 }} value="ReScan" type="button" />
          </div>
          <div style={{ padding: 10 }}>
            <label style={{ marginRight: 10, fontSize: 20 }}>ID Number:</label>
            <input onChange={onFullIDChange} value={fullID} dir="rtl" style={{ paddingTop: 5, paddingBottom: 5, width: 300, fontSize: 20 }} type="text"></input>
            <input onClick={onFullIDReset} style={{ paddingTop: 5, paddingBottom: 5 }} value="ReScan" type="button" />
          </div>
        </div>
        <div id='photoDiv'>
        </div>
      </div>
    </>
  )
}

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
