'use client';
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import carPng from "/cars/car.png";


const Mapa = ({ recorrido, initialPosition}) => {
    const [isClient, setIsClient] = useState(false);
    const [map, setMap] = useState(null); // Aquí agregas el estado para almacenar la referencia del mapa

    // Define las coordenadas de inicio del mapa (puede ser el centro de tu recorrido)
    const position = [51.505, -0.09];

    // Define las opciones del icono del marcador
    const icono = new L.Icon({
        iconUrl: "/cars/car.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
    });

    useEffect(() => {
        // Marcar como verdadero solo cuando esté en el cliente
        setIsClient(true);
    }, []);

    if (!isClient) {
        return null;
    }

    return (
        <MapContainer
            center={initialPosition}
            zoom={15}
            style={{ height: '100%', width: '100%' }} 
            whenCreated={setMap} // Aquí utilizas setMap para almacenar la referencia del mapa creado
        >
            
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {recorrido.map((punto, index) => (
                <Marker key={index} position={punto} icon={icono}></Marker>
            ))}
            <Polyline positions={recorrido} />
        </MapContainer>
    );
};

export default Mapa;
