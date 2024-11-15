import React from "react";
import { Menu, Checkbox, Button } from "antd";
import { MenuProps } from "antd/es/menu";

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

interface FilterMenuProps {
  onFilterChange: (selectedKeys: string[]) => void;
  onHeatMapChange: (selectedKeys: string[]) => void;
  onToggleBoundaries: (checked: boolean) => void;
  onToggleColors: (checked: boolean) => void; // Nuevo prop para activar/desactivar límites
  showBoundaries: boolean; // Nuevo prop para mostrar/ocultar límites
  showColors: boolean;
  onOpenModal: (comuna: ComunaProperties) => void; // Cambiado para aceptar un parámetro
}

const FilterMenu: React.FC<FilterMenuProps> = ({
  onFilterChange,
  onHeatMapChange,
  onToggleBoundaries,
  onToggleColors,
  showBoundaries,
  showColors,
  onOpenModal,
}) => {
  const handleMenuSelect: MenuProps["onSelect"] = (e) => {
    console.log("e", e);
    const heatmapFiltered = e.selectedKeys.filter((key) =>
      key.includes("heatmap")
    );
    const filtered = e.selectedKeys.filter((key) => !key.includes("heatmap"));
    onFilterChange(filtered as string[]);
    onHeatMapChange(heatmapFiltered as string[]);
  };

  const handleBoundariesChange = (e: any) => {
    onToggleBoundaries(e.target.checked);
  };

  const handleColorsChange = (e: any) => {
    onToggleColors(e.target.checked);
  };

  // const handleAllFiltersChange = (e: any) => {
  //   onToggleAllFilters(e.target.checked);
  // };

  // const handleColorLayerChange = (e: any) => { // Añadir esta función
  //   onToggleColorLayer(e.target.checked);
  // };

  return (
    <div
      style={{
        margin: "10px",
        position: "absolute",
        top: "10px",
        left: "50px",
        zIndex: 1000,
      }}
    >
      <Menu
        mode="inline"
        style={{ width: 256 }}
        theme="light"
        multiple
        onSelect={handleMenuSelect}
        onDeselect={handleMenuSelect}
      >
        {/* Checkbox para activar/desactivar límites de comunas */}
        <div style={{ padding: "10px" }}>
          <Checkbox onChange={handleBoundariesChange} checked={showBoundaries}>
            Marcadores populares x comuna

          </Checkbox>
        </div>

        <div style={{ padding: "10px" }}>
          <Checkbox onChange={handleColorsChange} checked={showColors}>
            limites de comunas
          </Checkbox>
        </div>

        {/* Checkbox para activar/desactivar todos los filtros
        <div style={{ padding: "9px" }}>
          <Checkbox onChange={handleAllFiltersChange}>
            Activar todos los filtros
          </Checkbox>
        </div> */}

        {/* Checkbox para activar/desactivar la capa de colores por categoría
        <div style={{ padding: "9px" }}>
          <Checkbox onChange={handleColorLayerChange}>
            Categorías predominantes
          </Checkbox>
        </div> */}

        <Menu.Item key="comunas">Comunas</Menu.Item>

        <Menu.SubMenu key="categories" title="Categorías">
          <Menu.SubMenu key="education" title="Educación">
            <Menu.Item key="colegios">Colegios</Menu.Item>
            <Menu.Item key="universidades">Universidades</Menu.Item>
          </Menu.SubMenu>
          <Menu.SubMenu key="services" title="Servicios">
            <Menu.Item key="hospitales">Hospitales</Menu.Item>
            <Menu.Item key="hoteles">Hoteles</Menu.Item>
            <Menu.Item key="bancos">Bancos</Menu.Item>
          </Menu.SubMenu>
          <Menu.SubMenu key="entertainment" title="Entretenimiento">
            <Menu.Item key="centros comerciales">Centros Comerciales</Menu.Item>
            <Menu.Item key="monumentos">Monumentos</Menu.Item>
            <Menu.Item key="Fotomultas">Fotomultas</Menu.Item>
          </Menu.SubMenu>
        </Menu.SubMenu>

        <Menu.SubMenu key="heatmaps" title="Mapas de Calor">
          <Menu.Item key="heatmap_colegios">Mapa de Calor Colegios</Menu.Item>
          <Menu.Item key="heatmap_universidades">
            Mapa de Calor Universidades
          </Menu.Item>
          <Menu.Item key="heatmap_hospitales">
            Mapa de Calor Hospitales
          </Menu.Item>
          <Menu.Item key="heatmap_clinicas">Mapa de Calor Clínicas</Menu.Item>
          <Menu.Item key="heatmap_bancos">Mapa de Calor Bancos</Menu.Item>
          <Menu.Item key="heatmap_centros_comerciales">
            Mapa de Calor Centros Comerciales
          </Menu.Item>
          <Menu.Item key="heatmap_monumentos">
            Mapa de Calor Monumentos
          </Menu.Item>
          <Menu.Item key="heatmap_fotomultas">
            Mapa de Calor Fotomultas
          </Menu.Item>
        </Menu.SubMenu>
      </Menu>
    </div>
  );
};

export default FilterMenu;
