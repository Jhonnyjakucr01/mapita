import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainLayout from "./Components/MapaBase";
import MapWithFilter from "./Components/MapaComponent";
// import  from "./"; // Este es tu componente con el mapa principal

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Ruta para el menú lateral */}
        <Route path="/" element={<MainLayout />} />
        <Route path="/map" element={<MapWithFilter />} />
        {/* Ruta para el mapa principal */}
        {/* <Route path="/mapa" element={<MapWithFilter />} /> */}
      </Routes>
    </Router>
  );
};

export default App;
