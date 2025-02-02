import  { useState, useEffect } from "react";
import { Card, CardContent, CardMedia, Typography, Button, CardActions } from "@mui/material";
import WeatherModal from "./WeatherModal";

const UserCard = ({ user, onSave, onDelete, isSaved }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [weather, setWeather] = useState(null);

  const weatherIconMapping = {
    0: "☀️",
    1: "🌤️",
    2: "⛅",
    3: "☁️",
    45: "🌫️",
    48: "🌫️",
    51: "🌦️",
    53: "🌦️",
    55: "🌦️",
    61: "🌧️",
    63: "🌧️",
    65: "🌧️",
    66: "❄️",
    67: "❄️",
    71: "❄️",
    73: "❄️",
    75: "❄️",
    77: "❄️",
    80: "🌧️",
    81: "🌧️",
    82: "🌧️",
    85: "❄️",
    86: "❄️",
    95: "⛈️",
    96: "⛈️",
    99: "⛈️"
  };

  const fetchWeather = async (city, country) => {
    try {
      const geoResponse = await fetch(`https://nominatim.openstreetmap.org/search?city=${city}&country=${country}&format=json`);
      const geoData = await geoResponse.json();
      if (!geoData || geoData.length === 0) throw new Error("Coordinates not found for the city");
      const { lat, lon } = geoData[0];
      const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min&hourly=temperature_2m&timezone=auto`);
      const data = await weatherResponse.json();
      const currentTemp = data.current_weather.temperature;
      const weatherCode = data.current_weather.weathercode;
      const minTemp = data.daily.temperature_2m_min[0];
      const maxTemp = data.daily.temperature_2m_max[0];
      setWeather({
        currentTemp,
        weatherCode,
        minTemp,
        maxTemp,
        icon: weatherIconMapping[weatherCode] || "❔",
        hourly: data.hourly.temperature_2m,
        time: data.hourly.time,
        lat: parseFloat(lat),
        lon: parseFloat(lon)
      });
      setModalOpen(true);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  useEffect(() => {
    if (!modalOpen || !user.location.city) return;
    const interval = setInterval(() => {
      fetchWeather(user.location.city, user.location.country);
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [modalOpen, user.location.city, user.location.country]);

  return (
    <Card sx={{ maxWidth: 345, margin: "auto", textAlign: "center", padding: 2 }}>
      <CardMedia
        component="img"
        height="140"
        image={user.picture.large}
        alt={`${user.name.first} ${user.name.last}`}
        sx={{ width: 120, height: 120, margin: "auto", borderRadius: "50%", objectFit: "cover" }}
      />
      <CardContent>
        <Typography variant="h6">{user.name.first} {user.name.last}</Typography>
        <Typography variant="body2" color="text.secondary">Gender: {user.gender}</Typography>
        <Typography variant="body2" color="text.secondary">Email: {user.email}</Typography>
        <Typography variant="body2" color="text.secondary">Location: {user.location.city}, {user.location.country}</Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: "center" }}>
        {!isSaved && (
          <Button size="small" color="primary" onClick={onSave}>
            Save
          </Button>
        )}
        {isSaved && (
          <Button size="small" color="error" onClick={onDelete}>
            Delete
          </Button>
        )}
        <Button size="small" onClick={() => fetchWeather(user.location.city, user.location.country)}>
          Weather
        </Button>
      </CardActions>
      {modalOpen && <WeatherModal weather={weather} onClose={() => setModalOpen(false)} />}
    </Card>
  );
};

export default UserCard;
