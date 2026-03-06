import { useState } from "react";

export default function TicketForm({ onCreate, busy }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("normal");

  const submit = async (e) => {
    e.preventDefault();

    const cleanTitle = title.trim();
    const cleanDescription = description.trim();

    if (!cleanTitle || !cleanDescription) return;

    await onCreate({
      title: cleanTitle,
      description: cleanDescription,
      priority,
    });

    setTitle("");
    setDescription("");
    setPriority("normal");
  };

  return (
    <div className="card">
      <div className="card-head">
        <div className="card-title">Create Ticket</div>
      </div>

      <div className="card-body">
        <form className="form-grid" onSubmit={submit}>
          <label className="field">
            <span className="field-label">Title</span>
            <input
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Напр. Проблем с принтера"
            />
          </label>

          <label className="field">
            <span className="field-label">Description</span>
            <textarea
              className="textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Опиши проблема..."
            />
          </label>

          <label className="field">
            <span className="field-label">Priority</span>
            <select
              className="select"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </label>

          <button className="primary-btn" type="submit" disabled={busy}>
            {busy ? "Creating..." : "Create Ticket"}
          </button>
        </form>
      </div>
    </div>
  );
}
