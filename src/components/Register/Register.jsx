import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import './Register.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'; 

function Register() {
  const webcamRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    gender: '',
  });
  const [capturedImage, setCapturedImage] = useState(null);
  const [capturing, setCapturing] = useState(true);

  const { parameter } = useParams();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    setCapturing(false);
  };

  const recaptureImage = () => {
    setCapturedImage(null);
    setCapturing(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(parameter.length<=30){
    const response = await axios.post('http://localhost:4000/register', {
      id: formData.name,
      content: formData,
      img: capturedImage,
    });
    if (response.data.message === 'Data registered successfully'){
      window.location.replace('http://localhost:3000');
    }
  }else{
    const response = await axios.post('http://localhost:4000/register', {
      id: parameter,
      content: formData,
      img: capturedImage,
    });
    if (response.data.message === 'Data registered successfully'){
      window.location.replace('http://localhost:3000');
    }
  }
};

  return (
    <div className="dark-theme">
      <form onSubmit={handleSubmit}>
        {
          (parameter.length<=30)?
          <div className="webcam">
          {capturing ? (
            <div>
              <Webcam
                className='webcam_main'
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
              />
              <div className="capture-button" onClick={captureImage}>
                Capture
              </div>
            </div>
          ) : (
            <div>
              <img src={capturedImage} alt="Captured" className="captured-image" />
              <button className="recapture-button" onClick={recaptureImage}>
                Recapture
              </button>
            </div>
          )}
        </div>:
        <></>
        }

        <div className="form-fields">
          <div className="form-field">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label htmlFor="dob">Date of Birth:</label>
            <input
              type="text"
              id="dob"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label htmlFor="gender">Gender:</label>
            <input
              type="text"
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            />
          </div>
        </div>

        <button className='submit' type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Register;
