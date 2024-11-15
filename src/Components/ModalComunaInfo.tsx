import React from 'react';
import { Modal } from 'antd';

interface ComunaInfo {
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

interface ComunaInfoModalProps {
  selectedComuna?: ComunaInfo ;
  isVisible: boolean;
  onClose: () => void;
}

const ModalComunaInfo: React.FC<ComunaInfoModalProps> = ({ 
  selectedComuna, 
  isVisible, 
  onClose 
}) => {
  return (
    <Modal
      title={<strong>Información de la {selectedComuna?.comuna || ""}</strong>}
      visible={isVisible}
      onCancel={onClose}
      footer={null}
      width={270}
      style={{
        position: "absolute",
        right: 20,
        top: 20,
        margin: 0,
        zIndex: 1000,
      }}
      bodyStyle={{ backgroundColor: "rgba(255, 255, 255, 0.9)" }}
      maskStyle={{ backgroundColor: "rgba(0, 0, 0, 0.2)", zIndex: 999 }}
    >
      {selectedComuna ? (
        <div>
          <p><strong>Nombre:</strong> {selectedComuna.comuna}</p>
          <p><strong>Población Total:</strong> {selectedComuna.poblacion}</p>
          <p><strong>Viviendas:</strong> {selectedComuna.viviendas}</p>
          <p><strong>Estrato moda:</strong> {selectedComuna.estratoModa}</p>
          <p><strong>Establecimientos:</strong> {selectedComuna.establecimientos}</p>
          <p><strong>Centros de salud:</strong> {selectedComuna.centrosSalud}</p>
          <p><strong>Puestos de salud:</strong> {selectedComuna.puestosSalud}</p>
          <p><strong>Establecimientos educativos secundaria y media:</strong> {selectedComuna.establecimientosSecundaria}</p>
          <p><strong>Establecimientos educativos primaria:</strong> {selectedComuna.establecimientosPrimaria}</p>
          <p><strong>Establecimientos educativos preescolar:</strong> {selectedComuna.establecimientosPreescolar}</p>
          <p><strong>Bibliotecas:</strong> {selectedComuna.bibliotecas}</p>
          <p><strong>Hoteles:</strong> {selectedComuna.hoteles}</p>
          <p><strong>Seguridad:</strong> {selectedComuna.seguridad}</p>
          <p><strong>Número de homicidios:</strong> {selectedComuna.homicidios}</p>
          <p><strong>Número de hurtos a personas:</strong> {selectedComuna.hurtos}</p>
          <p><strong>Número de suicidios:</strong> {selectedComuna.suicidios}</p>
        </div>
      ) : (
        <p>Cargando...</p>
      )}
    </Modal>
  );
};

export default ModalComunaInfo;
