import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

const icono = new L.Icon({
    iconUrl: "/cars/carSVG.svg",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

// Componente para actualizar la posición del mapa
const UpdateMapView = ({ center }:any) => {
    const map = useMap();
    useEffect(() => {
        map.flyTo(center);
    }, [center, map]);
    return null;
};

const Mapa = ({ recorrido, initialPosition }:any) => {
    return (
        <MapContainer
            center={initialPosition}
            zoom={15}
            style={{ height: '100%', width: '100%' }}
        >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {recorrido.map((punto: L.LatLngExpression, index: React.Key | null | undefined) => (
                <Marker key={index} position={punto} icon={icono} />
            ))}
            <Polyline positions={recorrido} />
            {/* Componente para actualizar la vista del mapa */}
            <UpdateMapView center={initialPosition} />
        </MapContainer>
    );
};

export default Mapa;
