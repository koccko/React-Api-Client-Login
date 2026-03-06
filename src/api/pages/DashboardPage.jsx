import { useEffect, useState } from "react";

export default function DashboardPage({ user }) {
  const [weather, setWeather] = useState(null);
  const [weatherError, setWeatherError] = useState("");
  const [loadingWeather, setLoadingWeather] = useState(true);

  const displayName =
    user?.name ||
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
    user?.email ||
    "User";

  useEffect(() => {
    let ignore = false;

    async function loadWeather() {
      try {
        setLoadingWeather(true);
        setWeatherError("");

        const res = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=42.1354&longitude=24.7453&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=Europe%2FSofia",
        );

        if (!res.ok) {
          throw new Error("Failed to load weather");
        }

        const data = await res.json();

        if (!ignore) {
          setWeather(data?.current || null);
        }
      } catch (e) {
        if (!ignore) {
          setWeatherError(e?.message || "Failed to load weather");
        }
      } finally {
        if (!ignore) {
          setLoadingWeather(false);
        }
      }
    }

    loadWeather();
    return () => {
      ignore = true;
    };
  }, []);

  function weatherLabel(code) {
    const map = {
      0: "Clear sky",
      1: "Mainly clear",
      2: "Partly cloudy",
      3: "Overcast",
      45: "Fog",
      48: "Depositing rime fog",
      51: "Light drizzle",
      53: "Moderate drizzle",
      55: "Dense drizzle",
      61: "Slight rain",
      63: "Moderate rain",
      65: "Heavy rain",
      71: "Slight snow",
      73: "Moderate snow",
      75: "Heavy snow",
      80: "Rain showers",
      81: "Moderate showers",
      82: "Violent showers",
      95: "Thunderstorm",
    };

    return map[code] || "Unknown";
  }

  return (
    <div className="dashboard-page">
      <section className="dashboard-hero glass-card">
        <div>
          <div className="dashboard-kicker">Dashboard</div>
          <h1>Welcome, {displayName}</h1>
          <p>Central overview for tickets, chat and system activity.</p>
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="dash-card glass-card">
          <div className="dash-label">User</div>
          <div className="dash-value">{displayName}</div>
          <div className="dash-sub">Authenticated session active</div>
        </div>

        <div className="dash-card glass-card">
          <div className="dash-label">Role</div>
          <div className="dash-value">
            {user?.role || user?.position || "IT"}
          </div>
          <div className="dash-sub">Current access profile</div>
        </div>

        <div className="dash-card glass-card">
          <div className="dash-label">Portal</div>
          <div className="dash-value">IT Team Portal</div>
          <div className="dash-sub">Tickets / Chat / Dashboard</div>
        </div>
      </section>

      <section className="dashboard-lower">
        <div className="weather-card glass-card">
          <div className="section-head">
            <div>
              <h2>Weather in Plovdiv</h2>
              <p>Live conditions</p>
            </div>
          </div>

          {loadingWeather ? (
            <div className="empty-state">Loading weather...</div>
          ) : weatherError ? (
            <div className="error-box">{weatherError}</div>
          ) : weather ? (
            <div className="weather-content">
              <div className="weather-main">
                <div className="weather-temp">
                  {Math.round(weather.temperature_2m)}°C
                </div>
                <div className="weather-status">
                  {weatherLabel(weather.weather_code)}
                </div>
              </div>

              <div className="weather-meta">
                <div className="weather-row">
                  <span>Feels like</span>
                  <strong>{Math.round(weather.apparent_temperature)}°C</strong>
                </div>
                <div className="weather-row">
                  <span>Humidity</span>
                  <strong>{weather.relative_humidity_2m}%</strong>
                </div>
                <div className="weather-row">
                  <span>Wind</span>
                  <strong>{Math.round(weather.wind_speed_10m)} km/h</strong>
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-state">No weather data</div>
          )}
        </div>

        <div className="quick-card glass-card">
          <div className="section-head">
            <div>
              <h2>Quick actions</h2>
              <p>Fast navigation</p>
            </div>
          </div>

          <div className="quick-actions">
            <a className="quick-action" href="/tickets">
              Open Tickets
            </a>
            <a className="quick-action" href="/chat">
              Open Chat
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
