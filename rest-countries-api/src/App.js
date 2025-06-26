import React from "react";
import { Routes, Route } from 'react-router-dom';
import Header from "./components/Header";
import Countries from "./components/Countries";
import Country from "./components/Country";
import Login from "./components/Login";
import Favorites from './components/Favorites';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Header/>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Countries />} />
          <Route path="/countries/:name" element={<Country />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;