import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
} from "@mui/material";

const WeatherModal = ({ weather, onClose }) => {
  if (!weather) {
    return (
      <Dialog open={true} onClose={onClose}>
        <DialogTitle>Loading...</DialogTitle>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Close
          </Button>
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
    <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Weather Information</DialogTitle>
      <DialogContent>
        <Typography variant="h6">Current Temperature:</Typography>
        <Typography>
          {weather.temperature}°C (Condition code: {weather.condition})
        </Typography>

        <Typography variant="h6" sx={{ mt: 2 }}>
          Hourly Forecast (Today):
        </Typography>

        <Grid container spacing={2} sx={{ mt: 2 }}>
          {hourlyData.map((entry, idx) => (
            <Grid item xs={6} sm={4} md={3} key={idx}>
              <Box
                sx={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "8px",
                  textAlign: "center",
                }}
              >
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  {entry.time}
                </Typography>
                <Typography variant="body2">{entry.temp}°C</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WeatherModal;
