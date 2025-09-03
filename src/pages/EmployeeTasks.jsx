import { useEffect, useState } from "react";
import http from "../api/http";

export default function EmployeeTasks() {
  const [tasks, setTasks] = useState([]);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      const res = await http.get("/tasks/my");
      setTasks(res.data);
    } catch {
      setErr("تعذر تحميل مهامي");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id, status) => {
    setBusyId(id);
    setMsg("");
    setErr("");
    try {
      await http.put(`/tasks/${id}/status`, { status });
      setMsg("تم تحديث الحالة");
      await load();
    } catch {
      setErr("فشل تحديث الحالة");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="container">
      <div className="panel" style={{ padding: 20 }}>
        <h2 style={{ marginTop: 0 }}>مهامي</h2>
        {msg && <div className="success">{msg}</div>}
        {err && <div className="error">{err}</div>}
        {loading ? (
          <div className="hint">جارٍ التحميل…</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>العنوان</th>
                <th>الوصف</th>
                <th>الحالة</th>
                <th>تحديث</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((t) => (
                <tr key={t.id}>
                  <td>{t.id}</td>
                  <td>{t.title}</td>
                  <td className="hint" style={{ maxWidth: 360 }}>
                    {t.description}
                  </td>
                  <td>
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
                  </td>
                  <td>
                    <select
                      className="select"
                      value={t.status}
                      onChange={(e) => updateStatus(t.id, e.target.value)}
                      disabled={busyId === t.id}
                    >
                      <option>Pending</option>
                      <option>InProgress</option>
                      <option>Done</option>
                    </select>
                  </td>
                </tr>
              ))}
              {tasks.length === 0 && (
                <tr>
                  <td colSpan="5" className="hint">
                    لا توجد مهام
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
