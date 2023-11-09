import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import './FaceRec.css';
import { useNavigate } from 'react-router-dom'; 

const FaceVerification = () => {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [walletConnected, setWalletConnected] = useState(false);
  
  const navigate = useNavigate();

  const capture = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);

    // Turn off the webcam by setting capturedImage to null
    webcamRef.current = null;

    // Display a message while the API call is in progress
    setVerificationStatus('Verifying...');

    try {
      // Replace 'http://localhost:4000' with your Flask API endpoint
      const response = await axios.post('http://localhost:4000/verify', { image: imageSrc });
      console.log(response.data)
      setVerificationStatus(response.data['status']);
      redirect_(response.data['status'])
    } catch (error) {
      console.error('Error verifying image:', error);
      setVerificationStatus('Verification failed.');
    }
  };

  async function requestAccount() {
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      setWalletAddress(accounts[0]);
      setWalletConnected(true);
      console.log(accounts[0])
      localStorage.setItem('walletAddress', accounts[0]);
      redirect_(accounts[0])
    } catch (error) {
      console.error('Error connecting:', error);
      setWalletConnected(false); 
    }
  }

  const redirect_ = async (data)=> {
    try{
      const response = await axios.get('http://localhost:4000/fetchdata/address/'+data);
      console.log(response.data)
      if(response.data['type']==='exist'){
        navigate('/chatbot/'+data)
      }else{
        navigate('/register/'+data)
      }
    } catch(err){
      console.log(err)
    }
  }

  return (
    <div className='main'>
      
    <div className="face-verification-container">
      <div className="login">
        <div>
          <p>Connect through wallet</p>
        </div>
        <div>
          <button onClick={requestAccount}>Login</button>
        </div>
      </div>
      <div className="line">

      </div>
      <div className='webCam'>
      <div>
          <p>Connect through Face Authentication</p>
      </div>
      {capturedImage ? (
        <div className="image-preview">
          <img src={capturedImage} alt="Captured" />
        </div>
      ) : (
        <>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            mirrored={true}
            className="webcam"
          />
          <button onClick={capture} className="capture-button">
            Capture
          </button>
        </>
      )}
      {verificationStatus && (
        <div className="verification-status">{verificationStatus}</div>
      )}
      </div>
    </div>
    </div>
  );
};

export default FaceVerification;


// style={{backgroundColor: "#f7f7", width:"100%", borderRadius: "8px"}}
//   speechToText='{
//     "webSpeech": true,
//     "translations": {"vanakkam": "hello", "Hello": "Goodbye"},
//     "commands": {"resume": "resume","submit": "submit", "settings": {"commandMode": "hello"}},
//     "button": {"position": "outside-left"}
//   }'