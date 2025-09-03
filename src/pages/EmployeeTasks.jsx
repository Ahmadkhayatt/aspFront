// task-management-frontend/src/pages/EmployeeTasks.jsx
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
    } catch (e) {
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
    setErr("");
    setMsg("");
    try {
      await http.put(`/tasks/${id}/status`, { status });
      setMsg("تم تحديث الحالة");
      await load();
    } catch (e) {
      setErr("فشل تحديث الحالة");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h2>مهامي</h2>
      {msg && <div style={{ color: "green" }}>{msg}</div>}
      {err && <div style={{ color: "red" }}>{err}</div>}
      {loading ? (
        <div>جارٍ التحميل...</div>
      ) : (
        <table
          border="1"
          cellPadding="6"
          style={{ width: "100%", borderCollapse: "collapse" }}
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>العنوان</th>
              <th>الوصف</th>
              <th>الحالة</th>
              <th>تحديث الحالة</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((t) => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>{t.title}</td>
                <td style={{ maxWidth: 360 }}>{t.description}</td>
                <td>{t.status}</td>
                <td>
                  <select
                    value={t.status}
                    onChange={(e) => updateStatus(t.id, e.target.value)}
                    disabled={busyId === t.id}
                    style={{ padding: 6 }}
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
                <td colSpan="5" style={{ textAlign: "center" }}>
                  لا توجد مهام
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
