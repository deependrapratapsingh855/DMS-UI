import { Navigate } from "react-router-dom";
import { isLoggedIn } from "../services/authService";

/**
 * Wraps routes that require authentication.
 * Redirects to /login if no session exists.
 */
export default function ProtectedRoute({ children }) {
  return isLoggedIn() ? children : <Navigate to="/login" replace />;
}
