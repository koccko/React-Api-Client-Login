import { useEffect, useMemo, useState } from "react";
import { listRooms, listMessages, sendMessage } from "../chat.js";

export default function ChatPage() {
  const [rooms, setRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState("");

  const selectedRoom = useMemo(
    () => rooms.find((r) => r.id === selectedRoomId) || null,
    [rooms, selectedRoomId],
  );

  const loadRooms = async () => {
    try {
      setError("");
      const data = await listRooms();
      const items = Array.isArray(data) ? data : data?.items || [];
      setRooms(items);

      if (!selectedRoomId && items.length > 0) {
        setSelectedRoomId(items[0].id);
      }
    } catch (e) {
      setError(e?.message || "Failed to load rooms");
    } finally {
      setLoadingRooms(false);
    }
  };

  const loadMessages = async (roomId) => {
    if (!roomId) {
      setMessages([]);
      return;
    }

    try {
      setLoadingMessages(true);
      const data = await listMessages(roomId);
      const items = Array.isArray(data) ? data : data?.items || [];
      setMessages(items);
    } catch (e) {
      setError(e?.message || "Failed to load messages");
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  useEffect(() => {
    loadMessages(selectedRoomId);

    if (!selectedRoomId) return;
    const id = setInterval(() => loadMessages(selectedRoomId), 5000);
    return () => clearInterval(id);
  }, [selectedRoomId]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!selectedRoomId || !message.trim()) return;

    try {
      await sendMessage(selectedRoomId, { message: message.trim() });
      setMessage("");
      await loadMessages(selectedRoomId);
    } catch (e) {
      setError(e?.message || "Failed to send message");
    }
  };

  return (
    <div className="chat-page">
      <div className="chat-layout">
        <aside className="chat-rooms glass-card">
          <div className="section-head">
            <h2>Rooms</h2>
            <span className="live-badge">Live</span>
          </div>

          {loadingRooms ? (
            <div className="empty-state">Loading rooms...</div>
          ) : rooms.length ? (
            <div className="room-list">
              {rooms.map((room) => (
                <button
                  key={room.id}
                  className={`room-item ${selectedRoomId === room.id ? "active" : ""}`}
                  onClick={() => setSelectedRoomId(room.id)}
                >
                  <div className="room-title">
                    {room.name || `Room #${room.id}`}
                  </div>
                  <div className="room-sub">
                    {room.description || "Team discussion"}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="empty-state">No rooms available</div>
          )}
        </aside>

        <section className="chat-main glass-card">
          <div className="section-head">
            <div>
              <h2>{selectedRoom?.name || "Chat"}</h2>
              <p>Messages auto-refresh every 5 seconds</p>
            </div>
          </div>

          {error ? <div className="error-box">{error}</div> : null}

          <div className="chat-messages">
            {loadingMessages ? (
              <div className="empty-state">Loading messages...</div>
            ) : messages.length ? (
              messages.map((msg) => (
                <div className="message-row" key={msg.id}>
                  <div className="message-bubble">
                    <div className="message-author">
                      {msg.user?.name || msg.author || "User"}
                    </div>
                    <div className="message-text">
                      {msg.message || msg.body}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">No messages yet</div>
            )}
          </div>

          <form className="chat-compose" onSubmit={handleSend}>
            <input
              type="text"
              className="chat-input"
              placeholder="Write a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button type="submit" className="chat-send-btn">
              Send
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
