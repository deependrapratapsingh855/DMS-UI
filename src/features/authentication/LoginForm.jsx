import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import InputField from "../../components/InputField";

const LoginForm = () => {
  // 1. Setup state to track input values
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // 2. Bring in the auth context and router navigation
  const { login } = useAuth();
  const navigate = useNavigate();

  // 3. Handle the form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents the page from refreshing
    
    if (email && password) {
      login();       // Update global state to true
      navigate('/'); // Send them to the Home Page
    }
  };

  return (
    <div className="login-container">
      {/* Attach the handleSubmit function to the form */}
      <form onSubmit={handleSubmit} className="login-form">
        <InputField 
          type="email" 
          placeholder="Email address" 
          icon="mail" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <InputField 
          type="password" 
          placeholder="Password" 
          icon="lock" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <a href="#" className="forgot-password-link">Forgot password?</a>
        <button type="submit" className="login-button">Log In</button>
      </form>
      <p className="signup-prompt">
        Don&apos;t have an account? <a href="#" className="signup-link">Sign up</a>
      </p>
    </div>
  )
}

export default LoginForm;