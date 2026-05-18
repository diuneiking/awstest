import { useEffect, useState } from "react";

function App() {
  const [backendMessage, setBackendMessage] = useState("Loading backend...");
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    status: "active",
  });

  async function loadHealth() {
    try {
      const res = await fetch("/api/health");
      const data = await res.json();
      setBackendMessage(data.message);
    } catch {
      setBackendMessage("Could not connect to backend");
    }
  }

  async function loadClients() {
    try {
      const res = await fetch("/api/clients");
      const data = await res.json();

      if (data.success) {
        setClients(data.data);
      }
    } catch (error) {
      console.error("Failed to load clients:", error);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Client name is required");
      return;
    }

    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.message || "Failed to create client");
        return;
      }

      setForm({
        name: "",
        email: "",
        phone: "",
        status: "active",
      });

      loadClients();
    } catch (error) {
      console.error("Failed to create client:", error);
      alert("Failed to create client");
    }
  }

  useEffect(() => {
    loadHealth();
    loadClients();
  }, []);

  return (
    <div style={{ padding: "40px", fontFamily: "Arial", maxWidth: "900px" }}>
      <h1>Internal System Demo</h1>
      <p>
        <strong>Backend:</strong> {backendMessage}
      </p>

      <hr />

      <h2>Create Client</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: "30px" }}>
        <div style={{ marginBottom: "10px" }}>
          <input
            placeholder="Client name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={{ padding: "8px", width: "300px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <input
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            style={{ padding: "8px", width: "300px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <input
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            style={{ padding: "8px", width: "300px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            style={{ padding: "8px", width: "318px" }}
          >
            <option value="active">active</option>
            <option value="pending">pending</option>
            <option value="inactive">inactive</option>
          </select>
        </div>

        <button type="submit" style={{ padding: "8px 16px" }}>
          Add Client
        </button>
      </form>

      <h2>Clients</h2>

      <table border="1" cellPadding="10" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Created At</th>
          </tr>
        </thead>

        <tbody>
          {clients.map((client) => (
            <tr key={client.id}>
              <td>{client.id}</td>
              <td>{client.name}</td>
              <td>{client.email}</td>
              <td>{client.phone}</td>
              <td>{client.status}</td>
              <td>{client.created_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;