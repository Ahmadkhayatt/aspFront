import { useContext, useEffect, useState } from "react";
import http from "../api/http";
import { AuthContext } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErr("");
      try {
        const url = user?.role === "Admin" ? "/tasks" : "/tasks/my";
        const res = await http.get(url);
        setTasks(res.data);
      } catch {
        setErr("تعذر تحميل المهام");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  return (
    <div className="container">
      <div className="panel" style={{ padding: 20 }}>
        <h2 style={{ marginTop: 0 }}>لوحة التحكم</h2>
        <p className="hint">
          مرحبًا {user?.email} — الدور: <b>{user?.role}</b>
        </p>
        {err && <div className="error">{err}</div>}
        {loading ? (
          <div className="hint">جارٍ التحميل…</div>
        ) : (
          <div className="grid2">
            {tasks.map((t) => (
              <div className="card" key={t.id}>
                <div
                  className="row"
                  style={{ justifyContent: "space-between" }}
                >
                  <h3 style={{ margin: "4px 0" }}>{t.title}</h3>
                  <span
                    className={`badge ${
                      t.status === "Done"
                        ? "green"
                        : t.status === "InProgress"
                        ? "yellow"
                        : "blue"
                    }`}
                  >
                    {t.status}
                  </span>
                </div>
                <p className="hint" style={{ marginTop: 8 }}>
                  {t.description}
                </p>
                <div className="row" style={{ marginTop: 10 }}>
                  <span className="kbd">ID {t.id}</span>
                  <span className="kbd">User {t.assignedToUserId}</span>
                </div>
              </div>
            ))}
            {tasks.length === 0 && <div className="hint">لا توجد مهام</div>}
          </div>
        )}
      </div>
    </div>
  );
}
