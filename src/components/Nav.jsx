// task-management-frontend/src/components/Nav.jsx
import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Nav() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="nav">
      <Link to="/">Login</Link>
      <Link to="/dashboard">Dashboard</Link>
      {user?.role === "Admin" && (
        <>
          <Link to="/admin">Tasks</Link>
          <Link to="/admin-users">Users</Link>
        </>
      )}
      {user?.role === "Employee" && <Link to="/my-tasks">My Tasks</Link>}
      <Link to="/reset-password">Reset Password</Link>
      <div className="spacer" />
      {user ? (
        <div className="row">
          <span className="badge blue">{user.email}</span>
          <span className="badge yellow">{user.role}</span>
          <button className="btn secondary" onClick={logout}>
            Logout
          </button>
        </div>
      ) : (
        <span className="hint">Guest</span>
      )}
    </div>
  );
}
