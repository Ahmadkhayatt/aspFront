// task-management-frontend/src/pages/AdminUsers.jsx
import { useEffect, useState } from "react";
import http from "../api/http";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "Employee",
  });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      const res = await http.get("/admin/users");
      setUsers(res.data);
    } catch {
      setErr("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setMsg("");
    try {
      await http.post("/admin/create-user", form);
      setMsg("User created");
      setForm({ username: "", email: "", password: "", role: "Employee" });
      await load();
    } catch (e) {
      if (e?.response?.status === 409) setErr("Email already exists");
      else setErr("Creation failed");
    }
  };

  const del = async (id) => {
    setErr("");
    setMsg("");
    if (!window.confirm("Delete this user?")) return;
    try {
      await http.delete(`/admin/users/${id}`);
      setMsg("User deleted");
      await load();
    } catch (e) {
      if (e?.response?.status === 409)
        setErr("User has tasks. Reassign or delete tasks first.");
      else setErr("Delete failed");
    }
  };

  return (
    <div className="container">
      <div className="panel" style={{ padding: 20 }}>
        <h2 style={{ marginTop: 0 }}>Admin — Users</h2>

        <form onSubmit={submit} className="card" style={{ marginBottom: 16 }}>
          <div className="grid2">
            <input
              className="input"
              placeholder="Username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
            <input
              className="input"
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="grid2" style={{ marginTop: 12 }}>
            <input
              className="input"
              placeholder="Password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <select
              className="select"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option>Employee</option>
              <option>Admin</option>
            </select>
          </div>
          <div className="row" style={{ marginTop: 12 }}>
            <button className="btn" type="submit">
              Create User
            </button>
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
          <div className="hint">Loading…</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>
                    <button className="btn danger" onClick={() => del(u.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="5" className="hint">
                    No users
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
