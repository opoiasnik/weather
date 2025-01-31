import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/home.css";

function Home() {
  const [users, setUsers] = useState([]); // Случайные пользователи
  const [savedUsers, setSavedUsers] = useState([]); // Сохранённые пользователи
  const [showSaved, setShowSaved] = useState(false); // Переключение между списками
  const [selectedUser, setSelectedUser] = useState(null); // Выбранный пользователь для отображения погоды
  const [weatherData, setWeatherData] = useState(null); // Данные о погоде
  const [modalOpen, setModalOpen] = useState(false); // Состояние модального окна

  // Загрузка случайных пользователей
  const loadUsers = () => {
    axios.get("https://randomuser.me/api/?results=5").then((response) => {
      setUsers((prevUsers) => [...prevUsers, ...response.data.results]);
    });
  };

  // Загрузка сохранённых пользователей из localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedUsers")) || [];
    setSavedUsers(saved);

    // Сразу загружаем случайных пользователей
    loadUsers();
  }, []);

  // Сохранение пользователя
  const saveUser = (user) => {
    const updatedSavedUsers = [...savedUsers, user];
    setSavedUsers(updatedSavedUsers);
    localStorage.setItem("savedUsers", JSON.stringify(updatedSavedUsers));
    alert("User saved!");
  };

  // Удаление пользователя
  const deleteUser = (index) => {
    const updatedSavedUsers = savedUsers.filter((_, i) => i !== index);
    setSavedUsers(updatedSavedUsers);
    localStorage.setItem("savedUsers", JSON.stringify(updatedSavedUsers));
    alert("User removed!");
  };

  // Преобразование weathercode в описание
  const getWeatherCondition = (weatherCode) => {
    const conditions = {
      0: "Clear sky",
      1: "Mainly clear",
      2: "Partly cloudy",
      3: "Overcast",
      45: "Fog",
      48: "Depositing rime fog",
      51: "Drizzle: Light",
      53: "Drizzle: Moderate",
      55: "Drizzle: Dense intensity",
      61: "Rain: Slight",
      63: "Rain: Moderate",
      65: "Rain: Heavy",
      80: "Rain showers: Slight",
      81: "Rain showers: Moderate",
      82: "Rain showers: Violent",
      95: "Thunderstorm: Slight or moderate",
      96: "Thunderstorm with slight hail",
      99: "Thunderstorm with heavy hail",
    };
    return conditions[weatherCode] || "Unknown condition";
  };

  // Получение данных о погоде через Open-Meteo API
  const fetchWeather = async (latitude, longitude) => {
    if (!latitude || !longitude) {
      console.error("Invalid coordinates:", { latitude, longitude });
      alert("Invalid location data for this user!");
      return;
    }
    try {
      const response = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );
      console.log("Open-Meteo API Response:", response.data); // Вывод ответа в консоль
      const weather = response.data.current_weather;
      setWeatherData({
        temperature: weather.temperature,
        condition: getWeatherCondition(weather.weathercode),
      });
      setModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch weather data from Open-Meteo", error);
    }
  };

  return (
    <div className="container">
      <h1>User List</h1>
      <div>
        <button onClick={() => setShowSaved(!showSaved)}>
          {showSaved ? "Show Random Users" : "Show Saved Users"}
        </button>
      </div>
      {showSaved ? (
        // Отображение сохранённых пользователей
        <div className="user-list">
          {savedUsers.length > 0 ? (
            savedUsers.map((user, index) => (
              <div key={index} className="user-card">
                <img src={user.picture.large} alt="Profile" />
                <h3>
                  {user.name.first} {user.name.last}
                </h3>
                <p>Email: {user.email}</p>
                <p>
                  Location: {user.location.city}, {user.location.country}
                </p>
                <button
                  className="delete-button"
                  onClick={() => deleteUser(index)}
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            <p>No saved users found!</p>
          )}
        </div>
      ) : (
        // Отображение случайных пользователей
        <div className="user-list">
          {users.map((user, index) => (
            <div key={index} className="user-card">
              <img src={user.picture.large} alt="Profile" />
              <h3>
                {user.name.first} {user.name.last}
              </h3>
              <p>Email: {user.email}</p>
              <p>
                Location: {user.location.city}, {user.location.country}
              </p>
              <button
                className="save-button"
                onClick={() => saveUser(user)}
              >
                Save
              </button>
              <button
                className="weather-button"
                onClick={() => {
                  setSelectedUser(user);
                  fetchWeather(
                    parseFloat(user.location.coordinates.latitude),
                    parseFloat(user.location.coordinates.longitude)
                  );
                }}
              >
                Weather
              </button>
            </div>
          ))}
        </div>
      )}
      {!showSaved && (
        <button className="load-more" onClick={loadUsers}>
          Load More Users
        </button>
      )}

      {/* Модальное окно с погодой */}
      {modalOpen && weatherData && selectedUser && (
        <div className="weather-modal">
          <h2>Weather for {selectedUser.location.city}</h2>
          <p>Temperature: {weatherData.temperature}°C</p>
          <p>Condition: {weatherData.condition}</p>
          <button onClick={() => setModalOpen(false)}>Close</button>
        </div>
      )}
    </div>
  );
}

export default Home;
