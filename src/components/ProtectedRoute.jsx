import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { apiFetch } from "../api/http";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    apiFetch("/user")
      .then(() => {
        setAuthed(true);
      })
      .catch(() => {
        setAuthed(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ padding: 40 }}>Loading...</div>;

  if (!authed) return <Navigate to="/login" replace />;

  return children;
}
