import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { auth, googleProvider } from './firebaseConfig';
import { signInWithPopup } from 'firebase/auth';
import axios from 'axios';
import LocationPicker from './LocationPicker';
import Modal from 'react-modal';
import RecyclingSymbol from './recycling.png'; // Adjust the path accordingly
import BackgroundImage from './greenCyclelogo.jpg';
import GoogleIcon from './google.png';
import beforeLoginScreenSplash from './beforeLoginScreenSplash.MP4';

import { useNavigate } from 'react-router-dom';

Modal.setAppElement('#root'); // Required for accessibility

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [signupUsername, setSignupUsername] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupDob, setSignupDob] = useState('');
  const [signupContact, setSignupContact] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    // You can remove this setTimeout since the video itself will control the loading
  }, []);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/login', { username, password });
      const { token } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('Username', username);
      setIsAuthenticated(true);
      navigate('/sell-buy'); // Navigate to sell-buy after successful login
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Invalid credentials');
    }
  };
  

  const handleSocialLogin = async (provider) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();
      localStorage.setItem('token', token);
      setIsAuthenticated(true);
      navigate('/sell-buy'); // Navigate to sell-buy after social login
    } catch (error) {
      console.error('Error signing in with provider', error);
    }
  };
  

  const handleSignup = async () => {
    const age = new Date().getFullYear() - new Date(signupDob).getFullYear();
    const generateUniqueId = () => {
      const timestamp = Date.now();
      const randomNum = Math.floor(Math.random() * 10000);
      return `user${timestamp}${randomNum}`;
    };

    const userId = generateUniqueId();

    const user = {
      id: userId,
      name: signupName,
      age: age.toString(),
      contactNumber: signupContact,
      loginCredentials: [{ username: signupUsername, password: signupPassword }],
      greenpoints: '0',
      wallet: '0'
    };

    try {
      const response = await axios.post('http://localhost:8080/signup', user);
      if (response.status === 201) {
        alert('Signup successful! Please log in.');
        setIsSignupModalOpen(false);
      }
    } catch (error) {
      console.error('Error signing up:', error);
      alert('Signup failed');
    }
  };

  const handleVideoEnded = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <SplashScreen>
        <video
          src={beforeLoginScreenSplash}
          autoPlay
          muted
          onEnded={handleVideoEnded}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </SplashScreen>
    );
  }

  if (isAuthenticated) {
    return <LocationPicker />;
  }

  return (
    <Container>
      <Form>
        <UsernameInput
          type="text"
          value={username}
          onChange={handleUsernameChange}
          placeholder="Username"
        />
        <PasswordInput
          type="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="Password"
        />
        <LoginButton onClick={handleLogin}>Login</LoginButton>
        <Or>or</Or>
        <SocialLoginButton onClick={() => handleSocialLogin(googleProvider)}>
          <img src={GoogleIcon} alt="Google" /> Google
        </SocialLoginButton>
        <SignupBar onClick={() => setIsSignupModalOpen(true)}>Sign up</SignupBar>
      </Form>

      <Modal isOpen={isSignupModalOpen} onRequestClose={() => setIsSignupModalOpen(false)} style={customStyles}>
        <ModalContent>
          <h2>Sign Up</h2>
          <SignupInput
            type="text"
            value={signupUsername}
            onChange={(e) => setSignupUsername(e.target.value)}
            placeholder="Username"
          />
          <SignupInput
            type="password"
            value={signupPassword}
            onChange={(e) => setSignupPassword(e.target.value)}
            placeholder="Password"
          />
          <SignupInput
            type="text"
            value={signupName}
            onChange={(e) => setSignupName(e.target.value)}
            placeholder="Name"
          />
          <SignupInput
            type="date"
            value={signupDob}
            onChange={(e) => setSignupDob(e.target.value)}
            placeholder="Date of Birth"
          />
          <SignupInput
            type="text"
            value={signupContact}
            onChange={(e) => setSignupContact(e.target.value)}
            placeholder="Contact Number"
          />
          <SignupButton onClick={handleSignup}>Sign Up</SignupButton>
        </ModalContent>
      </Modal>
      <div id="recaptcha-container"></div>
    </Container>
  );
};

export default Login;

const SplashScreen = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw; /* Ensure the container takes the full width */
  background-color: #5e348b;

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end; /* Push content to the bottom */
  height: 100vh;
  width: 100vw;
  background-image: url(${BackgroundImage});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 20px;
`;

const Form = styled.div`
  background-color: white;
  padding: 40px 20px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 400px;
  margin-bottom: 20px; /* Add a small margin from the bottom */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 30px 15px;
    margin-bottom: 15px;
  }

  @media (max-width: 480px) {
    padding: 20px 10px;
    margin-bottom: 10px;
  }
`;

const UsernameInput = styled.input`
  width: 100%;
  padding: 15px;
  border-radius: 30px;
  border: none;
  margin-bottom: 20px;
  font-size: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 480px) {
    padding: 12px;
    font-size: 14px;
  }
`;

const PasswordInput = styled.input`
  width: 100%;
  padding: 15px;
  border-radius: 30px;
  border: none;
  margin-bottom: 20px;
  font-size: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 480px) {
    padding: 12px;
    font-size: 14px;
  }
`;

const LoginButton = styled.button`
  width: 100%;
  background-color: #8ce08a;
  color: black;
  padding: 15px;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  margin-bottom: 5px;
  font-size: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: #78c57a;
  }

  @media (max-width: 480px) {
    padding: 12px;
    font-size: 14px;
  }
`;

const Or = styled.p`
  color: white;
  margin-bottom: 20px;
  font-size: 16px;

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const SocialLoginButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  background-color: whitesmoke;
  color: black;
  padding: 15px;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  margin-bottom: 10px;
  font-size: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #e0e0e0;
  }

  img {
    margin-right: 10px;
  }

  @media (max-width: 480px) {
    padding: 12px;
    font-size: 14px;

    img {
      margin-right: 8px;
    }
  }
`;

const SignupBar = styled.p`
  color: black;
  cursor: pointer;
  width: 100%;
  font-size: 16px;
  border-radius: 30px;
  background-color: whitesmoke;
  padding: 15px;
  text-align: center;
  border: 1px solid #ccc;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #f0f0f0;
  }

  @media (max-width: 480px) {
    padding: 12px;
    font-size: 14px;
  }
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;

  @media (max-width: 480px) {
    padding: 15px;
  }
`;

const SignupInput = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border-radius: 5px;
  border: 1px solid #cccccc;
  font-size: 16px;

  @media (max-width: 480px) {
    padding: 8px;
    font-size: 14px;
  }
`;

const SignupButton = styled.button`
  width: 100%;
  background-color: #32cd32;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #28b828;
  }

  @media (max-width: 480px) {
    padding: 8px;
    font-size: 14px;
  }
`;

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: '400px',
    borderRadius: '20px',
    padding: '20px',

    '@media (max-width: 480px)': {
      padding: '15px',
      width: '95%',
    },
  },
};
