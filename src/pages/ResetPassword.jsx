// src/pages/ResetPassword.jsx
import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import http from "../api/http";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const [email, setEmail] = useState(""); // لاستخدام إرسال الرابط
  const [newPassword, setNewPassword] = useState("");
  const [mode, setMode] = useState(token ? "reset" : "request");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const requestLink = async (e) => {
    e.preventDefault();
    setMsg("");
    setBusy(true);
    try {
      await http.post("/auth/forgot-password", { email });
      setMsg("تم إرسال رابط إعادة التعيين إن وجد الحساب.");
    } catch {
      setMsg("حدث خطأ. حاول لاحقاً.");
    } finally {
      setBusy(false);
    }
  };

  const submitNew = async (e) => {
    e.preventDefault();
    setMsg("");
    setBusy(true);
    try {
      await http.post("/auth/reset-password", { token, newPassword });
      setMsg("تم تغيير كلمة المرور بنجاح. يمكنك تسجيل الدخول الآن.");
    } catch {
      setMsg("الرمز غير صالح أو منتهي.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      style={{ maxWidth: 420, margin: "64px auto", fontFamily: "sans-serif" }}
    >
      {mode === "request" ? (
        <>
          <h2>إرسال رابط إعادة التعيين</h2>
          <form onSubmit={requestLink}>
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
            <button
              type="submit"
              disabled={busy}
              style={{ padding: "10px 16px" }}
            >
              {busy ? "جارٍ الإرسال..." : "إرسال الرابط"}
            </button>
          </form>
          {msg && <div style={{ marginTop: 12 }}>{msg}</div>}
          <div style={{ marginTop: 16 }}>
            <Link to="/">العودة لتسجيل الدخول</Link>
          </div>
        </>
      ) : (
        <>
          <h2>إعادة تعيين كلمة المرور</h2>
          <form onSubmit={submitNew}>
            <div style={{ margin: "12px 0" }}>
              <label>كلمة مرور جديدة</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={{ width: "100%", padding: 8 }}
                required
              />
            </div>
            <button
              type="submit"
              disabled={busy}
              style={{ padding: "10px 16px" }}
            >
              {busy ? "جارٍ الحفظ..." : "حفظ"}
            </button>
          </form>
          {msg && <div style={{ marginTop: 12 }}>{msg}</div>}
          <div style={{ marginTop: 16 }}>
            <Link to="/">العودة لتسجيل الدخول</Link>
          </div>
        </>
      )}
    </div>
  );
}
