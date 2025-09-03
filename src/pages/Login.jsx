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
      login(res.data);
      navigate(res.data.role === "Admin" ? "/admin" : "/my-tasks");
    } catch {
      setErr("بيانات الدخول غير صحيحة");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container">
      <div
        className="panel"
        style={{ maxWidth: 440, padding: 24, margin: "48px auto" }}
      >
        <h2 style={{ marginTop: 0 }}>تسجيل الدخول</h2>
        <form onSubmit={onSubmit}>
          <div className="grid2">
            <div>
              <label className="hint">البريد الإلكتروني</label>
              <input
                className="input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="hint">كلمة المرور</label>
              <input
                className="input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          {err && (
            <div className="error" style={{ marginTop: 8 }}>
              {err}
            </div>
          )}
          <div className="row" style={{ marginTop: 16 }}>
            <button className="btn" type="submit" disabled={busy}>
              {busy ? "جارٍ الدخول…" : "دخول"}
            </button>
            <Link to="/reset-password" className="btn ghost">
              نسيت كلمة المرور؟
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
