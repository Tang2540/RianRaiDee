import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/Auth/useAuth';
import axios from 'axios';

axios.defaults.withCredentials = true;

function Auth() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { user, setUser, checkAuthStatus } = useAuth()

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/login', { username, password });
      setUsername('');
      setPassword('');
      console.log(response)
      checkAuthStatus();
      navigate('/')
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:3000/logout');
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Added: Handle Google Sign-In
  const handleGoogleSignIn = () => {
    window.location.href = 'http://localhost:3000/auth/google';
  };

  return (
    <div>
      {user ? (
        <div>
          <h1>Welcome, {user._id}</h1>
          <h1>{user.username}</h1>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => {setUsername(e.target.value)}}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Login</button>
          </form>
          {/* Added: Google Sign-In Button */}
          <button onClick={handleGoogleSignIn}>Sign in with Google</button>
        </div>
      )}
    </div>
  );
}

export default Auth;