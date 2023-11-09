import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import './Chatbot.css';
import axios from 'axios';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [user, setUser] = useState('');
  const [listening, setListening] = useState(false); // Track listening state
  const chatboxRef = useRef(null);
  const recognition = useRef(
    window.SpeechRecognition || window.webkitSpeechRecognition
  );
  const synthesis = useRef(window.speechSynthesis);

  const { parameter } = useParams();
 
  // Check if speech recognition is available
  const isSpeechRecognitionAvailable = recognition.current !== undefined;


  useEffect(()=>{
    const getValue = async () =>{
      const response = await axios.get('http://localhost:4000/fetchdata/address/'+parameter);
      setUser(response.data.data.name)
      const str = "Welcome "+ response.data.data.name +", how may I help you"
      console.log(str)
      speak(str)
    }
    getValue() 
  },[])

  const handleInputMessageChange = (e) => {
    setInputMessage(e.target.value);
  };

  const handleSubmitMessage = async () => {
    if (inputMessage.trim() === '') return;
  
    const userMessage = { text: inputMessage, user: true };
    setMessages([...messages, userMessage]);
    setInputMessage('');
  
    try {
      const res = await axios.post('http://localhost:4000/chat', { user: inputMessage });
      const botResponse = res.data['bot'];
  
      // Delay the bot response to simulate typing
      const delayBotResponse = (botResponse) => {
        const botMessage = { text: botResponse, user: false };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
        speak(botResponse);
      };
  
      // Simulate a typing delay before the bot response
      setTimeout(() => delayBotResponse(botResponse), 1000);
    } catch (error) {
      console.error("Error fetching bot response:", error);
    }
  };
  

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmitMessage();
    }
  };

  const handleSpeechRecognition = () => {
    if (isSpeechRecognitionAvailable) {
      const recognitionInstance = new recognition.current();
      recognitionInstance.onresult = (event) => {
        const spokenText = event.results[0][0].transcript;
        setInputMessage((prevInput) => prevInput + ' ' + spokenText);

        // Check if spokenText contains "Send the message"
        if (spokenText.toLowerCase().includes('send the message')) {
          // Automatically submit the message
          handleSubmitMessage();
        }

        recognitionInstance.stop();

        // Toggle listening state and update the button text
        setListening(false);
      };

      // Toggle listening state and update the button text
      setListening((prevState) => !prevState);

      // Start or stop recognition based on listening state
      if (!listening) {
        recognitionInstance.start();
      } else {
        recognitionInstance.stop();
      }
    }
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    synthesis.current.speak(utterance);
  };

  useEffect(() => {
    // Scroll to the bottom of the chatbox when new messages are added
    chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
  }, [messages]);

  

  return (
    <div className="chatbot_body">
      <div className="chatbot-container">
      <div className="chatbox" ref={chatboxRef}>
        {user?<span className="message bot">Welcome {user}, how may I help you</span>:<></>}
        
        {messages.map((message, index) => (
          <span
            key={index}
            className={`message ${message.user ? 'user' : 'bot'}`}
          >
            {message.text}
          </span>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          placeholder="Type your message..."
          value={inputMessage}
          onChange={handleInputMessageChange}
          onKeyPress={handleKeyPress}
          className="input-field"
        />
        <button onClick={handleSubmitMessage} className="send-button">
          Send
        </button>
        <button onClick={handleSpeechRecognition} className="voice-assistant-button">
          {listening ? 'Listening...' : 'Voice Assistant'}
        </button>
      </div>
    </div>
    </div>
  );
};

export default Chatbot;
