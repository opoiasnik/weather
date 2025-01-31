import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  CardActions,
} from "@mui/material";
import WeatherModal from "./WeatherModal";

const UserCard = ({ user, onSave, onDelete, isSaved }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [weather, setWeather] = useState(null);

  const fetchWeather = async (latitude, longitude) => {
    console.log("Coordinates sent to Open-Meteo:", { latitude, longitude });

    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m`
      );
      const data = await response.json();
      console.log("Open-Meteo API Response:", data);

      const weather = data.current_weather;
      setWeather({
        temperature: weather.temperature,
        condition: weather.weathercode,
        hourly: data.hourly.temperature_2m,
        time: data.hourly.time,
      });
      setModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch weather data from Open-Meteo", error);
      alert("Failed to fetch weather data!");
    }
  };

  useEffect(() => {
    if (!modalOpen || !user.location.coordinates.latitude) return;

    const interval = setInterval(() => {
      fetchWeather(
        parseFloat(user.location.coordinates.latitude),
        parseFloat(user.location.coordinates.longitude)
      );
    }, 5 * 60 * 1000); // 5 минут

    return () => clearInterval(interval);
  }, [modalOpen]);

  return (
    <Card sx={{ maxWidth: 345, margin: "auto", textAlign: "center", padding: 2 }}>
      <CardMedia
        component="img"
        height="140"
        image={user.picture.large}
        alt={`${user.name.first} ${user.name.last}`}
        sx={{
          width: 120,
          height: 120,
          margin: "auto",
          borderRadius: "50%",
          objectFit: "cover",
        }}
      />
      <CardContent>
        <Typography variant="h6">
          {user.name.first} {user.name.last}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Email: {user.email}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Location: {user.location.city}, {user.location.country}
        </Typography>
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
        <Button
          size="small"
          onClick={() =>
            fetchWeather(
              parseFloat(user.location.coordinates.latitude),
              parseFloat(user.location.coordinates.longitude)
            )
          }
        >
          Weather
        </Button>
      </CardActions>
      {modalOpen && (
        <WeatherModal
          weather={weather}
          onClose={() => setModalOpen(false)}
        />
      )}
    </Card>
  );
};

export default UserCard;
