import { useEffect, useState } from "react";
import http from "../api/http";

export default function AdminPanel() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState({
    id: null,
    title: "",
    description: "",
    assignedToUserId: "",
    status: "Pending",
  });

  const resetForm = () =>
    setForm({
      id: null,
      title: "",
      description: "",
      assignedToUserId: "",
      status: "Pending",
    });

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      const res = await http.get("/tasks");
      setTasks(res.data);
    } catch {
      setErr("تعذر تحميل المهام");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setMsg("");
    try {
      if (form.id == null) {
        await http.post("/tasks", {
          title: form.title,
          description: form.description,
          assignedToUserId: Number(form.assignedToUserId),
        });
        setMsg("تم إنشاء المهمة");
      } else {
        await http.put(`/tasks/${form.id}`, {
          title: form.title,
          description: form.description,
          assignedToUserId: Number(form.assignedToUserId),
          status: form.status,
        });
        setMsg("تم تحديث المهمة");
      }
      resetForm();
      await load();
    } catch {
      setErr("فشل الحفظ");
    }
  };

  const editRow = (t) =>
    setForm({
      id: t.id,
      title: t.title,
      description: t.description,
      assignedToUserId: t.assignedToUserId,
      status: t.status,
    });
  const delRow = async (id) => {
    if (!window.confirm("حذف المهمة؟")) return;
    await http.delete(`/tasks/${id}`);
    await load();
  };

  return (
    <div className="container">
      <div className="panel" style={{ padding: 20, marginBottom: 16 }}>
        <h2 style={{ marginTop: 0 }}>لوحة المدير</h2>
        <form onSubmit={onSubmit} className="card" style={{ marginBottom: 16 }}>
          <div className="grid2">
            <input
              className="input"
              placeholder="العنوان"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
            <input
              className="input"
              placeholder="UserId المكلّف"
              type="number"
              value={form.assignedToUserId}
              onChange={(e) =>
                setForm({ ...form, assignedToUserId: e.target.value })
              }
              required
            />
          </div>
          <textarea
            className="textarea"
            placeholder="الوصف"
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            style={{ marginTop: 12 }}
            required
          />
          {form.id != null && (
            <div style={{ marginTop: 12 }}>
              <label className="hint">الحالة</label>
              <select
                className="select"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option>Pending</option>
                <option>InProgress</option>
                <option>Done</option>
              </select>
            </div>
          )}
          <div className="row" style={{ marginTop: 12 }}>
            <button className="btn" type="submit">
              {form.id == null ? "إنشاء" : "تحديث"}
            </button>
            {form.id != null && (
              <button
                type="button"
                className="btn secondary"
                onClick={resetForm}
              >
                إلغاء
              </button>
            )}
          </div>
          {msg && (
            <div className="success" style={{ marginTop: 8 }}>
              {msg}
            </div>
          )}
          {err && (
            <div className="error" style={{ marginTop: 8 }}>
              {err}
            </div>
          )}
        </form>

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
                <th>UserId</th>
                <th>أُنشئت</th>
                <th></th>
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
                  <td>{t.assignedToUserId}</td>
                  <td>{new Date(t.createdAt).toLocaleString()}</td>
                  <td className="row">
                    <button
                      className="btn secondary"
                      onClick={() => editRow(t)}
                    >
                      تعديل
                    </button>
                    <button className="btn danger" onClick={() => delRow(t.id)}>
                      حذف
                    </button>
                  </td>
                </tr>
              ))}
              {tasks.length === 0 && (
                <tr>
                  <td colSpan="7" className="hint">
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
