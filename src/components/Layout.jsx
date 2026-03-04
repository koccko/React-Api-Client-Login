export default function Layout({ title, onLogout, children }) {
  return (
    <div
      style={{
        padding: 28,
        fontFamily: "Arial",
        maxWidth: 1100,
        margin: "0 auto",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <h1 style={{ margin: 0 }}>{title}</h1>
        <button onClick={onLogout} style={{ marginLeft: "auto" }}>
          Logout
        </button>
      </div>
      <div style={{ marginTop: 16 }}>{children}</div>
    </div>
  );
}
