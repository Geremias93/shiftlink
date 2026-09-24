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


type Membership = {
  membershipId: string
  userId: string
  firstName: string
  lastName: string
  email: string
  role: 'OWNER' | 'MANAGER' | 'EMPLOYEE'
  active: boolean
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

type Handover = {
  id: string
  shiftId: string
  targetShiftId: string | null
  createdByUserId: string
  notes: string | null
  status: 'DRAFT' | 'SUBMITTED' | 'ACKNOWLEDGED'
  submittedAt: string | null
  acknowledgedAt: string | null
  acknowledgedByUserId: string | null
  createdAt: string
  updatedAt: string
}


function toDatetimeLocalValue(value: string) {
  const date = new Date(value)

  const pad = (number: number) =>
    String(number).padStart(2, '0')

  return (
    `${date.getFullYear()}-` +
    `${pad(date.getMonth() + 1)}-` +
    `${pad(date.getDate())}T` +
    `${pad(date.getHours())}:` +
    `${pad(date.getMinutes())}`
  )
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

  const [currentMembership, setCurrentMembership] =
    useState<Membership | null>(null)
  const [locations, setLocations] = useState<Location[]>([])
  const [loadingLocations, setLoadingLocations] = useState(false)

  const [selectedLocation, setSelectedLocation] =
    useState<Location | null>(null)

  const [shifts, setShifts] = useState<Shift[]>([])
  const [openItems, setOpenItems] = useState<HandoverItem[]>([])

  const [selectedShift, setSelectedShift] =
    useState<Shift | null>(null)

  const [showCreateShiftForm, setShowCreateShiftForm] =
    useState(false)

  const [newShiftName, setNewShiftName] = useState('')
  const [newShiftStartsAt, setNewShiftStartsAt] = useState('')
  const [newShiftEndsAt, setNewShiftEndsAt] = useState('')

  const [savingShift, setSavingShift] = useState(false)

  const [showEditShiftForm, setShowEditShiftForm] =
    useState(false)

  const [editShiftName, setEditShiftName] = useState('')
  const [editShiftStartsAt, setEditShiftStartsAt] =
    useState('')
  const [editShiftEndsAt, setEditShiftEndsAt] =
    useState('')

  const [savingShiftEdit, setSavingShiftEdit] =
    useState(false)

  const [assignments, setAssignments] =
    useState<ShiftAssignment[]>([])

  const [companyMembers, setCompanyMembers] =
    useState<Membership[]>([])

  const [showAssignmentForm, setShowAssignmentForm] =
    useState(false)

  const [assignmentMembershipId, setAssignmentMembershipId] =
    useState('')

  const [savingAssignment, setSavingAssignment] =
    useState(false)

  const [removingAssignmentId, setRemovingAssignmentId] =
    useState<string | null>(null)

  
  const [outgoingHandover, setOutgoingHandover] =
    useState<Handover | null>(null)

  const [incomingHandovers, setIncomingHandovers] =
    useState<Handover[]>([])

  const [handoverItems, setHandoverItems] =
    useState<HandoverItem[]>([])

  const [
    incomingHandoverItems,
    setIncomingHandoverItems,
  ] = useState<Record<string, HandoverItem[]>>({})


  const [showHandoverItemForm, setShowHandoverItemForm] =
    useState(false)

  const [handoverItemType, setHandoverItemType] =
    useState<'TASK' | 'INCIDENT'>('TASK')

  const [handoverItemTitle, setHandoverItemTitle] =
    useState('')

  const [
    handoverItemDescription,
    setHandoverItemDescription,
  ] = useState('')

  const [
    handoverItemPriority,
    setHandoverItemPriority,
  ] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM')


  const [savingHandoverItem, setSavingHandoverItem] =
    useState(false)

  const [carryingOpenItems, setCarryingOpenItems] =
    useState(false)

  const [carryItemsMessage, setCarryItemsMessage] =
    useState('')

  const [showHandoverForm, setShowHandoverForm] =
    useState(false)

  const [handoverTargetShiftId, setHandoverTargetShiftId] =
    useState('')

  const [handoverNotes, setHandoverNotes] =
    useState('')

  const [savingHandover, setSavingHandover] =
    useState(false)

  const [sendingHandover, setSendingHandover] =
    useState(false)

  const [updatingHandover, setUpdatingHandover] =
    useState(false)


  const [
    acknowledgingHandoverId,
    setAcknowledgingHandoverId,
  ] = useState<string | null>(null)

  const [
    resolvingHandoverItemId,
    setResolvingHandoverItemId,
  ] = useState<string | null>(null)






  const [loadingShiftDetail, setLoadingShiftDetail] =
    useState(false)

  const [changingShiftStatus, setChangingShiftStatus] =
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
        const headers = {
          Authorization: `Bearer ${token}`,
        }

        const [locationsResponse, membershipResponse] =
          await Promise.all([
            fetch(
              `/api/companies/${companyId}/locations`,
              { headers },
            ),
            fetch(
              `/api/companies/${companyId}/members/me`,
              { headers },
            ),
          ])

        if (
          !locationsResponse.ok ||
          !membershipResponse.ok
        ) {
          throw new Error(
            'No se ha podido cargar la empresa',
          )
        }

        const data: Location[] =
          await locationsResponse.json()

        const membershipData: Membership =
          await membershipResponse.json()

        setLocations(data)
        setCurrentMembership(membershipData)
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
    if (
      !token ||
      !selectedCompany ||
      !currentMembership
    ) {
      return
    }

    if (
      currentMembership.role !== 'OWNER' &&
      currentMembership.role !== 'MANAGER'
    ) {
      return
    }

    const companyId = selectedCompany.id

    async function loadCompanyMembers() {
      try {
        const response = await fetch(
          `/api/companies/${companyId}/members`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )

        if (!response.ok) {
          throw new Error(
            'No se han podido cargar los empleados',
          )
        }

        const data: Membership[] = await response.json()
        setCompanyMembers(data)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Ha ocurrido un error',
        )
      }
    }

    loadCompanyMembers()
  }, [token, selectedCompany, currentMembership])


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

    async function loadShiftDetail() {
      setLoadingShiftDetail(true)
      setError('')

      setAssignments([])
      setOutgoingHandover(null)
      setIncomingHandovers([])
      setIncomingHandoverItems({})

      const headers = {
        Authorization: `Bearer ${token}`,
      }

      const baseUrl =
        `/api/companies/${companyId}/locations/${locationId}/shifts/${shiftId}`

      try {
        const [
          assignmentsResponse,
          outgoingResponse,
          incomingResponse,
        ] = await Promise.all([
          fetch(`${baseUrl}/assignments`, { headers }),
          fetch(`${baseUrl}/handover`, { headers }),
          fetch(`${baseUrl}/incoming-handovers`, { headers }),
        ])

        if (
          !assignmentsResponse.ok ||
          !incomingResponse.ok ||
          (
            !outgoingResponse.ok &&
            outgoingResponse.status !== 404
          )
        ) {
          throw new Error(
            'No se ha podido cargar el detalle del turno',
          )
        }

        const assignmentsData: ShiftAssignment[] =
          await assignmentsResponse.json()

        const incomingData: Handover[] =
          await incomingResponse.json()


        const incomingItemsEntries = await Promise.all(
          incomingData.map(async (handover) => {
            const itemsResponse = await fetch(
              `/api/companies/${companyId}/locations/${locationId}/shifts/${handover.shiftId}/handover/items`,
              { headers },
            )

            if (!itemsResponse.ok) {
              throw new Error(
                'No se han podido cargar los pendientes recibidos',
              )
            }

            const items: HandoverItem[] =
              await itemsResponse.json()

            return [handover.id, items] as const
          }),
        )

        const incomingItemsData =
          Object.fromEntries(incomingItemsEntries)

        let outgoingData: Handover | null = null
        let handoverItemsData: HandoverItem[] = []

        if (outgoingResponse.ok) {
          outgoingData =
            await outgoingResponse.json()

          const itemsResponse = await fetch(
            `${baseUrl}/handover/items`,
            { headers },
          )

          if (!itemsResponse.ok) {
            throw new Error(
              'No se han podido cargar los pendientes del relevo',
            )
          }

          handoverItemsData =
            await itemsResponse.json()
        }

        setAssignments(assignmentsData)
        setOutgoingHandover(outgoingData)
        setIncomingHandovers(incomingData)
        setIncomingHandoverItems(incomingItemsData)
        setHandoverItems(handoverItemsData)
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

    loadShiftDetail()

  }, [
    token,
    selectedCompany,
    selectedLocation,
    selectedShift,
  ])


  async function handleCreateShift(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    if (
      !token ||
      !selectedCompany ||
      !selectedLocation ||
      !newShiftName.trim() ||
      !newShiftStartsAt ||
      !newShiftEndsAt
    ) {
      return
    }

    const startsAt = new Date(newShiftStartsAt)
    const endsAt = new Date(newShiftEndsAt)

    if (endsAt.getTime() <= startsAt.getTime()) {
      setError(
        'La hora de fin debe ser posterior a la hora de inicio',
      )
      return
    }

    setSavingShift(true)
    setError('')

    try {
      const response = await fetch(
        `/api/companies/${selectedCompany.id}/locations/${selectedLocation.id}/shifts`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: newShiftName.trim(),
            startsAt: startsAt.toISOString(),
            endsAt: endsAt.toISOString(),
          }),
        },
      )

      if (!response.ok) {
        throw new Error(
          'No se ha podido crear el turno',
        )
      }

      const data: Shift = await response.json()

      setShifts((current) =>
        [...current, data].sort(
          (a, b) =>
            new Date(a.startsAt).getTime() -
            new Date(b.startsAt).getTime(),
        ),
      )

      setNewShiftName('')
      setNewShiftStartsAt('')
      setNewShiftEndsAt('')
      setShowCreateShiftForm(false)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Ha ocurrido un error',
      )
    } finally {
      setSavingShift(false)
    }
  }


  async function handleAssignMember(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    if (
      !token ||
      !selectedCompany ||
      !selectedLocation ||
      !selectedShift ||
      !assignmentMembershipId
    ) {
      return
    }

    setSavingAssignment(true)
    setError('')

    try {
      const response = await fetch(
        `/api/companies/${selectedCompany.id}/locations/${selectedLocation.id}/shifts/${selectedShift.id}/assignments`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            membershipId: assignmentMembershipId,
          }),
        },
      )

      if (!response.ok) {
        throw new Error(
          'No se ha podido asignar el empleado',
        )
      }

      const data: ShiftAssignment =
        await response.json()

      setAssignments((current) => [
        ...current,
        data,
      ])

      setAssignmentMembershipId('')
      setShowAssignmentForm(false)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Ha ocurrido un error',
      )
    } finally {
      setSavingAssignment(false)
    }
  }

  async function handleRemoveAssignment(
    assignment: ShiftAssignment,
  ) {
    if (
      !token ||
      !selectedCompany ||
      !selectedLocation ||
      !selectedShift
    ) {
      return
    }

    setRemovingAssignmentId(
      assignment.assignmentId,
    )
    setError('')

    try {
      const response = await fetch(
        `/api/companies/${selectedCompany.id}/locations/${selectedLocation.id}/shifts/${selectedShift.id}/assignments/${assignment.assignmentId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (!response.ok) {
        throw new Error(
          'No se ha podido quitar al empleado del turno',
        )
      }

      setAssignments((current) =>
        current.filter(
          (item) =>
            item.assignmentId !==
            assignment.assignmentId,
        ),
      )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Ha ocurrido un error',
      )
    } finally {
      setRemovingAssignmentId(null)
    }
  }


  async function handleCreateHandover(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    if (
      !token ||
      !selectedCompany ||
      !selectedLocation ||
      !selectedShift ||
      !handoverTargetShiftId
    ) {
      return
    }

    setSavingHandover(true)
    setError('')

    try {
      const response = await fetch(
        `/api/companies/${selectedCompany.id}/locations/${selectedLocation.id}/shifts/${selectedShift.id}/handover`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            targetShiftId: handoverTargetShiftId,
            notes: handoverNotes.trim() || null,
          }),
        },
      )

      if (!response.ok) {
        throw new Error(
          'No se ha podido guardar el borrador del relevo',
        )
      }

      const data: Handover = await response.json()

      setOutgoingHandover(data)
      setShowHandoverForm(false)
      setHandoverTargetShiftId('')
      setHandoverNotes('')
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Ha ocurrido un error',
      )
    } finally {
      setSavingHandover(false)
    }
  }

  async function handleSubmitHandover() {
    if (
      !token ||
      !selectedCompany ||
      !selectedLocation ||
      !selectedShift ||
      !outgoingHandover
    ) {
      return
    }

    setSendingHandover(true)
    setError('')

    try {
      const response = await fetch(
        `/api/companies/${selectedCompany.id}/locations/${selectedLocation.id}/shifts/${selectedShift.id}/handover/submit`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (!response.ok) {
        throw new Error(
          'No se ha podido enviar el relevo',
        )
      }

      const data: Handover = await response.json()

      setOutgoingHandover(data)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Ha ocurrido un error',
      )
    } finally {
      setSendingHandover(false)
    }
  }

  async function handleAcknowledgeHandover(
    handover: Handover,
  ) {
    if (
      !token ||
      !selectedCompany ||
      !selectedLocation
    ) {
      return
    }

    setAcknowledgingHandoverId(handover.id)
    setError('')

    try {
      const response = await fetch(
        `/api/companies/${selectedCompany.id}/locations/${selectedLocation.id}/shifts/${handover.shiftId}/handover/acknowledge`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (!response.ok) {
        throw new Error(
          'No se ha podido confirmar la recepción del relevo',
        )
      }

      const data: Handover = await response.json()

      setIncomingHandovers((current) =>
        current.map((item) =>
          item.id === data.id ? data : item,
        ),
      )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Ha ocurrido un error',
      )
    } finally {
      setAcknowledgingHandoverId(null)
    }
  }


  async function handleResolveIncomingItem(
    handover: Handover,
    item: HandoverItem,
  ) {
    if (
      !token ||
      !selectedCompany ||
      !selectedLocation
    ) {
      return
    }

    setResolvingHandoverItemId(item.id)
    setError('')

    try {
      const response = await fetch(
        `/api/companies/${selectedCompany.id}/locations/${selectedLocation.id}/shifts/${handover.shiftId}/handover/items/${item.id}/resolve`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (!response.ok) {
        throw new Error(
          'No se ha podido resolver el pendiente',
        )
      }

      const data: HandoverItem = await response.json()

      setIncomingHandoverItems((current) => ({
        ...current,
        [handover.id]: (
          current[handover.id] ?? []
        ).map((currentItem) =>
          currentItem.id === data.id
            ? data
            : currentItem,
        ),
      }))

      setOpenItems((current) =>
        current.filter(
          (currentItem) => currentItem.id !== data.id,
        ),
      )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Ha ocurrido un error',
      )
    } finally {
      setResolvingHandoverItemId(null)
    }
  }

  async function handleUpdateHandover(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    if (
      !token ||
      !selectedCompany ||
      !selectedLocation ||
      !selectedShift ||
      !outgoingHandover ||
      outgoingHandover.status !== 'DRAFT'
    ) {
      return
    }

    setUpdatingHandover(true)
    setError('')

    try {
      const response = await fetch(
        `/api/companies/${selectedCompany.id}/locations/${selectedLocation.id}/shifts/${selectedShift.id}/handover`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            notes: handoverNotes.trim() || null,
          }),
        },
      )

      if (!response.ok) {
        throw new Error(
          'No se ha podido actualizar el borrador',
        )
      }

      const data: Handover = await response.json()

      setOutgoingHandover(data)
      setShowHandoverForm(false)
      setHandoverNotes('')
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Ha ocurrido un error',
      )
    } finally {
      setUpdatingHandover(false)
    }
  }


  function handleOpenEditShift() {
    if (!selectedShift) {
      return
    }

    setEditShiftName(selectedShift.name)
    setEditShiftStartsAt(
      toDatetimeLocalValue(selectedShift.startsAt),
    )
    setEditShiftEndsAt(
      toDatetimeLocalValue(selectedShift.endsAt),
    )
    setError('')
    setShowEditShiftForm(true)
  }

  async function handleUpdateShift(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    if (
      !token ||
      !selectedCompany ||
      !selectedLocation ||
      !selectedShift ||
      !editShiftName.trim() ||
      !editShiftStartsAt ||
      !editShiftEndsAt
    ) {
      return
    }

    const startsAt = new Date(editShiftStartsAt)
    const endsAt = new Date(editShiftEndsAt)

    if (endsAt.getTime() <= startsAt.getTime()) {
      setError(
        'La hora de fin debe ser posterior a la hora de inicio',
      )
      return
    }

    setSavingShiftEdit(true)
    setError('')

    try {
      const response = await fetch(
        `/api/companies/${selectedCompany.id}/locations/${selectedLocation.id}/shifts/${selectedShift.id}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: editShiftName.trim(),
            startsAt: startsAt.toISOString(),
            endsAt: endsAt.toISOString(),
          }),
        },
      )

      if (!response.ok) {
        throw new Error(
          'No se ha podido actualizar el turno',
        )
      }

      const data: Shift = await response.json()

      setSelectedShift(data)

      setShifts((current) =>
        current
          .map((shift) =>
            shift.id === data.id ? data : shift,
          )
          .sort(
            (a, b) =>
              new Date(a.startsAt).getTime() -
              new Date(b.startsAt).getTime(),
          ),
      )

      setShowEditShiftForm(false)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Ha ocurrido un error',
      )
    } finally {
      setSavingShiftEdit(false)
    }
  }


  async function handleStartShift() {
    if (
      !token ||
      !selectedCompany ||
      !selectedLocation ||
      !selectedShift
    ) {
      return
    }

    setChangingShiftStatus(true)
    setError('')

    try {
      const response = await fetch(
        `/api/companies/${selectedCompany.id}/locations/${selectedLocation.id}/shifts/${selectedShift.id}/start`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (!response.ok) {
        throw new Error(
          'No se ha podido iniciar el turno',
        )
      }

      const data: Shift = await response.json()

      setSelectedShift(data)

      setShifts((current) =>
        current.map((shift) =>
          shift.id === data.id ? data : shift,
        ),
      )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Ha ocurrido un error',
      )
    } finally {
      setChangingShiftStatus(false)
    }
  }

  async function handleCompleteShift() {
    if (
      !token ||
      !selectedCompany ||
      !selectedLocation ||
      !selectedShift
    ) {
      return
    }

    setChangingShiftStatus(true)
    setError('')

    try {
      const response = await fetch(
        `/api/companies/${selectedCompany.id}/locations/${selectedLocation.id}/shifts/${selectedShift.id}/complete`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (!response.ok) {
        throw new Error(
          'No se ha podido completar el turno',
        )
      }

      const data: Shift = await response.json()

      setSelectedShift(data)

      setShifts((current) =>
        current.map((shift) =>
          shift.id === data.id ? data : shift,
        ),
      )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Ha ocurrido un error',
      )
    } finally {
      setChangingShiftStatus(false)
    }
  }

  async function handleCancelShift() {
    if (
      !token ||
      !selectedCompany ||
      !selectedLocation ||
      !selectedShift
    ) {
      return
    }

    const confirmed = window.confirm(
      '¿Seguro que quieres cancelar este turno?',
    )

    if (!confirmed) {
      return
    }

    setChangingShiftStatus(true)
    setError('')

    try {
      const response = await fetch(
        `/api/companies/${selectedCompany.id}/locations/${selectedLocation.id}/shifts/${selectedShift.id}/cancel`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (!response.ok) {
        throw new Error(
          'No se ha podido cancelar el turno',
        )
      }

      const data: Shift = await response.json()

      setSelectedShift(data)

      setShifts((current) =>
        current.map((shift) =>
          shift.id === data.id ? data : shift,
        ),
      )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Ha ocurrido un error',
      )
    } finally {
      setChangingShiftStatus(false)
    }
  }


  async function handleCarryOpenItems() {
    if (
      !token ||
      !selectedCompany ||
      !selectedLocation ||
      !selectedShift
    ) {
      return
    }

    const sourceHandover = [...incomingHandovers]
      .filter((handover) => handover.status !== 'DRAFT')
      .sort(
        (a, b) =>
          new Date(
            b.submittedAt ?? b.createdAt,
          ).getTime() -
          new Date(
            a.submittedAt ?? a.createdAt,
          ).getTime(),
      )[0]

    if (!sourceHandover) {
      setCarryItemsMessage(
        'No hay un relevo anterior con pendientes disponibles.',
      )
      return
    }

    setCarryingOpenItems(true)
    setCarryItemsMessage('')
    setError('')

    try {
      const response = await fetch(
        `/api/companies/${selectedCompany.id}/locations/${selectedLocation.id}/shifts/${selectedShift.id}/handover/items/carry-from/${sourceHandover.shiftId}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (!response.ok) {
        throw new Error(
          'No se han podido arrastrar los pendientes anteriores',
        )
      }

      const data: HandoverItem[] = await response.json()

      if (data.length === 0) {
        setCarryItemsMessage(
          'No hay pendientes sin resolver del turno anterior.',
        )
        return
      }

      setHandoverItems((current) => {
        const existingIds = new Set(
          current.map((item) => item.id),
        )

        return [
          ...current,
          ...data.filter(
            (item) => !existingIds.has(item.id),
          ),
        ]
      })

      setCarryItemsMessage(
        data.length === 1
          ? '1 pendiente del turno anterior añadido a este relevo.'
          : `${data.length} pendientes del turno anterior añadidos a este relevo.`,
      )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Ha ocurrido un error',
      )
    } finally {
      setCarryingOpenItems(false)
    }
  }


  async function handleCreateHandoverItem(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    if (
      !token ||
      !selectedCompany ||
      !selectedLocation ||
      !selectedShift ||
      !outgoingHandover ||
      outgoingHandover.status !== 'DRAFT' ||
      !handoverItemTitle.trim()
    ) {
      return
    }

    setSavingHandoverItem(true)
    setError('')

    try {
      const response = await fetch(
        `/api/companies/${selectedCompany.id}/locations/${selectedLocation.id}/shifts/${selectedShift.id}/handover/items`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: handoverItemType,
            title: handoverItemTitle.trim(),
            description:
              handoverItemDescription.trim() || null,
            priority: handoverItemPriority,
          }),
        },
      )

      if (!response.ok) {
        throw new Error(
          'No se ha podido añadir el pendiente',
        )
      }

      const data: HandoverItem =
        await response.json()

      setHandoverItems((current) => [
        ...current,
        data,
      ])

      setShowHandoverItemForm(false)
      setHandoverItemType('TASK')
      setHandoverItemTitle('')
      setHandoverItemDescription('')
      setHandoverItemPriority('MEDIUM')
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Ha ocurrido un error',
      )
    } finally {
      setSavingHandoverItem(false)
    }
  }

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
    const shiftStatusLabels = {
      SCHEDULED: 'Programado',
      ACTIVE: 'En curso',
      COMPLETED: 'Completado',
      CANCELLED: 'Cancelado',
    }

    const roleLabels = {
      OWNER: 'Propietario',
      MANAGER: 'Responsable',
      EMPLOYEE: 'Empleado',
    }

    function formatDetailDate(value: string) {
      return new Intl.DateTimeFormat('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(value))
    }

    function handoverStatusLabel(
      status: Handover['status'],
    ) {
      if (status === 'DRAFT') {
        return 'Borrador'
      }

      if (status === 'SUBMITTED') {
        return 'Pendiente de confirmar'
      }

      return 'Recepción confirmada'
    }


    const isCurrentUserAssigned = assignments.some(
      (assignment) =>
        assignment.userId === currentMembership?.userId,
    )

    const canManageOutgoingHandover =
      isCurrentUserAssigned &&
      outgoingHandover?.createdByUserId ===
        currentMembership?.userId

    return (
      <main className="shift-detail-page">
        <button
          className="shift-back-button"
          type="button"
          onClick={() => {
            setSelectedShift(null)
            setShowEditShiftForm(false)
            setAssignments([])
            setOutgoingHandover(null)
            setIncomingHandovers([])
          }}
        >
          <span aria-hidden="true">←</span>
          Volver a turnos
        </button>

        <section className="shift-detail-hero">
          <div className="shift-detail-title">
            <div>
              <p className="eyebrow">TURNO</p>
              <h1>{selectedShift.name}</h1>
            </div>


            <div className="shift-detail-actions">
              <span
                className={`shift-status-badge shift-status-${selectedShift.status.toLowerCase()}`}
              >
                {shiftStatusLabels[selectedShift.status]}
              </span>

              {(
                currentMembership?.role === 'OWNER' ||
                currentMembership?.role === 'MANAGER'
              ) &&
                selectedShift.status === 'SCHEDULED' && (
                  <div className="shift-active-actions">
                    <button
                      className="shift-secondary-action"
                      type="button"
                      onClick={handleOpenEditShift}
                    >
                      Editar turno
                    </button>

                    <button
                      className="shift-primary-action"
                      type="button"
                      disabled={changingShiftStatus}
                      onClick={handleStartShift}
                    >
                      {changingShiftStatus
                        ? 'Iniciando...'
                        : 'Iniciar turno'}
                    </button>
                  </div>
                )}

              {(
                currentMembership?.role === 'OWNER' ||
                currentMembership?.role === 'MANAGER'
              ) &&
                selectedShift.status === 'ACTIVE' && (
                  <div className="shift-active-actions">
                    <button
                      className="shift-danger-action"
                      type="button"
                      disabled={changingShiftStatus}
                      onClick={handleCancelShift}
                    >
                      Cancelar turno
                    </button>

                    <button
                      className="shift-primary-action"
                      type="button"
                      disabled={changingShiftStatus}
                      onClick={handleCompleteShift}
                    >
                      {changingShiftStatus
                        ? 'Procesando...'
                        : 'Completar turno'}
                    </button>
                  </div>
                )}
            </div>
          </div>

          <div className="shift-meta-grid">
            <div className="shift-meta-item">
              <span>Inicio</span>
              <strong>
                {formatDetailDate(selectedShift.startsAt)}
              </strong>
            </div>

            <div className="shift-meta-item">
              <span>Fin</span>
              <strong>
                {formatDetailDate(selectedShift.endsAt)}
              </strong>
            </div>

            <div className="shift-meta-item">
              <span>Local</span>
              <strong>{selectedLocation.name}</strong>
            </div>
          </div>
        </section>


        {showEditShiftForm &&
          selectedShift.status === 'SCHEDULED' &&
          (
            currentMembership?.role === 'OWNER' ||
            currentMembership?.role === 'MANAGER'
          ) && (
            <form
              className="shift-create-form shift-edit-form"
              onSubmit={handleUpdateShift}
            >
              <div className="handover-form-heading">
                <strong>Editar turno</strong>
                <span>
                  Modifica el nombre o el horario antes de
                  iniciar el turno.
                </span>
              </div>

              <label className="handover-field">
                <span>Nombre</span>

                <input
                  type="text"
                  maxLength={120}
                  value={editShiftName}
                  onChange={(event) =>
                    setEditShiftName(event.target.value)
                  }
                />
              </label>

              <div className="handover-item-form-row">
                <label className="handover-field">
                  <span>Inicio</span>

                  <input
                    type="datetime-local"
                    value={editShiftStartsAt}
                    onChange={(event) =>
                      setEditShiftStartsAt(
                        event.target.value,
                      )
                    }
                  />
                </label>

                <label className="handover-field">
                  <span>Fin</span>

                  <input
                    type="datetime-local"
                    value={editShiftEndsAt}
                    onChange={(event) =>
                      setEditShiftEndsAt(
                        event.target.value,
                      )
                    }
                  />
                </label>
              </div>

              <div className="handover-form-actions">
                <button
                  className="shift-secondary-action"
                  type="button"
                  onClick={() =>
                    setShowEditShiftForm(false)
                  }
                >
                  Cancelar
                </button>

                <button
                  className="shift-primary-action"
                  type="submit"
                  disabled={
                    savingShiftEdit ||
                    !editShiftName.trim() ||
                    !editShiftStartsAt ||
                    !editShiftEndsAt
                  }
                >
                  {savingShiftEdit
                    ? 'Guardando...'
                    : 'Guardar cambios'}
                </button>
              </div>
            </form>
          )}

        {error && (
          <p className="login-error">{error}</p>
        )}

        {loadingShiftDetail ? (
          <section className="shift-loading-card">
            <strong>Cargando turno...</strong>
            <span>
              Estamos preparando empleados y relevos.
            </span>
          </section>
        ) : (
          <>
            <div className="shift-detail-columns">
              <section className="shift-panel">
                <div className="shift-section-heading">
                  <div>
                    <p className="shift-section-kicker">
                      EQUIPO
                    </p>
                    <h2>Empleados asignados</h2>
                  </div>

                  <span className="shift-count">
                    {assignments.length}
                  </span>
                </div>


                {(
                  currentMembership?.role === 'OWNER' ||
                  currentMembership?.role === 'MANAGER'
                ) && (
                  <div className="shift-assignment-tools">
                    {!showAssignmentForm ? (
                      <button
                        className="shift-secondary-action"
                        type="button"
                        onClick={() =>
                          setShowAssignmentForm(true)
                        }
                      >
                        + Asignar empleado
                      </button>
                    ) : (
                      <form
                        className="shift-assignment-form"
                        onSubmit={handleAssignMember}
                      >
                        <label className="handover-field">
                          <span>Empleado</span>

                          <select
                            value={assignmentMembershipId}
                            onChange={(event) =>
                              setAssignmentMembershipId(
                                event.target.value,
                              )
                            }
                          >
                            <option value="">
                              Selecciona un empleado
                            </option>

                            {companyMembers
                              .filter(
                                (member) =>
                                  member.active &&
                                  !assignments.some(
                                    (assignment) =>
                                      assignment.membershipId ===
                                      member.membershipId,
                                  ),
                              )
                              .map((member) => (
                                <option
                                  key={member.membershipId}
                                  value={member.membershipId}
                                >
                                  {member.firstName}{' '}
                                  {member.lastName} ·{' '}
                                  {roleLabels[member.role]}
                                </option>
                              ))}
                          </select>
                        </label>

                        <div className="handover-form-actions">
                          <button
                            className="shift-secondary-action"
                            type="button"
                            onClick={() => {
                              setShowAssignmentForm(false)
                              setAssignmentMembershipId('')
                            }}
                          >
                            Cancelar
                          </button>

                          <button
                            className="shift-primary-action"
                            type="submit"
                            disabled={
                              !assignmentMembershipId ||
                              savingAssignment
                            }
                          >
                            {savingAssignment
                              ? 'Asignando...'
                              : 'Asignar'}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}

                {assignments.length === 0 ? (
                  <div className="shift-empty-state">
                    <strong>
                      Sin empleados asignados
                    </strong>
                    <span>
                      Todavía no hay nadie asignado a este
                      turno.
                    </span>
                  </div>
                ) : (
                  <div className="shift-people-list">
                    {assignments.map((assignment) => (
                      <article
                        className="shift-person-card"
                        key={assignment.assignmentId}
                      >
                        <span className="shift-person-avatar">
                          {assignment.firstName
                            .charAt(0)
                            .toUpperCase()}
                        </span>

                        <div className="shift-person-info">
                          <strong>
                            {assignment.firstName}{' '}
                            {assignment.lastName}
                          </strong>

                          <span>{assignment.email}</span>

                          <small>
                            {roleLabels[assignment.role]}
                          </small>
                        </div>

                        {(
                          currentMembership?.role === 'OWNER' ||
                          currentMembership?.role === 'MANAGER'
                        ) && (
                          <button
                            className="shift-person-remove"
                            type="button"
                            disabled={
                              removingAssignmentId ===
                              assignment.assignmentId
                            }
                            onClick={() =>
                              handleRemoveAssignment(
                                assignment,
                              )
                            }
                          >
                            {removingAssignmentId ===
                            assignment.assignmentId
                              ? 'Quitando...'
                              : 'Quitar del turno'}
                          </button>
                        )}
                      </article>
                    ))}
                  </div>
                )}
              </section>

              <section className="shift-panel">
                <div className="shift-section-heading">
                  <div>
                    <p className="shift-section-kicker">
                      ENTREGA
                    </p>
                    <h2>Relevo para el siguiente turno</h2>
                  </div>
                </div>

                {!outgoingHandover ? (
                  <div className="shift-empty-state">
                    <strong>
                      Todavía no hay relevo
                    </strong>

                    <span>
                      Deja la información importante para
                      las personas del siguiente turno.
                    </span>

                    {isCurrentUserAssigned && !showHandoverForm && (
                      <button
                        className="shift-primary-action"
                        type="button"
                        onClick={() => {
                          setShowHandoverForm(true)

                          const nextShift = [...shifts]
                            .filter(
                              (shift) =>
                                shift.id !== selectedShift.id &&
                                shift.status === 'SCHEDULED' &&
                                new Date(
                                  shift.startsAt,
                                ).getTime() >=
                                  new Date(
                                    selectedShift.endsAt,
                                  ).getTime(),
                            )
                            .sort(
                              (a, b) =>
                                new Date(a.startsAt).getTime() -
                                new Date(b.startsAt).getTime(),
                            )[0]

                          setHandoverTargetShiftId(
                            nextShift?.id ?? '',
                          )
                        }}
                      >
                        Preparar relevo
                      </button>
                    )}

                    {isCurrentUserAssigned && showHandoverForm && (
                      <form
                        className="handover-form"
                        onSubmit={handleCreateHandover}
                      >
                        <div className="handover-form-heading">
                          <strong>Preparar relevo</strong>
                          <span>
                            Elige el turno que recibirá la información.
                          </span>
                        </div>

                        <label className="handover-field">
                          <span>Siguiente turno</span>

                          <select
                            value={handoverTargetShiftId}
                            onChange={(event) =>
                              setHandoverTargetShiftId(
                                event.target.value,
                              )
                            }
                          >
                            <option value="">
                              Selecciona un turno
                            </option>

                            {[...shifts]
                              .filter(
                                (shift) =>
                                  shift.id !== selectedShift.id &&
                                  shift.status === 'SCHEDULED' &&
                                  new Date(
                                    shift.startsAt,
                                  ).getTime() >=
                                    new Date(
                                      selectedShift.endsAt,
                                    ).getTime(),
                              )
                              .sort(
                                (a, b) =>
                                  new Date(
                                    a.startsAt,
                                  ).getTime() -
                                  new Date(
                                    b.startsAt,
                                  ).getTime(),
                              )
                              .map((shift) => (
                                <option
                                  key={shift.id}
                                  value={shift.id}
                                >
                                  {shift.name} ·{' '}
                                  {formatDetailDate(
                                    shift.startsAt,
                                  )}
                                </option>
                              ))}
                          </select>
                        </label>

                        <label className="handover-field">
                          <span>
                            Notas para el siguiente turno
                          </span>

                          <textarea
                            rows={5}
                            value={handoverNotes}
                            onChange={(event) =>
                              setHandoverNotes(
                                event.target.value,
                              )
                            }
                            placeholder="Ej.: queda pendiente revisar el cierre de caja..."
                          />
                        </label>

                        <div className="handover-form-actions">
                          <button
                            className="shift-secondary-action"
                            type="button"
                            onClick={() => {
                              setShowHandoverForm(false)
                              setHandoverTargetShiftId('')
                              setHandoverNotes('')
                            }}
                          >
                            Cancelar
                          </button>

                          <button
                            className="shift-primary-action"
                            type="submit"
                            disabled={
                              !handoverTargetShiftId ||
                              savingHandover
                            }
                          >
                            {savingHandover
                              ? 'Guardando...'
                              : 'Guardar borrador'}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                ) : (
                  <article className="handover-card">
                    <div className="handover-card-top">
                      <span
                        className={`handover-status handover-status-${outgoingHandover.status.toLowerCase()}`}
                      >
                        {handoverStatusLabel(
                          outgoingHandover.status,
                        )}
                      </span>
                    </div>

                    <div className="handover-route">
                      <span>Destino</span>
                      <strong>
                        {shifts.find(
                          (shift) =>
                            shift.id ===
                            outgoingHandover.targetShiftId,
                        )?.name ?? 'Turno receptor'}
                      </strong>
                    </div>

                    <div className="handover-notes">
                      <span>Notas del relevo</span>
                      <p>
                        {outgoingHandover.notes ||
                          'Sin notas añadidas.'}
                      </p>
                    </div>

                    <div className="handover-items-block">
                      <div className="handover-items-heading">
                        <span>Pendientes del relevo</span>

                        <strong>
                          {handoverItems.length}
                        </strong>
                      </div>

                      {handoverItems.length === 0 ? (
                        <p className="handover-items-empty">
                          No hay tareas ni incidencias añadidas.
                        </p>
                      ) : (
                        <div className="handover-items-list">
                          {handoverItems.map((item) => (
                            <article
                              className="handover-item-card"
                              key={item.id}
                            >
                              <div className="handover-item-top">
                                <span>
                                  {item.type === 'TASK'
                                    ? 'Tarea'
                                    : 'Incidencia'}
                                </span>

                                <span>
                                  {item.priority === 'HIGH'
                                    ? 'Prioridad alta'
                                    : item.priority === 'LOW'
                                      ? 'Prioridad baja'
                                      : 'Prioridad media'}
                                </span>
                              </div>

                              <strong>{item.title}</strong>

                              {item.description && (
                                <p>{item.description}</p>
                              )}


                              {item.carriedFromItemId && (
                                <span className="handover-item-carried">
                                  Del turno anterior
                                </span>
                              )}

                              <small>
                                {item.status === 'OPEN'
                                  ? 'Pendiente'
                                  : 'Resuelto'}
                              </small>
                            </article>
                          ))}
                        </div>
                      )}
                      {outgoingHandover.status === 'DRAFT' &&
                        canManageOutgoingHandover && (
                        <div className="handover-item-create">

                          {incomingHandovers.length > 0 && (
                            <div className="handover-carry-help">
                              <strong>
                                Pendientes del turno anterior
                              </strong>
                              <span>
                                Si quedó alguna tarea o incidencia
                                sin resolver, inclúyela en este
                                relevo para que no se pierda.
                              </span>
                            </div>
                          )}

                          {carryItemsMessage && (
                            <p className="handover-carry-message">
                              {carryItemsMessage}
                            </p>
                          )}

                          {!showHandoverItemForm ? (
                            <>
                            <button
                              className="shift-secondary-action"
                              type="button"
                              onClick={() => {
                                setShowHandoverItemForm(true)
                                setShowHandoverForm(false)
                              }}
                            >
                              + Añadir pendiente
                            </button>


                            {incomingHandovers.length > 0 && (
                              <button
                                className="shift-secondary-action"
                                type="button"
                                disabled={carryingOpenItems}
                                onClick={handleCarryOpenItems}
                              >
                                {carryingOpenItems
                                  ? 'Arrastrando...'
                                  : 'Incluir pendientes sin resolver'}
                              </button>
                            )}
                            </>
                          ) : (
                            <form
                              className="handover-item-form"
                              onSubmit={handleCreateHandoverItem}
                            >
                              <div className="handover-form-heading">
                                <strong>
                                  Nuevo pendiente
                                </strong>
                                <span>
                                  Añade una tarea o incidencia
                                  que deba conocer el siguiente
                                  turno.
                                </span>
                              </div>

                              <div className="handover-item-form-row">
                                <label className="handover-field">
                                  <span>Tipo</span>

                                  <select
                                    value={handoverItemType}
                                    onChange={(event) =>
                                      setHandoverItemType(
                                        event.target.value as
                                          | 'TASK'
                                          | 'INCIDENT',
                                      )
                                    }
                                  >
                                    <option value="TASK">
                                      Tarea
                                    </option>
                                    <option value="INCIDENT">
                                      Incidencia
                                    </option>
                                  </select>
                                </label>

                                <label className="handover-field">
                                  <span>Prioridad</span>

                                  <select
                                    value={handoverItemPriority}
                                    onChange={(event) =>
                                      setHandoverItemPriority(
                                        event.target.value as
                                          | 'LOW'
                                          | 'MEDIUM'
                                          | 'HIGH',
                                      )
                                    }
                                  >
                                    <option value="LOW">
                                      Baja
                                    </option>
                                    <option value="MEDIUM">
                                      Media
                                    </option>
                                    <option value="HIGH">
                                      Alta
                                    </option>
                                  </select>
                                </label>
                              </div>

                              <label className="handover-field">
                                <span>Título</span>

                                <input
                                  type="text"
                                  maxLength={160}
                                  value={handoverItemTitle}
                                  onChange={(event) =>
                                    setHandoverItemTitle(
                                      event.target.value,
                                    )
                                  }
                                  placeholder="Ej.: Reponer vasos"
                                  required
                                />
                              </label>

                              <label className="handover-field">
                                <span>Descripción</span>

                                <textarea
                                  rows={4}
                                  maxLength={5000}
                                  value={
                                    handoverItemDescription
                                  }
                                  onChange={(event) =>
                                    setHandoverItemDescription(
                                      event.target.value,
                                    )
                                  }
                                  placeholder="Añade el contexto necesario..."
                                />
                              </label>

                              <div className="handover-form-actions">
                                <button
                                  className="shift-secondary-action"
                                  type="button"
                                  onClick={() => {
                                    setShowHandoverItemForm(false)
                                    setHandoverItemType('TASK')
                                    setHandoverItemTitle('')
                                    setHandoverItemDescription('')
                                    setHandoverItemPriority(
                                      'MEDIUM',
                                    )
                                  }}
                                >
                                  Cancelar
                                </button>

                                <button
                                  className="shift-primary-action"
                                  type="submit"
                                  disabled={
                                    !handoverItemTitle.trim() ||
                                    savingHandoverItem
                                  }
                                >
                                  {savingHandoverItem
                                    ? 'Guardando...'
                                    : 'Guardar pendiente'}
                                </button>
                              </div>
                            </form>
                          )}
                        </div>
                      )}

                    </div>


                    {outgoingHandover.status === 'DRAFT' &&
                      canManageOutgoingHandover && (
                      <>
                        {!showHandoverForm && (
                          <div className="handover-card-actions">
                            <button
                              className="shift-secondary-action"
                              type="button"
                              onClick={() => {
                                setHandoverNotes(
                                  outgoingHandover.notes ?? '',
                                )
                                setShowHandoverForm(true)
                              }}
                            >
                              Editar borrador
                            </button>

                            <button
                              className="shift-primary-action"
                              type="button"
                              disabled={sendingHandover}
                              onClick={handleSubmitHandover}
                            >
                              {sendingHandover
                                ? 'Enviando...'
                                : 'Enviar relevo'}
                            </button>
                          </div>
                        )}

                        {showHandoverForm && (
                          <form
                            className="handover-form"
                            onSubmit={handleUpdateHandover}
                          >
                            <div className="handover-form-heading">
                              <strong>Editar borrador</strong>
                              <span>
                                Modifica la información antes
                                de enviar el relevo.
                              </span>
                            </div>

                            <label className="handover-field">
                              <span>Destino</span>

                              <input
                                type="text"
                                readOnly
                                value={
                                  shifts.find(
                                    (shift) =>
                                      shift.id ===
                                      outgoingHandover.targetShiftId,
                                  )?.name ?? 'Turno receptor'
                                }
                              />
                            </label>

                            <label className="handover-field">
                              <span>
                                Notas para el siguiente turno
                              </span>

                              <textarea
                                rows={5}
                                value={handoverNotes}
                                onChange={(event) =>
                                  setHandoverNotes(
                                    event.target.value,
                                  )
                                }
                              />
                            </label>

                            <div className="handover-form-actions">
                              <button
                                className="shift-secondary-action"
                                type="button"
                                onClick={() => {
                                  setShowHandoverForm(false)
                                  setHandoverNotes('')
                                }}
                              >
                                Cancelar
                              </button>

                              <button
                                className="shift-primary-action"
                                type="submit"
                                disabled={updatingHandover}
                              >
                                {updatingHandover
                                  ? 'Guardando...'
                                  : 'Guardar cambios'}
                              </button>
                            </div>
                          </form>
                        )}
                      </>
                    )}
                  </article>
                )}
              </section>
            </div>

            <section className="shift-panel shift-incoming-panel">
              <div className="shift-section-heading">
                <div>
                  <p className="shift-section-kicker">
                    RECEPCIÓN
                  </p>
                  <h2>Relevos recibidos</h2>
                </div>

                <span className="shift-count">
                  {incomingHandovers.length}
                </span>
              </div>

              {incomingHandovers.length === 0 ? (
                <div className="shift-empty-state">
                  <strong>
                    No hay relevos recibidos
                  </strong>
                  <span>
                    Los relevos enviados a este turno
                    aparecerán aquí.
                  </span>
                </div>
              ) : (
                <div className="incoming-handovers-grid">
                  {incomingHandovers.map((handover) => (
                    <article
                      className="handover-card"
                      key={handover.id}
                    >
                      <div className="handover-card-top">
                        <span
                          className={`handover-status handover-status-${handover.status.toLowerCase()}`}
                        >
                          {handoverStatusLabel(
                            handover.status,
                          )}
                        </span>
                      </div>

                      <div className="handover-route">
                        <span>Origen</span>
                        <strong>
                          {shifts.find(
                            (shift) =>
                              shift.id ===
                              handover.shiftId,
                          )?.name ?? 'Turno anterior'}
                        </strong>
                      </div>

                      <div className="handover-notes">
                        <span>Notas del relevo</span>
                        <p>
                          {handover.notes ||
                            'Sin notas añadidas.'}
                        </p>
                      </div>


                      <div className="handover-items-block">
                        <div className="handover-items-heading">
                          <span>Pendientes del relevo</span>

                          <strong>
                            {
                              (
                                incomingHandoverItems[
                                  handover.id
                                ] ?? []
                              ).length
                            }
                          </strong>
                        </div>

                        {(
                          incomingHandoverItems[
                            handover.id
                          ] ?? []
                        ).length === 0 ? (
                          <p className="handover-items-empty">
                            No hay tareas ni incidencias en este
                            relevo.
                          </p>
                        ) : (
                          <div className="handover-items-list">
                            {(
                              incomingHandoverItems[
                                handover.id
                              ] ?? []
                            ).map((item) => (
                              <article
                                className="handover-item-card"
                                key={item.id}
                              >
                                <div className="handover-item-top">
                                  <span>
                                    {item.type === 'TASK'
                                      ? 'Tarea'
                                      : 'Incidencia'}
                                  </span>

                                  <span>
                                    {item.priority === 'HIGH'
                                      ? 'Prioridad alta'
                                      : item.priority === 'LOW'
                                        ? 'Prioridad baja'
                                        : 'Prioridad media'}
                                  </span>
                                </div>

                                <strong>{item.title}</strong>

                                {item.description && (
                                  <p>{item.description}</p>
                                )}

                                <small>
                                  {item.status === 'OPEN'
                                    ? 'Pendiente'
                                    : 'Resuelto'}
                                </small>

                                {item.status === 'OPEN' && (
                                  <button
                                    className="shift-secondary-action"
                                    type="button"
                                    disabled={
                                      resolvingHandoverItemId ===
                                      item.id
                                    }
                                    onClick={() =>
                                      handleResolveIncomingItem(
                                        handover,
                                        item,
                                      )
                                    }
                                  >
                                    {resolvingHandoverItemId ===
                                    item.id
                                      ? 'Resolviendo...'
                                      : 'Marcar como resuelto'}
                                  </button>
                                )}
                              </article>
                            ))}
                          </div>
                        )}
                      </div>

                      {handover.status === 'SUBMITTED' &&
                        isCurrentUserAssigned &&
                        handover.createdByUserId !==
                          currentMembership?.userId && (
                        <div className="handover-card-actions">
                          <button
                            className="shift-primary-action"
                            type="button"
                            disabled={
                              acknowledgingHandoverId ===
                              handover.id
                            }
                            onClick={() =>
                              handleAcknowledgeHandover(
                                handover,
                              )
                            }
                          >
                            {acknowledgingHandoverId ===
                            handover.id
                              ? 'Confirmando...'
                              : 'Confirmar recepción'}
                          </button>
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    )
  }

  if (
    token &&
    selectedCompany &&
    selectedLocation
  ) {

    const activeShift =
      shifts.find(
        (shift) => shift.status === 'ACTIVE',
      ) ?? null

    const nextShift =
      shifts
        .filter(
          (shift) => shift.status === 'SCHEDULED',
        )
        .sort(
          (a, b) =>
            new Date(a.startsAt).getTime() -
            new Date(b.startsAt).getTime(),
        )[0] ?? null

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

              <section className="current-shift-section">
                <div className="section-heading">
                  <div>
                    <p className="current-shift-eyebrow">
                      AHORA
                    </p>

                    <h2>Turno en curso</h2>

                    <p>
                      Lo que está ocurriendo ahora mismo
                      en este local.
                    </p>
                  </div>
                </div>

                {activeShift ? (
                  <button
                    className="current-shift-card"
                    type="button"
                    onClick={() =>
                      setSelectedShift(activeShift)
                    }
                  >
                    <div className="current-shift-card-top">
                      <span className="shift-status shift-status-active">
                        En curso
                      </span>

                      <span className="current-shift-arrow">
                        →
                      </span>
                    </div>

                    <div className="current-shift-main">
                      <div>
                        <h3>{activeShift.name}</h3>

                        <p className="current-shift-time">
                          {formatShiftDate(
                            activeShift.startsAt,
                          )}
                          {' → '}
                          {formatShiftDate(
                            activeShift.endsAt,
                          )}
                        </p>
                      </div>
                    </div>
                  </button>
                ) : (
                  <div className="all-clear">
                    <div className="all-clear-icon">✓</div>

                    <div>
                      <strong>No hay ningún turno en curso</strong>
                      <p>
                        El siguiente turno aparecerá más abajo.
                      </p>
                    </div>
                  </div>
                )}
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


              <section className="location-section next-shift-section">
                <div className="section-heading">
                  <div>
                    <h2>Próximo turno</h2>

                    <p>
                      El siguiente turno previsto para este local.
                    </p>
                  </div>
                </div>

                {nextShift ? (
                  <button
                    className="next-shift-card"
                    type="button"
                    onClick={() =>
                      setSelectedShift(nextShift)
                    }
                  >
                    <div>
                      <span className="shift-status shift-status-scheduled">
                        Próximo
                      </span>

                      <h3>{nextShift.name}</h3>

                      <p>
                        {formatShiftDate(nextShift.startsAt)}
                        {' → '}
                        {formatShiftDate(nextShift.endsAt)}
                      </p>
                    </div>

                    <span className="company-arrow">
                      →
                    </span>
                  </button>
                ) : (
                  <div className="all-clear">
                    <div className="all-clear-icon">✓</div>

                    <div>
                      <strong>No hay más turnos programados</strong>
                      <p>
                        No hay un siguiente turno pendiente
                        de comenzar.
                      </p>
                    </div>
                  </div>
                )}
              </section>

              <section className="location-section">
                <div className="section-heading">
                  <div>
                    <h2>Todos los turnos</h2>
                    <p>
                      Consulta el historial y los próximos turnos.
                    </p>
                  </div>


                  <div className="section-heading-actions">
                    <span className="section-count">
                      {shifts.length}
                    </span>

                    {(
                      currentMembership?.role === 'OWNER' ||
                      currentMembership?.role === 'MANAGER'
                    ) && (
                      <button
                        className="shift-secondary-action"
                        type="button"
                        onClick={() =>
                          setShowCreateShiftForm(
                            (current) => !current,
                          )
                        }
                      >
                        {showCreateShiftForm
                          ? 'Cerrar'
                          : '+ Crear turno'}
                      </button>
                    )}
                  </div>
                </div>


                {showCreateShiftForm && (
                  <form
                    className="shift-create-form"
                    onSubmit={handleCreateShift}
                  >
                    <div className="handover-form-heading">
                      <strong>Nuevo turno</strong>
                      <span>
                        Define el nombre y el horario del turno.
                      </span>
                    </div>

                    <label className="handover-field">
                      <span>Nombre</span>

                      <input
                        type="text"
                        maxLength={120}
                        value={newShiftName}
                        onChange={(event) =>
                          setNewShiftName(event.target.value)
                        }
                        placeholder="Ej.: Turno de mañana"
                      />
                    </label>

                    <div className="handover-item-form-row">
                      <label className="handover-field">
                        <span>Inicio</span>

                        <input
                          type="datetime-local"
                          value={newShiftStartsAt}
                          onChange={(event) =>
                            setNewShiftStartsAt(
                              event.target.value,
                            )
                          }
                        />
                      </label>

                      <label className="handover-field">
                        <span>Fin</span>

                        <input
                          type="datetime-local"
                          value={newShiftEndsAt}
                          onChange={(event) =>
                            setNewShiftEndsAt(
                              event.target.value,
                            )
                          }
                        />
                      </label>
                    </div>

                    <div className="handover-form-actions">
                      <button
                        className="shift-secondary-action"
                        type="button"
                        onClick={() => {
                          setShowCreateShiftForm(false)
                          setNewShiftName('')
                          setNewShiftStartsAt('')
                          setNewShiftEndsAt('')
                        }}
                      >
                        Cancelar
                      </button>

                      <button
                        className="shift-primary-action"
                        type="submit"
                        disabled={
                          savingShift ||
                          !newShiftName.trim() ||
                          !newShiftStartsAt ||
                          !newShiftEndsAt
                        }
                      >
                        {savingShift
                          ? 'Creando...'
                          : 'Crear turno'}
                      </button>
                    </div>
                  </form>
                )}

                <div className="shifts-grid">
                  {shifts.map((shift) => (
                    <button
                      className={
                        shift.status === 'ACTIVE'
                          ? 'shift-card shift-card-current'
                          : 'shift-card'
                      }
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
