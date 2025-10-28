import React, { useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet'
import L from 'leaflet'

const defaultIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

export default function MapView({ drones, selectedId, onSelect }) {
  const center = useMemo(() => {
    if (drones.length === 0) return [39.9208, 32.8541] // Ankara fallback
    const avgLat = drones.reduce((s, d) => s + d.lat, 0) / drones.length
    const avgLng = drones.reduce((s, d) => s + d.lng, 0) / drones.length
    return [avgLat, avgLng]
  }, [drones])

  return (
    <div className="map-container">
      <MapContainer center={center} zoom={6} scrollWheelZoom style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {drones.map(d => (
          <Marker
            key={d.id}
            position={[d.lat, d.lng]}
            icon={defaultIcon}
            eventHandlers={{ click: () => onSelect(d.id) }}
          >
            <Popup>
              <div style={{ minWidth: 160 }}>
                <strong>{d.name}</strong>
                <div style={{ fontSize: 12, opacity: 0.8 }}>{d.id}</div>
                <div style={{ marginTop: 6, fontSize: 12 }}>Durum: {d.status}</div>
                <div style={{ fontSize: 12 }}>Hız: {d.speed.toFixed(1)} km/s</div>
                <div style={{ fontSize: 12 }}>İrtifa: {d.altitude.toFixed(0)} m</div>
              </div>
            </Popup>
          </Marker>
        ))}
        {selectedId && (() => {
          const d = drones.find(x => x.id === selectedId)
          if (!d) return null
          return (
            <CircleMarker
              center={[d.lat, d.lng]}
              radius={24}
              pathOptions={{ color: '#47b2ff', opacity: 0.6 }}
            />
          )
        })()}
      </MapContainer>
    </div>
  )
}