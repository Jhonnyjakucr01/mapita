// InfoBox.tsx
import React from 'react';

const categoryColors: { [key: string]: string } = {
  colegios: "Azul",
  hospitales: "Amarillo",
  universidades: "Rosado",
  hoteles:"Rojo",
  bancos: "Dorado",
  centros_comerciales: "Naranja",
  monumento: "Morado",
  
  


  // Añade más categorías y sus colores aquí
};

interface InfoBoxProps {
  visible: boolean; // Prop para controlar la visibilidad del InfoBox
}

const InfoBox: React.FC<InfoBoxProps> = ({ visible }) => {
  if (!visible) return null; // No renderizar si no es visible

  // Posición predefinida en la esquina superior derecha
  const infoBoxStyle: React.CSSProperties = {
    position: 'absolute',
    top: '10px',
    right: '10px', // Cambiado a right
    backgroundColor: 'white',
    padding: '10px',
    borderRadius: '5px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  };

  return (
    <div style={infoBoxStyle}>
      <h2>Colores por Categoría</h2>
      <ul>
        {Object.entries(categoryColors).map(([category, color]) => (
          <li key={category}>
            {category.charAt(0).toUpperCase() + category.slice(1)}: <span style={{ color }}>{color}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InfoBox;
