export default function InfoPage({ user }) {
  const displayName =
    user?.name ||
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
    user?.email ||
    "User";

  return (
    <div className="grid-layout">
      <div className="right-col" style={{ width: "100%" }}>
        <div className="card">
          <div className="card-head">
            <div className="card-title">Info</div>
          </div>

          <div className="card-body">
            <div className="info-grid">
              <div className="info-box">
                <div className="info-label">User</div>
                <div className="info-value">{displayName}</div>
              </div>

              <div className="info-box">
                <div className="info-label">Role / Position</div>
                <div className="info-value">
                  {user?.role || user?.position || "IT"}
                </div>
              </div>

              <div className="info-box">
                <div className="info-label">Portal</div>
                <div className="info-value">Tickets / Chat / Info</div>
              </div>

              <div className="info-box">
                <div className="info-label">Signature</div>
                <div className="info-value">BY IT DEV TEAM</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
