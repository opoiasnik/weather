import { useEffect, useState } from "react";
import axios from "axios";
import UserCard from "../components/UserCard";
import { Grid, Button, Typography } from "@mui/material";

const Home = () => {
  const [users, setUsers] = useState([]);
  const [savedUsers, setSavedUsers] = useState([]);

  useEffect(() => {
    loadUsers();
    const saved = JSON.parse(localStorage.getItem("savedUsers")) || [];
    setSavedUsers(saved);
  }, []);

  const loadUsers = async () => {
    const response = await axios.get("https://randomuser.me/api/?results=5");
    
    setUsers((prevUsers) => [...prevUsers, ...response.data.results]);
  };

  const saveUser = (user) => {
    const updatedSavedUsers = [...savedUsers, user];
    setSavedUsers(updatedSavedUsers);
    localStorage.setItem("savedUsers", JSON.stringify(updatedSavedUsers));
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Random Users
      </Typography>
      <Grid container spacing={3}>
        {users.map((user, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <UserCard user={user} onSave={() => saveUser(user)} />
          </Grid>
        ))}
      </Grid>
      <Button
        variant="contained"
        color="primary"
        onClick={loadUsers}
        sx={{ mt: 4 }}
      >
        Load More Users
      </Button>
    </div>
  );
};

export default Home;
