import { useEffect, useState } from "react";
import ContactForm from "./ContactForm.jsx";

const API_URL = "http://localhost:5000/api/users";

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function loadUsers() {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setUsers(data);
    } catch {
      setMessage("Could not load users from the backend.");
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setIsSaving(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Could not save user.");
        return;
      }

      setName("");
      setEmail("");
      setMessage("User saved successfully!");
      await loadUsers();
    } catch {
      setMessage("Could not connect to the backend.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main>
      <h1>User Form</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save User"}
        </button>
      </form>

      {message && <p>{message}</p>}

      <h2>Saved Users</h2>

      {users.length === 0 ? (
        <p>No users saved yet.</p>
      ) : (
        users.map((user) => (
          <p key={user.id}>
            {user.name} — {user.email}
          </p>
        ))
      )}

      <ContactForm />
    </main>
  );
}

export default App;