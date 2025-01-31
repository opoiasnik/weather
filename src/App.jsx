import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import SavedUsers from "./components/SavedUsers";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/saved" element={<SavedUsers />} />
      </Routes>
    </Router>
  );
}

export default App;
