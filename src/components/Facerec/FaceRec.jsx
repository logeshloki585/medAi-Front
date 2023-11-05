import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import './FaceRec.css';
const FaceVerification = () => {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState(null);

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
    } catch (error) {
      console.error('Error verifying image:', error);
      setVerificationStatus('Verification failed.');
    }
  };

  return (
    <div className="face-verification-container">
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