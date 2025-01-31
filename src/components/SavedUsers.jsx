import React from "react";

function SavedUsers() {
  const savedUsers = JSON.parse(localStorage.getItem("savedUsers")) || [];

  return (
    <div className="container">
      <h1>Saved Users</h1>
      <div className="user-list">
        {savedUsers.map((user, index) => (
          <div key={index} className="user-card">
            <img src={user.picture.large} alt="Profile" />
            <h3>{user.name.first} {user.name.last}</h3>
            <p>Email: {user.email}</p>
            <p>Location: {user.location.city}, {user.location.country}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SavedUsers;
