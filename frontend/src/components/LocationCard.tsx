import type { Location } from '../types'

type LocationCardProps = {
  location: Location
  onSelect: (location: Location) => void
}

export function LocationCard({
  location,
  onSelect,
}: LocationCardProps) {
  return (
    <button
      className="location-card"
      type="button"
      onClick={() => onSelect(location)}
    >
      <div className="location-card-header">
        <div className="location-icon">
          {location.name.charAt(0).toUpperCase()}
        </div>

        <span className="company-status">
          <span className="status-dot" />
          Activo
        </span>
      </div>

      <div className="location-card-body">
        <h3>{location.name}</h3>
        <p>{location.address}</p>
      </div>

      <div className="location-card-footer">
        <span>Ver actividad del local</span>
        <span className="company-arrow">→</span>
      </div>
    </button>
  )
}
