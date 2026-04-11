import { useAuth } from '../features/authentication/AuthContext';

export const HomePage = () => {
  const { logout } = useAuth();

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Management System Dashboard</h1>
      <p>Welcome to the secure area. You are successfully authenticated.</p>
      
      <button onClick={logout} style={{ marginTop: '20px' }}>
        Log Out
      </button>
    </div>
  );
};