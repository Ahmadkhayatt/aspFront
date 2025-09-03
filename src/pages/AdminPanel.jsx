// task-management-frontend/src/pages/AdminPanel.jsx
import { useEffect, useState } from "react";
import http from "../api/http";

export default function AdminPanel() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  // إنشاء / تعديل
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
      const res = await http.get("/tasks"); // Admin sees all
      setTasks(res.data);
    } catch (e) {
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
      if (!form.title || !form.description || !form.assignedToUserId) {
        setErr("املأ الحقول المطلوبة");
        return;
      }
      if (form.id == null) {
        // إنشاء
        await http.post("/tasks", {
          title: form.title,
          description: form.description,
          assignedToUserId: Number(form.assignedToUserId),
        });
        setMsg("تم إنشاء المهمة");
      } else {
        // تعديل كامل
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
    } catch (e) {
      setErr("فشل الحفظ");
    }
  };

  const editRow = (t) => {
    setForm({
      id: t.id,
      title: t.title,
      description: t.description,
      assignedToUserId: t.assignedToUserId,
      status: t.status,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const delRow = async (id) => {
    setErr("");
    setMsg("");
    if (!window.confirm("حذف هذه المهمة؟")) return;
    try {
      await http.delete(`/tasks/${id}`);
      setMsg("تم الحذف");
      await load();
      if (form.id === id) resetForm();
    } catch (e) {
      setErr("فشل الحذف");
    }
  };

  return (
    <div style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h2>لوحة المدير</h2>

      {/* نموذج إنشاء/تعديل */}
      <form
        onSubmit={onSubmit}
        style={{ margin: "16px 0", display: "grid", gap: 8, maxWidth: 720 }}
      >
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}
        >
          <input
            placeholder="العنوان *"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            style={{ padding: 10 }}
            required
          />
          <input
            placeholder="المكلّف إليه (UserId) *"
            type="number"
            value={form.assignedToUserId}
            onChange={(e) =>
              setForm({ ...form, assignedToUserId: e.target.value })
            }
            style={{ padding: 10 }}
            required
          />
        </div>
        <textarea
          placeholder="الوصف *"
          rows={3}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          style={{ padding: 10 }}
          required
        />
        {form.id != null && (
          <div>
            <label style={{ marginRight: 8 }}>الحالة:</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              style={{ padding: 8 }}
            >
              <option>Pending</option>
              <option>InProgress</option>
              <option>Done</option>
            </select>
          </div>
        )}
        <div style={{ display: "flex", gap: 8 }}>
          <button type="submit" style={{ padding: "10px 16px" }}>
            {form.id == null ? "إنشاء" : "تحديث"}
          </button>
          {form.id != null && (
            <button
              type="button"
              onClick={resetForm}
              style={{ padding: "10px 16px" }}
            >
              إلغاء التعديل
            </button>
          )}
        </div>
        {msg && <div style={{ color: "green" }}>{msg}</div>}
        {err && <div style={{ color: "red" }}>{err}</div>}
      </form>

      {/* جدول المهام */}
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
              <th>UserId</th>
              <th>أنشئت في</th>
              <th>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((t) => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>{t.title}</td>
                <td style={{ maxWidth: 360 }}>{t.description}</td>
                <td>{t.status}</td>
                <td>{t.assignedToUserId}</td>
                <td>{new Date(t.createdAt).toLocaleString()}</td>
                <td>
                  <button onClick={() => editRow(t)} style={{ marginRight: 8 }}>
                    تعديل
                  </button>
                  <button onClick={() => delRow(t.id)}>حذف</button>
                </td>
              </tr>
            ))}
            {tasks.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
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
