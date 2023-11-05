import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar/Navbar';
import FaceRec from './components/Facerec/FaceRec'
import Chatbot from './components/Chatbot/Chatbot';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from './components/Register/Register';


function App() {

  return (
  <BrowserRouter>
  {/* <Navbar/> */}
  <Routes>
      {/* <Route  path="/" element={<FaceRec />} />
      <Route path="/panel" element={<Register />} /> */}
      <Route path="/chatbot" element={<Chatbot />} />
      {/* <Route path="contact" element={<Contact />} />
      <Route path="*" element={<NoPage />} /> */}
  
  </Routes>
</BrowserRouter>
  )
}

export default App;