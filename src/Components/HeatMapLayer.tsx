import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet.heat';
import 'leaflet/dist/leaflet.css';
import { useMap } from 'react-leaflet';

interface HeatMapLayerProps {
  points: [number, number, number][];
  color?: string;
}

const HeatMapLayer: React.FC<HeatMapLayerProps> = ({ points, color }) => {
   const map = useMap()
  useEffect(() => {
    // map.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //   attribution: '© OpenStreetMap contributors',
    // }).addTo(map);

    L.heatLayer(points, {
      radius: 25,
      blur: 15,
      gradient: color ? { 0.9: color, 0.6: color, 1: 'red' } : { 0.9: 'blue', 0.7: 'lime', 1: 'red' },
    }).addTo(map);

    // return () => {
    //   map.remove();
    // };
  }, [points, color]);

  return <></>;
};

export default HeatMapLayer;


