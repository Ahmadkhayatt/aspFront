// src/components/Nav.jsx
import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Nav() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div
      style={{
        padding: 12,
        borderBottom: "1px solid #ddd",
        display: "flex",
        gap: 12,
        alignItems: "center",
        fontFamily: "sans-serif",
      }}
    >
      <Link to="/">تسجيل الدخول</Link>
      <Link to="/dashboard">لوحة التحكم</Link>
      {user?.role === "Admin" && <Link to="/admin">لوحة المدير</Link>}
      {user?.role === "Employee" && <Link to="/my-tasks">مهامي</Link>}
      <Link to="/reset-password">إعادة تعيين كلمة المرور</Link>
      <div style={{ marginLeft: "auto" }}>
        {user ? (
          <>
            <span style={{ marginInlineEnd: 8 }}>
              {user.email} — {user.role}
            </span>
            <button onClick={logout}>خروج</button>
          </>
        ) : (
          <span>غير مسجّل</span>
        )}
      </div>
    </div>
  );
}
