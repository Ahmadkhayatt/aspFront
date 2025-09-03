// src/pages/Login.jsx
import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import http from "../api/http";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      const res = await http.post("/auth/login", { email, password });
      // متوقع من الـAPI: { token, role, userId, email }
      login(res.data);
      // تحويل حسب الدور
      if (res.data.role === "Admin") navigate("/admin");
      else navigate("/my-tasks");
    } catch {
      setErr("بيانات الدخول غير صحيحة");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      style={{ maxWidth: 360, margin: "64px auto", fontFamily: "sans-serif" }}
    >
      <h2>تسجيل الدخول</h2>
      <form onSubmit={onSubmit}>
        <div style={{ margin: "12px 0" }}>
          <label>البريد الإلكتروني</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: 8 }}
            required
          />
        </div>
        <div style={{ margin: "12px 0" }}>
          <label>كلمة المرور</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: 8 }}
            required
          />
        </div>
        {err && <div style={{ color: "red", marginBottom: 8 }}>{err}</div>}
        <button type="submit" disabled={busy} style={{ padding: "10px 16px" }}>
          {busy ? "جارٍ الدخول..." : "دخول"}
        </button>
      </form>
      <div style={{ marginTop: 16 }}>
        <Link to="/reset-password">نسيت كلمة المرور؟</Link>
      </div>
    </div>
  );
}
