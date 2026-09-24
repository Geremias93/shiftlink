import type { Company } from '../types'

type CompanyCardProps = {
  company: Company
  onSelect: (company: Company) => void
}

export function CompanyCard({
  company,
  onSelect,
}: CompanyCardProps) {
  return (
    <button
      className="workspace-company-card"
      type="button"
      onClick={() => onSelect(company)}
    >
      <div className="company-card-top">
        <div className="company-avatar">
          {company.name.charAt(0).toUpperCase()}
        </div>

        <span className="company-status">
          <span className="status-dot" />
          Activa
        </span>
      </div>

      <div className="company-card-content">
        <h2>{company.name}</h2>
        <p>
          {company.slug.startsWith('demo-')
            ? 'Entorno de demostración'
            : company.slug}
        </p>
      </div>

      <div className="company-card-footer">
        <span>Acceder al espacio</span>
        <span className="company-arrow">→</span>
      </div>
    </button>
  )
}
