import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'

type Company = {
  id: string
  name: string
  slug: string
  active: boolean
  createdAt: string
  updatedAt: string
}


type Location = {
  id: string
  companyId: string
  name: string
  address: string
  active: boolean
  createdAt: string
  updatedAt: string
}


type Shift = {
  id: string
  locationId: string
  name: string
  startsAt: string
  endsAt: string
  status: 'SCHEDULED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
  createdAt: string
  updatedAt: string
}

type HandoverItem = {
  id: string
  handoverId: string
  carriedFromItemId: string | null
  type: 'INCIDENT' | 'TASK'
  title: string
  description: string | null
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  status: 'OPEN' | 'RESOLVED'
  resolvedAt: string | null
  resolvedByUserId: string | null
  createdAt: string
  updatedAt: string
}


type ShiftAssignment = {
  assignmentId: string
  shiftId: string
  membershipId: string
  userId: string
  firstName: string
  lastName: string
  email: string
  role: 'OWNER' | 'MANAGER' | 'EMPLOYEE'
  assignedByUserId: string
  assignedByFirstName: string
  assignedByLastName: string
  createdAt: string
}

function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem('shiftlink_access_token'),
  )

  const [companies, setCompanies] = useState<Company[]>([])
  const [selectedCompany, setSelectedCompany] =
    useState<Company | null>(null)
  const [locations, setLocations] = useState<Location[]>([])
  const [loadingLocations, setLoadingLocations] = useState(false)

  const [selectedLocation, setSelectedLocation] =
    useState<Location | null>(null)

  const [shifts, setShifts] = useState<Shift[]>([])
  const [openItems, setOpenItems] = useState<HandoverItem[]>([])

  const [selectedShift, setSelectedShift] =
    useState<Shift | null>(null)

  const [assignments, setAssignments] =
    useState<ShiftAssignment[]>([])

  const [loadingShiftDetail, setLoadingShiftDetail] =
    useState(false)
  const [loadingLocationData, setLoadingLocationData] =
    useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingCompanies, setLoadingCompanies] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) {
      return
    }

    async function loadCompanies() {
      setLoadingCompanies(true)
      setError('')

      try {
        const response = await fetch('/api/companies', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.status === 401) {
          localStorage.removeItem('shiftlink_access_token')
          setToken(null)
          return
        }

        if (!response.ok) {
          throw new Error(
            'No se han podido cargar tus empresas',
          )
        }

        const data: Company[] = await response.json()
        setCompanies(data)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Ha ocurrido un error',
        )
      } finally {
        setLoadingCompanies(false)
      }
    }

    loadCompanies()
  }, [token])


  useEffect(() => {
    if (!token || !selectedCompany) {
      return
    }

    const companyId = selectedCompany.id

    async function loadLocations() {
      setLoadingLocations(true)
      setError('')

      try {
        const response = await fetch(
          `/api/companies/${companyId}/locations`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )

        if (!response.ok) {
          throw new Error(
            'No se han podido cargar los locales',
          )
        }

        const data: Location[] = await response.json()
        setLocations(data)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Ha ocurrido un error',
        )
      } finally {
        setLoadingLocations(false)
      }
    }

    loadLocations()
  }, [token, selectedCompany])


  useEffect(() => {
    if (!token || !selectedCompany || !selectedLocation) {
      return
    }

    const companyId = selectedCompany.id
    const locationId = selectedLocation.id

    async function loadLocationData() {
      setLoadingLocationData(true)
      setError('')

      const headers = {
        Authorization: `Bearer ${token}`,
      }

      try {
        const [shiftsResponse, itemsResponse] =
          await Promise.all([
            fetch(
              `/api/companies/${companyId}/locations/${locationId}/shifts`,
              { headers },
            ),
            fetch(
              `/api/companies/${companyId}/locations/${locationId}/open-items`,
              { headers },
            ),
          ])

        if (!shiftsResponse.ok || !itemsResponse.ok) {
          throw new Error(
            'No se ha podido cargar la actividad del local',
          )
        }

        const shiftsData: Shift[] =
          await shiftsResponse.json()

        const itemsData: HandoverItem[] =
          await itemsResponse.json()

        setShifts(shiftsData)
        setOpenItems(itemsData)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Ha ocurrido un error',
        )
      } finally {
        setLoadingLocationData(false)
      }
    }

    loadLocationData()
  }, [token, selectedCompany, selectedLocation])


  useEffect(() => {
    if (
      !token ||
      !selectedCompany ||
      !selectedLocation ||
      !selectedShift
    ) {
      return
    }

    const companyId = selectedCompany.id
    const locationId = selectedLocation.id
    const shiftId = selectedShift.id

    async function loadShiftAssignments() {
      setLoadingShiftDetail(true)
      setError('')

      try {
        const response = await fetch(
          `/api/companies/${companyId}/locations/${locationId}/shifts/${shiftId}/assignments`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )

        if (!response.ok) {
          throw new Error(
            'No se han podido cargar los empleados del turno',
          )
        }

        const data: ShiftAssignment[] =
          await response.json()

        setAssignments(data)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Ha ocurrido un error',
        )
      } finally {
        setLoadingShiftDetail(false)
      }
    }

    loadShiftAssignments()
  }, [
    token,
    selectedCompany,
    selectedLocation,
    selectedShift,
  ])

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      if (!response.ok) {
        throw new Error(
          'Correo o contraseña incorrectos',
        )
      }

      const data = await response.json()

      localStorage.setItem(
        'shiftlink_access_token',
        data.accessToken,
      )

      setToken(data.accessToken)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se ha podido iniciar sesión',
      )
    } finally {
      setLoading(false)
    }
  }

  function handleLogout() {
    localStorage.removeItem('shiftlink_access_token')
    setToken(null)
    setCompanies([])
    setSelectedCompany(null)
    setSelectedLocation(null)
    setSelectedShift(null)
    setAssignments([])
    setLocations([])
    setShifts([])
    setOpenItems([])
    setPassword('')
    setError('')
  }

  if (
    token &&
    selectedCompany &&
    selectedLocation &&
    selectedShift
  ) {
    return (
      <main className="companies-page">
        <button
          type="button"
          onClick={() => {
            setSelectedShift(null)
            setAssignments([])
          }}
        >
          ← Volver a turnos
        </button>

        <p className="eyebrow">TURNO</p>

        <h1>{selectedShift.name}</h1>

        <p>{selectedShift.status}</p>

        <h2>
          Empleados asignados ({assignments.length})
        </h2>

        {loadingShiftDetail && (
          <p>Cargando empleados...</p>
        )}

        {error && (
          <p className="login-error">{error}</p>
        )}

        {!loadingShiftDetail &&
          assignments.length === 0 && (
            <p>
              No hay empleados asignados a este turno.
            </p>
          )}

        <section className="companies-grid">
          {assignments.map((assignment) => (
            <article
              className="company-card"
              key={assignment.assignmentId}
            >
              <span className="company-icon">
                {assignment.firstName
                  .charAt(0)
                  .toUpperCase()}
              </span>

              <span className="company-info">
                <strong>
                  {assignment.firstName}{' '}
                  {assignment.lastName}
                </strong>

                <small>{assignment.email}</small>
                <small>{assignment.role}</small>
              </span>
            </article>
          ))}
        </section>
      </main>
    )
  }

  if (
    token &&
    selectedCompany &&
    selectedLocation
  ) {
    const activeShifts = shifts.filter(
      (shift) => shift.status === 'ACTIVE',
    ).length

    const scheduledShifts = shifts.filter(
      (shift) => shift.status === 'SCHEDULED',
    ).length

    function formatShiftDate(value: string) {
      return new Intl.DateTimeFormat('es-ES', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(value))
    }

    function shiftStatusLabel(status: Shift['status']) {
      const labels = {
        SCHEDULED: 'Programado',
        ACTIVE: 'Activo',
        COMPLETED: 'Completado',
        CANCELLED: 'Cancelado',
      }

      return labels[status]
    }

    function itemTypeLabel(type: HandoverItem['type']) {
      return type === 'INCIDENT'
        ? 'Incidencia'
        : 'Tarea'
    }

    function priorityLabel(
      priority: HandoverItem['priority'],
    ) {
      const labels = {
        LOW: 'Baja',
        MEDIUM: 'Media',
        HIGH: 'Alta',
      }

      return labels[priority]
    }

    return (
      <div className="location-page">
        <nav className="workspace-nav">
          <div className="workspace-brand">
            <div className="workspace-logo">S</div>

            <div>
              <strong>ShiftLink</strong>
              <span>
                {selectedCompany.name} · {selectedLocation.name}
              </span>
            </div>
          </div>

          <button
            className="logout-button"
            type="button"
            onClick={() => setSelectedLocation(null)}
          >
            ← Volver al local
          </button>
        </nav>

        <main className="location-dashboard">
          <section className="location-hero">
            <div>
              <p className="workspace-eyebrow">
                ACTIVIDAD DEL LOCAL
              </p>

              <h1>{selectedLocation.name}</h1>

              <p className="location-address">
                {selectedLocation.address}
              </p>
            </div>

            <div className="location-state">
              <span className="status-dot" />
              Local activo
            </div>
          </section>

          {loadingLocationData && (
            <div className="workspace-loading">
              Cargando actividad...
            </div>
          )}

          {error && (
            <p className="login-error">{error}</p>
          )}

          {!loadingLocationData && (
            <>
              <section className="stats-grid">
                <article className="stat-card">
                  <span>Turnos totales</span>
                  <strong>{shifts.length}</strong>
                </article>

                <article className="stat-card">
                  <span>Programados</span>
                  <strong>{scheduledShifts}</strong>
                </article>

                <article className="stat-card">
                  <span>Activos ahora</span>
                  <strong>{activeShifts}</strong>
                </article>

                <article className="stat-card stat-card-alert">
                  <span>Pendientes abiertos</span>
                  <strong>{openItems.length}</strong>
                </article>
              </section>

              <section className="location-section">
                <div className="section-heading">
                  <div>
                    <h2>Turnos</h2>
                    <p>
                      Consulta el estado y horario de cada turno.
                    </p>
                  </div>

                  <span className="section-count">
                    {shifts.length}
                  </span>
                </div>

                <div className="shifts-grid">
                  {shifts.map((shift) => (
                    <button
                      className="shift-card"
                      type="button"
                      key={shift.id}
                      onClick={() => setSelectedShift(shift)}
                    >
                      <div className="shift-card-top">
                        <span
                          className={
                            `shift-status ` +
                            `shift-status-${shift.status.toLowerCase()}`
                          }
                        >
                          {shiftStatusLabel(shift.status)}
                        </span>

                        <span className="company-arrow">
                          →
                        </span>
                      </div>

                      <h3>{shift.name}</h3>

                      <div className="shift-times">
                        <div>
                          <span>Inicio</span>
                          <strong>
                            {formatShiftDate(shift.startsAt)}
                          </strong>
                        </div>

                        <div>
                          <span>Fin</span>
                          <strong>
                            {formatShiftDate(shift.endsAt)}
                          </strong>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              <section className="location-section pending-section">
                <div className="section-heading">
                  <div>
                    <h2>Pendientes abiertos</h2>
                    <p>
                      Tareas e incidencias que todavía requieren
                      atención.
                    </p>
                  </div>

                  <span className="section-count section-count-alert">
                    {openItems.length}
                  </span>
                </div>

                {openItems.length === 0 ? (
                  <div className="all-clear">
                    <div className="all-clear-icon">✓</div>

                    <div>
                      <strong>Todo al día</strong>
                      <p>
                        No hay tareas ni incidencias pendientes.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="pending-list">
                    {openItems.map((item) => (
                      <article
                        className="pending-card"
                        key={item.id}
                      >
                        <div className="pending-main">
                          <div className="pending-icon">
                            {item.type === 'INCIDENT'
                              ? '!'
                              : '✓'}
                          </div>

                          <div>
                            <div className="pending-tags">
                              <span>
                                {itemTypeLabel(item.type)}
                              </span>

                              <span
                                className={
                                  `priority-tag ` +
                                  `priority-${item.priority.toLowerCase()}`
                                }
                              >
                                Prioridad{' '}
                                {priorityLabel(item.priority)}
                              </span>
                            </div>

                            <h3>{item.title}</h3>

                            {item.description && (
                              <p>{item.description}</p>
                            )}
                          </div>
                        </div>

                        <span className="company-arrow">
                          →
                        </span>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </main>
      </div>
    )
  }

  if (token && selectedCompany) {
    return (
      <div className="company-page">
        <nav className="workspace-nav">
          <div className="workspace-brand">
            <div className="workspace-logo">S</div>

            <div>
              <strong>ShiftLink</strong>
              <span>{selectedCompany.name}</span>
            </div>
          </div>

          <button
            className="logout-button"
            type="button"
            onClick={() => setSelectedCompany(null)}
          >
            ← Cambiar empresa
          </button>
        </nav>

        <main className="company-dashboard">
          <section className="company-dashboard-hero">
            <div>
              <p className="workspace-eyebrow">
                ESPACIO DE TRABAJO
              </p>

              <h1>{selectedCompany.name}</h1>

              <p>
                Gestiona los locales, turnos, relevos
                y pendientes de tu equipo.
              </p>
            </div>

            <div className="dashboard-summary">
              <span>Locales activos</span>
              <strong>{locations.length}</strong>
            </div>
          </section>

          <section className="dashboard-section">
            <div className="section-heading">
              <div>
                <h2>Locales</h2>
                <p>
                  Selecciona un local para consultar
                  su actividad.
                </p>
              </div>
            </div>

            {loadingLocations && (
              <div className="workspace-loading">
                Cargando locales...
              </div>
            )}

            {error && (
              <p className="login-error">{error}</p>
            )}

            {!loadingLocations && locations.length === 0 && (
              <div className="workspace-empty">
                <div className="empty-icon">L</div>
                <h2>No hay locales disponibles</h2>
                <p>
                  Los locales de la empresa aparecerán aquí.
                </p>
              </div>
            )}

            <div className="locations-grid">
              {locations.map((location) => (
                <button
                  className="location-card"
                  type="button"
                  key={location.id}
                  onClick={() => setSelectedLocation(location)}
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
              ))}
            </div>
          </section>
        </main>
      </div>
    )
  }

  if (token) {
    return (
      <div className="workspace-page">
        <nav className="workspace-nav">
          <div className="workspace-brand">
            <div className="workspace-logo">S</div>

            <div>
              <strong>ShiftLink</strong>
              <span>Gestión de relevos</span>
            </div>
          </div>

          <button
            className="logout-button"
            type="button"
            onClick={handleLogout}
          >
            Cerrar sesión
          </button>
        </nav>

        <main className="workspace-content">
          <section className="workspace-hero">
            <div>
              <p className="workspace-eyebrow">
                ESPACIOS DE TRABAJO
              </p>

              <h1>Mis empresas</h1>

              <p className="workspace-description">
                Selecciona una empresa para acceder a sus
                locales, turnos, relevos y pendientes.
              </p>
            </div>

            {!loadingCompanies && (
              <div className="workspace-count">
                <strong>{companies.length}</strong>
                <span>
                  {companies.length === 1
                    ? 'empresa disponible'
                    : 'empresas disponibles'}
                </span>
              </div>
            )}
          </section>

          {loadingCompanies && (
            <div className="workspace-loading">
              Cargando empresas...
            </div>
          )}

          {error && (
            <p className="login-error">
              {error}
            </p>
          )}

          {!loadingCompanies && companies.length === 0 && (
            <div className="workspace-empty">
              <div className="empty-icon">S</div>
              <h2>No tienes empresas disponibles</h2>
              <p>
                Cuando formes parte de una empresa,
                aparecerá aquí.
              </p>
            </div>
          )}

          <section className="workspace-grid">
            {companies.map((company) => (
              <button
                className="workspace-company-card"
                type="button"
                key={company.id}
                onClick={() => setSelectedCompany(company)}
              >
                <div className="company-card-top">
                  <div className="company-avatar">
                    {company.name
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <span className="company-status">
                    <span className="status-dot" />
                    Activa
                  </span>
                </div>

                <div className="company-card-content">
                  <h2>{company.name}</h2>
                  <p>{company.slug}</p>
                </div>

                <div className="company-card-footer">
                  <span>Acceder al espacio</span>

                  <span className="company-arrow">
                    →
                  </span>
                </div>
              </button>
            ))}
          </section>
        </main>

        <footer className="workspace-footer">
          <span>ShiftLink</span>
          <span>Turnos claros. Relevos sin pérdidas.</span>
        </footer>
      </div>
    )
  }

  return (
    <div className="login-page">
      <section className="login-brand">
        <div className="brand-content">
          <div className="brand-logo">S</div>

          <h1>ShiftLink</h1>

          <p className="brand-tagline">
            El relevo de turno, claro para todos.
          </p>

          <p className="brand-description">
            Centraliza incidencias, tareas y pendientes
            para que cada trabajador empiece su turno
            sabiendo exactamente qué ha ocurrido.
          </p>

          <div className="brand-feature">
            <span className="feature-check">✓</span>
            <span>
              Relevos estructurados entre turnos
            </span>
          </div>

          <div className="brand-feature">
            <span className="feature-check">✓</span>
            <span>Pendientes que no se pierden</span>
          </div>

          <div className="brand-feature">
            <span className="feature-check">✓</span>
            <span>
              Confirmación de quién entrega y quién
              recibe
            </span>
          </div>
        </div>
      </section>

      <section className="login-panel">
        <div className="login-card">
          <div className="mobile-logo">
            <div className="brand-logo">S</div>
            <span>ShiftLink</span>
          </div>

          <div className="login-heading">
            <p className="eyebrow">
              BIENVENIDO DE NUEVO
            </p>

            <h2>Inicia sesión</h2>

            <p>Accede a tu espacio de trabajo.</p>
          </div>

          <form
            className="login-form"
            onSubmit={handleSubmit}
          >
            <label htmlFor="email">
              Correo electrónico
            </label>

            <input
              id="email"
              type="email"
              placeholder="nombre@empresa.com"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              required
            />

            <label htmlFor="password">
              Contraseña
            </label>

            <input
              id="password"
              type="password"
              placeholder="Introduce tu contraseña"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              required
            />

            <button
              type="submit"
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>

            {error && (
              <p className="login-error">
                {error}
              </p>
            )}
          </form>

          <p className="login-footer">
            ShiftLink · Gestión de turnos y relevos
          </p>
        </div>
      </section>
    </div>
  )
}

export default App
