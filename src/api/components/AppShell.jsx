import TopBar from "./TopBar.jsx";
import Footer from "./Footer.jsx";

export default function AppShell({ user, onLogout, children }) {
  return (
    <div className="app-shell">
      <TopBar user={user} onLogout={onLogout} />
      <main className="main-shell">{children}</main>
      <Footer />
    </div>
  );
}
