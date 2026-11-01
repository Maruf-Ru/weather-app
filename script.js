const cityInput = document.querySelector('#cityInput');
const searchBtn = document.querySelector('#searchBtn');
const weatherResult = document.querySelector('#weatherResult');

async function getLocation(city) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Shohor khuje pawa jayni (' + response.status + ')');
    }

    const data = await response.json();
    if (!data.results) {
    throw new Error('Ei nam e kono shohor pawa jayni');
}
    return data.results[0];
}

async function getWeather(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,weather_code`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Abhawa ana jayni (' + response.status + ')');
    }

    const data = await response.json();
    return data.current;
}

function getWeatherEmoji(code) {
    if (code === 0) return '☀️';
    if (code <= 3) return '⛅';
    if (code === 45 || code === 48) return '🌫️';
    if (code >= 51 && code <= 57) return '🌦️';
    if (code >= 61 && code <= 67) return '🌧️';
    if (code >= 71 && code <= 77) return '❄️';
    if (code >= 80 && code <= 82) return '🌧️';
    if (code >= 85 && code <= 86) return '❄️';
    if (code >= 95) return '⛈️';
    return '🌡️';
}


async function handleSearch() {
    const city = cityInput.value.trim();

    if (!city) {
        weatherResult.textContent = 'Shohor er nam likho.';
        return;
    }

    weatherResult.textContent = 'Loading...';
    searchBtn.disabled = true;

    try {
        const location = await getLocation(city);
        const weather = await getWeather(location.latitude, location.longitude);

       const emoji = getWeatherEmoji(weather.weather_code);

        weatherResult.textContent =
            `${emoji} ${location.name}, ${location.country}: ${weather.temperature_2m}°C, batash ${weather.wind_speed_10m} km/h`;
    } catch (error) {
        weatherResult.textContent = 'Bhul: ' + error.message;
    } finally {
        searchBtn.disabled = false;
    }
}

searchBtn.addEventListener('click', handleSearch);

cityInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});