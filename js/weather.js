// Weather widget using Open-Meteo (no API key required) + browser geolocation
(function () {
  const widget = document.getElementById('weather-widget');
  if (!widget) return;

  const icons = {
    0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️',
    45: '🌫️', 48: '🌫️',
    51: '🌦️', 53: '🌦️', 55: '🌧️',
    61: '🌧️', 63: '🌧️', 65: '🌧️',
    71: '🌨️', 73: '🌨️', 75: '❄️',
    80: '🌦️', 81: '🌧️', 82: '⛈️',
    95: '⛈️', 96: '⛈️', 99: '⛈️',
  };

  const descriptions = {
    0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
    45: 'Fog', 48: 'Icy fog',
    51: 'Light drizzle', 53: 'Drizzle', 55: 'Heavy drizzle',
    61: 'Light rain', 63: 'Rain', 65: 'Heavy rain',
    71: 'Light snow', 73: 'Snow', 75: 'Heavy snow',
    80: 'Showers', 81: 'Rain showers', 82: 'Heavy showers',
    95: 'Thunderstorm', 96: 'Thunderstorm', 99: 'Thunderstorm',
  };

  function renderWidget(temp, code, city) {
    const icon = icons[code] || '🌡️';
    const desc = descriptions[code] || 'Unknown';
    widget.innerHTML = `
      <div class="weather-inner">
        <div class="weather-icon" aria-hidden="true">${icon}</div>
        <div class="weather-info">
          <span class="weather-temp">${Math.round(temp)}°F</span>
          <span class="weather-desc">${desc}</span>
          <span class="weather-location">📍 ${city}</span>
        </div>
      </div>`;
  }

  function showError() {
    widget.innerHTML = '<div class="weather-loading">Weather unavailable</div>';
  }

  function fetchWeather(lat, lon, city) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=fahrenheit`;
    fetch(url)
      .then(function (res) { return res.json(); })
      .then(function (data) {
        const cw = data.current_weather;
        renderWidget(cw.temperature, cw.weathercode, city);
      })
      .catch(showError);
  }

  function reverseGeocode(lat, lon, cb) {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
    fetch(url, { headers: { 'Accept-Language': 'en' } })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        const city = data.address.city || data.address.town || data.address.village || 'Your Location';
        cb(city);
      })
      .catch(function () { cb('Your Location'); });
  }

  if (!navigator.geolocation) {
    showError();
    return;
  }

  navigator.geolocation.getCurrentPosition(
    function (pos) {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      reverseGeocode(lat, lon, function (city) {
        fetchWeather(lat, lon, city);
      });
    },
    showError,
    { timeout: 8000 }
  );
})();
