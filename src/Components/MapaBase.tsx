import React, { useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css"; // Asegúrate de agregar los estilos en el archivo CSS
import { Link } from "react-router-dom";

const BaseMap: React.FC = () => {
  const MapRefresher = () => {
    const map = useMap();
    useEffect(() => {
      map.invalidateSize();
    }, [map]);
    return null;
  };

  return (
    <MapContainer
      center={[3.4516, -76.532]}
      zoom={12}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />
      <MapRefresher />
    </MapContainer>
  );
};

const SideMenu: React.FC = () => {
  
  return (
    <div className="side-menu">
      <h2>Introducción del Proyecto</h2>
      <p>
        Este proyecto está enfocado en mostrar un mapa interactivo de la ciudad de Santiago de Cali,
        incluyendo puntos de interés y categorías como colegios, hospitales, monumentos, etc, un delimitador de columnas,
        y diferentes herramientas visuales que nos ayudaran a entender un poco mejor la distribuicion de nuestra ciudad,
        sus puntos de interes y los lugares donde deberiamos tener precausion.
      </p>
      <img src="icons/cali.jpg" alt="Santiago de Cali" className="city-image" />
      <h3>Propósito del Proyecto</h3>
      <p>
        El propósito es visualizar información importante sobre la ciudad, como ubicación
        de infraestructuras clave y zonas de interés, con funcionalidades interactivas.
      </p>
      <h4>Integrantes</h4>
      <p>
        -Jhonny Cataño Rodriguez
        <br />                                                       
        -Jhon Esteban Hernandez
      </p>
      <Link to="/map" className="map-button">
        Mapa Principal
      </Link>
    </div>
  );
};

const MainLayout: React.FC = () => {
  return (
    <div className="main-container">
      <SideMenu />
      <div className="map-container">
        <BaseMap />
      </div>
    </div>
  );
};

export default MainLayout;
