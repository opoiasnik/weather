import React, { useEffect, useState } from "react";
import UserCard from "../components/UserCard";
import { Grid, Typography } from "@mui/material";

const SavedUsers = () => {
  const [savedUsers, setSavedUsers] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedUsers")) || [];
    setSavedUsers(saved);
  }, []);

  const deleteUser = (index) => {
    const updatedSavedUsers = savedUsers.filter((_, i) => i !== index);
    setSavedUsers(updatedSavedUsers);
    localStorage.setItem("savedUsers", JSON.stringify(updatedSavedUsers));
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Saved Users
      </Typography>
      <Grid container spacing={3}>
        {savedUsers.map((user, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <UserCard user={user} onDelete={() => deleteUser(index)} isSaved />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default SavedUsers;
