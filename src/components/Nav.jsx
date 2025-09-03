import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Nav() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="nav">
      <Link to="/">تسجيل الدخول</Link>
      <Link to="/dashboard">لوحة التحكم</Link>
      {user?.role === "Admin" && <Link to="/admin">لوحة المدير</Link>}
      {user?.role === "Employee" && <Link to="/my-tasks">مهامي</Link>}
      <Link to="/reset-password">إعادة كلمة السر</Link>
      <div className="spacer" />
      {user ? (
        <div className="row">
          <span className="badge blue">{user.email}</span>
          <span className="badge yellow">{user.role}</span>
          <button className="btn secondary" onClick={logout}>
            خروج
          </button>
        </div>
      ) : (
        <span className="hint">غير مسجل</span>
      )}
    </div>
  );
}
