import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Grid } from "@mui/material";

const WeatherModal = ({ weather, onClose }) => {
  if (!weather) {
    return (
      <Dialog open onClose={onClose}>
        <DialogTitle>Loading...</DialogTitle>
        <DialogActions>
          <Button onClick={onClose} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    );
  }

  const today = new Date().toISOString().split("T")[0];
  const hourlyData = weather.hourly
    .map((temp, index) => {
      const date = new Date(weather.time[index]);
      const day = date.toISOString().split("T")[0];
      const time = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      return { day, time, temp };
    })
    .filter((entry) => entry.day === today);

  return (
    <Dialog open onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Weather Details</DialogTitle>
      <DialogContent>
        <Box sx={{ textAlign: "center", my: 2 }}>
          <Typography variant="h2">{weather.icon}</Typography>
        </Box>
        <Typography variant="h6">Current Temperature:</Typography>
        <Typography variant="body1">{weather.currentTemp}°C</Typography>
        <Typography variant="h6" sx={{ mt: 2 }}>Lowest Temperature Today:</Typography>
        <Typography variant="body1">{weather.minTemp}°C</Typography>
        <Typography variant="h6" sx={{ mt: 2 }}>Highest Temperature Today:</Typography>
        <Typography variant="body1">{weather.maxTemp}°C</Typography>
        <Typography variant="h6" sx={{ mt: 2 }}>Hourly Forecast (Today):</Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {hourlyData.map((entry, idx) => (
            <Grid item xs={6} sm={4} md={3} key={idx}>
              <Box sx={{ border: "1px solid #ddd", borderRadius: "8px", p: 1, textAlign: "center" }}>
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>{entry.time}</Typography>
                <Typography variant="body2">{entry.temp}°C</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
        <Typography variant="h6" sx={{ mt: 2 }}>Location on Map:</Typography>
        <Box sx={{ mt: 1, width: "100%", height: "300px" }}>
          {weather.lat && weather.lon ? (
            <iframe
              title="Map"
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              marginHeight="0"
              marginWidth="0"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${weather.lon - 0.05}%2C${weather.lat - 0.05}%2C${weather.lon + 0.05}%2C${weather.lat + 0.05}&layer=mapnik&marker=${weather.lat}%2C${weather.lon}`}
            ></iframe>
          ) : (
            <Typography>Map not available.</Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default WeatherModal;
