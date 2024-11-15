import React, { useState, useEffect, useCallback } from "react";
import * as XLSX from "xlsx";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  GeoJSON,
  LayerGroup,
} from "react-leaflet";
import L, { PathOptions } from "leaflet";
import "leaflet/dist/leaflet.css";
import HeatMapLayer from "./HeatMapLayer";
import FilterMenu from "./FilterMenu";
import * as turf from "@turf/turf"; // Necesitarás Turf.js para verificar si un punto está dentro de un polígono
import InfoBox from "./Infobox";
import ModalComunaInfo from "./ModalComunaInfo";

const MapWithFilter: React.FC = () => {
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [filteredMarkers, setFilteredMarkers] = useState<MarkerData[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set());
  const [selectedHeatMaps, setSelectedHeatMaps] = useState<Set<string>>(
    new Set()
  );
  const [geoJsonData, setGeoJsonData] = useState<any>(null); //guardar los datos geojson de los limites
  const [geoJsonDataColor, setGeoJsonDataColor] = useState<any>(null); //guardar los datos geojson de los limites

  const [showBoundaries, setShowBoundaries] = useState<boolean>(false); //mostrar los limites de las comunas y la ciudad
  const [showColors, setShowColors] = useState<boolean>(false); //mostrar los limites de las comunas y la ciudad
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedComuna, setSelectedComuna] = useState<ComunaProperties | undefined>(
    undefined
  );

  const [counts, setCounts] = useState<CommuneMarkerCounts>({}); // Estado para guardar el conteo de marcadores por comuna

  interface ComunaProperties {
    comuna: string;
    poblacion: number;
    viviendas: number;
    estratoModa: number;
    establecimientos: string;
    centrosSalud: number;
    puestosSalud: number;
    establecimientosSecundaria: number;
    establecimientosPrimaria: number;
    establecimientosPreescolar: number;
    bibliotecas: number;
    hoteles: number;
    seguridad: string;
    homicidios: number;
    hurtos: number;
    suicidios: number;
  }

  //informacion del marcador
  interface MarkerData {
    nombre: string;
    tipo: string;
    lat: number;
    lng: number;
  }

  interface CommuneMarkerCounts {
    [communeName: string]: {
      [markerType: string]: number;
    };
  }

  ///////CARGUE INFORMACION EXCEL Y GEOJSON///////

  //cargar la informacion desde el excel
  useEffect(() => {
    // Cargar el archivo GeoJSON de las comunas y el Excel con los marcadores
    const fetchGeoJson = async () => {
      try {
        const response = await fetch("/data/comunasCoo.geojson");
        const data = await response.json();
        setGeoJsonData(data);
        setGeoJsonDataColor(data);
      } catch (error) {
        console.error("Error al cargar el archivo GeoJSON:", error);
      }
    };

    const fetchData = async () => {
      try {
        const response = await fetch("/data/coordenadas comunas cali.xlsx");
        const data = await response.arrayBuffer();
        const workbook = XLSX.read(data, { type: "array" });
        const allMarkers: MarkerData[] = [];
        workbook.SheetNames.forEach((sheetName) => {
          const sheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(sheet);

          jsonData.forEach((row: any) => {
            const lat = parseFloat(row["latitud"]);
            const lng = parseFloat(row["longitud"]);
            if (!isNaN(lat) && !isNaN(lng)) {
              allMarkers.push({
                nombre: row["nombre"] || "Nombre desconocido",
                tipo: sheetName,
                lat: lat,
                lng: lng,
              });
            }
          });
        });
        setMarkers(allMarkers);
      } catch (error) {
        console.error("Error al leer el archivo Excel:", error);
      }
    };

    fetchGeoJson();
    fetchData();
  }, []);

  ///////FIN CARGUE INFORMACION EXCEL Y GEOJSON///////

  const onOpenModal = (comuna: ComunaProperties) => {
    setSelectedComuna(comuna);
    setIsModalVisible(true);
  };

  //estilo metodo para el borde de los limites de la comuna y la opacida cuando se selecciona una comuna
  const boundaryStyle: (
    feature?: GeoJSON.Feature<GeoJSON.Geometry, ComunaProperties>
  ) => PathOptions = (feature) => {
    if (!feature || !feature.properties) {
      return { color: "blue", weight: 2, opacity: 0.8 }; // Default style
    }

    const isSelected =
      selectedComuna && selectedComuna.comuna === feature.properties.comuna;

    return {
      color: isSelected ? "darkblue" : "blue", // Line color
      weight: 2,
      opacity: 0.8,
      fillColor: isSelected ? "rgba(0, 0, 139, 0.6)" : undefined, // Fill color for the selected comuna
      fillOpacity: isSelected ? 0.9 : 0, // Make it opaque if selected
    };
  };

  //cargar los iconos en cada marcador
  const getIconByCategory = (category: string) => {
    let iconUrl = "/icons/marcador.pmg.png"; // Ícono por defecto

    switch (category.toLowerCase()) {
      case "hospitales":
        iconUrl = "/icons/marcadorAmarillo.png"; // Ícono de hospitales
        break;
      case "colegios":
        iconUrl = "/icons/marcadorAzul.png"; // Ícono de colegios
        break;
      case "clinicas":
        iconUrl = "/icons/marcadorBlanca.png";
        break;
      case "bancos":
        iconUrl = "/icons/marcadorDorado.png";
        break;
      case "universidades":
        iconUrl = "/icons/marcadorRosa.png";
        break;
      case "centros comerciales":
        iconUrl = "/icons/marcadorNaranja.png";
        break;
      case "monumentos":
        iconUrl = "/icons/marcadorMorado.png";
        break;
      case "Fotomultas":
        iconUrl = "icons/marcadorVerde.png";
        break;
      case "comunas":
        iconUrl = "/icons/marcadorNegro.png";
        break;
      case "hoteles":
        iconUrl = "/icons/marcadorRojo.png"; // Ícono de clínicas
        break;
      default:
        iconUrl = "icons/marcadorCafe.png";
        break;
    }

    // estilo del icono
    return new L.Icon({
      iconUrl: iconUrl,
      iconSize: [20, 20], // Tamaño del ícono
      iconAnchor: [16, 32], // Punto de anclaje del ícono
      popupAnchor: [0, -32], // Punto desde el que se abre el popup
    });
  };

  useEffect(() => {
    setFilteredMarkers(
      markers.filter((marker) => selectedTypes.has(marker.tipo))
    );
    // }
  }, [selectedTypes, markers]);


  const handleTypeChange = (selectedKeys: string[]) => {
    console.log(
      "%chandleTypeChange",
      "color:green;font-size:18px",
      selectedKeys
    );
    setSelectedTypes(new Set(selectedKeys));
  };

  const handleHeatMapChange = (selectedKeys: string[]) => {
    setSelectedHeatMaps(new Set(selectedKeys));
  };

  const handleToggleBoundaries = (checked: boolean) => {
    setShowBoundaries(checked);
  };

  const handleToggleColor = (checked: boolean) => {
    setShowColors(checked);
  };

//metodo hacer clic cada comuna
  const onEachFeatureInfo = (feature: any, layer: any) => {
    layer.on({
      click: () => {
        const comuna = feature.properties.comuna;
        const poblacion = feature.properties.poblacion;
        const viviendas = feature.properties.viviendas;
        const estratoModa = feature.properties.estratoModa;
        const establecimientos = feature.properties.establecimientos;
        const centrosSalud = feature.properties.centrosSalud;
        const puestosSalud = feature.properties.puestosSalud;
        const establecimientosSecundaria =
          feature.properties.establecimientosSecundaria;
        const establecimientosPrimaria =
          feature.properties.establecimientosPrimaria;
        const establecimientosPreescolar =
          feature.properties.establecimientosPreescolar;
        const bibliotecas = feature.properties.bibliotecas;
        const hoteles = feature.properties.hoteles;
        const seguridad = feature.properties.seguridad;
        const homicidios = feature.properties.homicidios;
        const hurtos = feature.properties.hurtos;
        const suicidios = feature.properties.suicidios;

        if (comuna) {
          // Llama a comunaClick con los datos de la comuna
          onOpenModal({
            comuna,
            poblacion,
            viviendas,
            estratoModa,
            establecimientos,
            centrosSalud,
            puestosSalud,
            establecimientosSecundaria,
            establecimientosPreescolar,
            establecimientosPrimaria,
            bibliotecas,
            hoteles,
            seguridad,
            homicidios,
            hurtos,
            suicidios,
          });
        }
      },
    });
  };

  // Función para obtener el tipo más común de marcador en una comuna
  const getMostCommonType = (counts: { [markerType: string]: number }) => {
    let maxCount = 0;
    let mostCommonType = "";

    // Itera sobre cada tipo de marcador y encuentra el que tiene el mayor conteo
    Object.entries(counts).forEach(([type, count]) => {
      if (count > maxCount) {
        maxCount = count;
        mostCommonType = type;
      }
    });

    // Si hay 3 o menos marcadores en total, retorna "default" para pintar la comuna de gris
    const totalMarkers = Object.values(counts).reduce(
      (acc, count) => acc + count,
      0
    );
    return totalMarkers <= 3 ? "default" : mostCommonType;
  };

  //asignar marcadores a cada columna y crear una figura con sus limites
  const assignMarkersToCommunes = useCallback(
    (markers: MarkerData[], geoJsonData: any): CommuneMarkerCounts => {
      const counts: CommuneMarkerCounts = {};

      geoJsonData.features.forEach((feature: any) => {
        const communeName: string = feature.properties.comuna;
        const polygon = turf.polygon(feature.geometry.coordinates);

        counts[communeName] = counts[communeName] || {};

        markers.forEach((marker) => {
          const point = turf.point([marker.lng, marker.lat]);

          // Verificar si el marcador está dentro del polígono de la comuna
          if (turf.booleanPointInPolygon(point, polygon)) {
            const type = marker.tipo;

            // Inicializar el contador para este tipo de marcador si no existe
            counts[communeName][type] = (counts[communeName][type] || 0) + 1;
          }
        });
      });

      return counts;
    },
    []
  );

  useEffect(() => {
    // Si tanto los marcadores como el GeoJSON están cargados, calcula el conteo de marcadores por comuna
    if (geoJsonData && markers.length > 0) {
      const calculatedCounts = assignMarkersToCommunes(markers, geoJsonData);
      setCounts(calculatedCounts); // Actualiza el estado con el conteo de marcadores por comuna
    }
  }, [geoJsonData, markers, assignMarkersToCommunes]);


  // Función para obtener el color según el tipo de marcador
  const getColorByType = (type: string) => {
    switch (type.toLowerCase()) {
      case "hospitales":
        return "yellow";
      case "universidades":
        return "pink";
      case "centros comerciales":
        return "orange";
      case "fotomultas":
        return "green";
      case "monumentos":
        return "purple";
      case "colegios":
        return "blue";
      case "bancos":
        return "#b8860b";
      case "hoteles":
        return "red";
      default:
        return "gray"; // Color por defecto
    }
  };

  const geoJsonStyle = (feature: any) => {
    const communeName = feature.properties.comuna;
    const mostCommonType = getMostCommonType(counts[communeName] || {}); // Asegúrate de manejar si no hay datos
    const color = getColorByType(mostCommonType);

    return {
      fillColor: color,
      weight: 2,
      opacity: 1,
      color: "black",
      fillOpacity: 0.3,
    };
  };

  return (
    <div>
      <FilterMenu
        onFilterChange={handleTypeChange}
        onHeatMapChange={handleHeatMapChange}
        onToggleBoundaries={handleToggleBoundaries}
        onToggleColors={handleToggleColor}
        showBoundaries={showBoundaries}
        showColors={showColors}
        onOpenModal={onOpenModal}
      />
      <MapContainer
        center={[3.4516, -76.532]}
        id="map"
        zoom={12}
        style={{ height: "100vh", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />
        colores marcadores populares
        {geoJsonData && showBoundaries && (
          <GeoJSON
            data={geoJsonData}
            style={geoJsonStyle}
            // onEachFeature={onEachFeature}
            onEachFeature={(feature, layer) => {
              const communeName = feature.properties.comuna;
              const communeCounts = counts[communeName] || {};
    
              // Añadir Tooltip para cada comuna con el conteo de marcadores por tipo
              layer.bindTooltip(
                `<div style="font-size: 12px; padding: 5px;">
                  <span style="font-weight: bold;">${communeName}</span>
                  <ul style="padding-left: 0; margin: 5px 0 0 0; list-style-type: none;">
                    ${Object.entries(communeCounts).map(([type, count]) => 
                      `<li style="margin: 2px 0;">${type}: ${count}</li>`
                    ).join('')}
                  </ul>
                </div>`,
                { sticky: true, direction: "auto", opacity: 0.6 }
              );
    
              layer.on({
                mouseover: () => layer.openTooltip(),
                mouseout: () => layer.closeTooltip(),
              });
            }}
          />
        )}
        ;
        <InfoBox visible={showBoundaries} />{" "}
        {/* InfoBox solo se muestra si showBoundaries es true */}
        limites de las comunas y modal
        {geoJsonDataColor && showColors && (
          <GeoJSON
            data={geoJsonDataColor}
            style={boundaryStyle} // Asigna el estilo dinámicamente
            onEachFeature={onEachFeatureInfo}
          />
        )}

        <ModalComunaInfo
        selectedComuna={selectedComuna || undefined} // Si selectedComuna es null, se pasa undefined
        isVisible={isModalVisible}
          onClose={ () => setIsModalVisible(false)}
        />

        {/* Renderizar los marcadores filtrados */}
        <LayerGroup>
          {filteredMarkers.map((marker, index) => (
            <Marker
              key={index}
              position={[marker.lat, marker.lng]}
              icon={getIconByCategory(marker.tipo)} // Llamada a la función de ícono personalizado
            >
              <Popup>{marker.nombre}</Popup>
            </Marker>
          ))}
        </LayerGroup>

        <LayerGroup>
          {/* Renderizar capas de mapa de calor seleccionadas */}
          {Array.from(selectedHeatMaps).map((category) => (
            <HeatMapLayer
              key={category}
              points={filteredMarkers
                .filter((marker) => marker.tipo === category)
                .map((marker) => [marker.lat, marker.lng, 1])}
              color={getColorByType(category)} // Colores personalizados
            />
          ))}
        </LayerGroup>
      </MapContainer>
    </div>
  );
};

export default MapWithFilter;
