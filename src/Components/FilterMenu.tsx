import React from "react";
import { Menu, Checkbox } from "antd";
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
  showCicloRuta: boolean;
  onOpenModal: (comuna: ComunaProperties) => void; // Cambiado para aceptar un parámetro
  onToggleCicloRutas: (checked: boolean) => void;
}

const FilterMenu: React.FC<FilterMenuProps> = ({
  onFilterChange,
  onHeatMapChange,
  onToggleBoundaries,
  onToggleColors,
  showBoundaries,
  showColors,
  showCicloRuta,
  onOpenModal,
  onToggleCicloRutas,
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

  
  const handleCicloRuta = (e:any) => {
    onToggleCicloRutas(e.target.checked);
  }

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
            límites de comunas
          </Checkbox>
        </div>


        <div style={{ padding: "10px" }}>
          <Checkbox onChange={handleCicloRuta} checked={showCicloRuta}>
            ciclo ruta
          </Checkbox>
        </div>





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
            <Menu.Item key="estaciones mio">Estaciones mio</Menu.Item>
            <Menu.Item key="Fotomultas">Fotomultas</Menu.Item>
            <Menu.Item key="estaciones electricas">Estaciones Electricas</Menu.Item>

          </Menu.SubMenu>
          <Menu.SubMenu key="entertainment" title="Entretenimiento">
            <Menu.Item key="centros comerciales">Centros Comerciales</Menu.Item>
            <Menu.Item key="monumentos">Monumentos</Menu.Item>
          </Menu.SubMenu>

          {/* Nueva categoría "Deporte" */}
          <Menu.SubMenu key="sports" title="Deporte">
          <Menu.Item key="ciclo ruta">Ciclo Ruta</Menu.Item>
          <Menu.Item key="unidades deportivas">Unidades Deportivas</Menu.Item>


          </Menu.SubMenu>
        </Menu.SubMenu>

      </Menu>
    </div>
  );
};

export default FilterMenu;
