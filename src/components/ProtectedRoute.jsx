export default function ProtectedRoute({ authed, children, fallback }) {
  if (!authed) return fallback;
  return children;
}
