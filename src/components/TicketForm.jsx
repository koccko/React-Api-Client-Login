import { useState } from "react";

export default function TicketForm({ onCreate }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("normal");

  const submit = (e) => {
    e.preventDefault();
    if (!title.trim()) return alert("Title is required");
    onCreate({ title, description, priority });
    setTitle("");
    setDescription("");
    setPriority("normal");
  };

  return (
    <form
      onSubmit={submit}
      style={{ border: "1px solid #333", borderRadius: 10, padding: 12 }}
    >
      <div style={{ fontWeight: 700, marginBottom: 10 }}>Create ticket</div>

      <div style={{ display: "grid", gap: 10 }}>
        <label>
          Title
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: "100%", padding: 10, marginTop: 6 }}
          />
        </label>

        <label>
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            style={{ width: "100%", padding: 10, marginTop: 6 }}
          />
        </label>

        <label>
          Priority
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            style={{ width: "100%", padding: 10, marginTop: 6 }}
          >
            <option value="low">low</option>
            <option value="normal">normal</option>
            <option value="high">high</option>
            <option value="urgent">urgent</option>
          </select>
        </label>

        <button type="submit">Create</button>
      </div>
    </form>
  );
}
