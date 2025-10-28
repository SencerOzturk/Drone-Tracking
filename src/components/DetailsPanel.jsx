import React from 'react'

export default function DetailsPanel({ drone }) {
  if (!drone) {
    return <div className="details-body" style={{ color: 'var(--muted)' }}>Bir drone seçiniz.</div>
  }
  return (
    <div className="details-body">
      <div className="kv"><div className="k">Ad</div><div className="v">{drone.name}</div></div>
      <div className="kv"><div className="k">ID</div><div className="v">{drone.id}</div></div>
      <div className="kv"><div className="k">Durum</div><div className="v">{drone.status}</div></div>
      <div className="kv"><div className="k">Konum</div><div className="v">{drone.lat.toFixed(5)}, {drone.lng.toFixed(5)}</div></div>
      <div className="kv"><div className="k">Hız</div><div className="v">{drone.speed.toFixed(1)} km/s</div></div>
      <div className="kv"><div className="k">İrtifa</div><div className="v">{drone.altitude.toFixed(0)} m</div></div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button>Takip Et</button>
        <button>Rota Göster</button>
        <button className="primary">Komut Gönder</button>
      </div>
    </div>
  )
}