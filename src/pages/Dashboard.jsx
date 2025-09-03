// src/pages/Dashboard.jsx
import { useContext, useEffect, useState } from "react";
import http from "../api/http";
import { AuthContext } from "../context/AuthContext";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    let on = true;
    const load = async () => {
      try {
        const url = user?.role === "Admin" ? "/tasks" : "/tasks/my";
        const res = await http.get(url);
        if (on) setTasks(res.data);
      } catch {
        if (on) setErr("تعذر تحميل المهام");
      }
    };
    load();
    return () => {
      on = false;
    };
  }, [user]);

  return (
    <div style={{ padding: 24, fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>لوحة التحكم</h2>
        <div>
          <span style={{ marginRight: 12 }}>
            {user?.email} — {user?.role}
          </span>
          <button onClick={logout}>تسجيل الخروج</button>
        </div>
      </div>
      {err && <div style={{ color: "red" }}>{err}</div>}
      <ul>
        {tasks.map((t) => (
          <li key={t.id}>
            <b>{t.title}</b> — {t.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
