import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { WorkspaceNav } from './components/WorkspaceNav'
import { ShiftLinkLogo } from './components/ShiftLinkLogo'
import { CompanyCard } from './components/CompanyCard'
import { LocationCard } from './components/LocationCard'
import { ShiftCard } from './components/ShiftCard'
import { ShiftForm } from './components/ShiftForm'
import { ShiftDetailHero } from './components/ShiftDetailHero'
import { ShiftPersonCard } from './components/ShiftPersonCard'
import { AssignMemberForm } from './components/AssignMemberForm'
import { ShiftEmptyState } from './components/ShiftEmptyState'
import { CurrentShiftCard } from './components/CurrentShiftCard'
import { NextShiftCard } from './components/NextShiftCard'
import { AllClearState } from './components/AllClearState'
import { PendingItemCard } from './components/PendingItemCard'
import { IncomingHandoverCard } from './components/IncomingHandoverCard'
import { OutgoingHandoverItemCard } from './components/OutgoingHandoverItemCard'
import {
  createDemoSession,
  login,
} from './services/authService'
import { getCompanies, getCompanyWorkspace, getCompanyMembers } from './services/companyService'
import { getLocationActivity } from './services/locationService'
import {
  cancelShift,
  completeShift,
  startShift,
  updateShift,
  removeShiftAssignment,
  assignMemberToShift,
  createShift,
  getShiftDetail,
} from './services/shiftService'
import {
  createHandoverItem,
  carryOpenItems,
  updateHandover,
  resolveHandoverItem,
  acknowledgeHandover,
  submitHandover,
  createHandover,
} from './services/handoverService'
import { ApiError } from './services/apiClient'
import './App.css'
import { toDatetimeLocalValue } from './utils/date'
import {
  formatDetailDate,
  handoverStatusLabel,
} from './utils/formatters'

import type {
  Company,
  Handover,
  HandoverItem,
  Location,
  Membership,
  Shift,
  ShiftAssignment,
} from './types'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
}

type NavigatorWithStandalone = Navigator & {
  standalone?: boolean
}

function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [deferredInstallPrompt, setDeferredInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null)

  const [isAppInstalled, setIsAppInstalled] = useState(() =>
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as NavigatorWithStandalone).standalone === true,
  )

  const [showIosInstallHelp, setShowIosInstallHelp] =
    useState(false)

  const isIosDevice =
    /iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    (
      navigator.platform === 'MacIntel' &&
      navigator.maxTouchPoints > 1
    )

  const canInstallApp =
    !isAppInstalled &&
    (deferredInstallPrompt !== null || isIosDevice)

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
    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault()

      setDeferredInstallPrompt(
        event as BeforeInstallPromptEvent,
      )
    }

    function handleAppInstalled() {
      setDeferredInstallPrompt(null)
      setIsAppInstalled(true)
      setShowIosInstallHelp(false)
    }

    window.addEventListener(
      'beforeinstallprompt',
      handleBeforeInstallPrompt,
    )

    window.addEventListener(
      'appinstalled',
      handleAppInstalled,
    )

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt,
      )

      window.removeEventListener(
        'appinstalled',
        handleAppInstalled,
      )
    }
  }, [])

  useEffect(() => {
    if (!token) {
      return
    }

    const accessToken = token

    async function loadCompanies() {
      setLoadingCompanies(true)
      setError('')

      try {
        const data = await getCompanies(accessToken)

        setCompanies(data)
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          localStorage.removeItem('shiftlink_access_token')
          setToken(null)
          return
        }

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
    const accessToken = token

    async function loadLocations() {
      setLoadingLocations(true)
      setError('')

      try {
        const { locations, membership } =
          await getCompanyWorkspace(
            companyId,
            accessToken,
          )

        setLocations(locations)
        setCurrentMembership(membership)
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
    const accessToken = token

    async function loadCompanyMembers() {
      try {
        const data = await getCompanyMembers(
          companyId,
          accessToken,
        )

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
    const accessToken = token

    async function loadLocationData() {
      setLoadingLocationData(true)
      setError('')

      try {
        const { shifts, openItems } =
          await getLocationActivity(
            companyId,
            locationId,
            accessToken,
          )

        setShifts(shifts)
        setOpenItems(openItems)
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
    const accessToken = token

    async function loadShiftDetail() {
      setLoadingShiftDetail(true)
      setError('')

      setAssignments([])
      setOutgoingHandover(null)
      setIncomingHandovers([])
      setIncomingHandoverItems({})

      try {
        const detail = await getShiftDetail(
          companyId,
          locationId,
          shiftId,
          accessToken,
        )

        setAssignments(detail.assignments)
        setOutgoingHandover(detail.outgoingHandover)
        setIncomingHandovers(detail.incomingHandovers)
        setIncomingHandoverItems(
          detail.incomingHandoverItems,
        )
        setHandoverItems(detail.handoverItems)
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
      const data = await createShift(
        selectedCompany.id,
        selectedLocation.id,
        token,
        {
          name: newShiftName.trim(),
          startsAt: startsAt.toISOString(),
          endsAt: endsAt.toISOString(),
        },
      )

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
      const data = await assignMemberToShift(
        selectedCompany.id,
        selectedLocation.id,
        selectedShift.id,
        token,
        assignmentMembershipId,
      )

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
      await removeShiftAssignment(
        selectedCompany.id,
        selectedLocation.id,
        selectedShift.id,
        assignment.assignmentId,
        token,
      )

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
      const data = await createHandover(
        selectedCompany.id,
        selectedLocation.id,
        selectedShift.id,
        token,
        {
          targetShiftId: handoverTargetShiftId,
          notes: handoverNotes.trim() || null,
        },
      )

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
      const data = await submitHandover(
        selectedCompany.id,
        selectedLocation.id,
        selectedShift.id,
        token,
      )

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
      const data = await acknowledgeHandover(
        selectedCompany.id,
        selectedLocation.id,
        handover.shiftId,
        token,
      )

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
      const data = await resolveHandoverItem(
        selectedCompany.id,
        selectedLocation.id,
        handover.shiftId,
        item.id,
        token,
      )

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
      const data = await updateHandover(
        selectedCompany.id,
        selectedLocation.id,
        selectedShift.id,
        token,
        {
          notes: handoverNotes.trim() || null,
        },
      )

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
      const data = await updateShift(
        selectedCompany.id,
        selectedLocation.id,
        selectedShift.id,
        token,
        {
          name: editShiftName.trim(),
          startsAt: startsAt.toISOString(),
          endsAt: endsAt.toISOString(),
        },
      )

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
      const data = await startShift(
        selectedCompany.id,
        selectedLocation.id,
        selectedShift.id,
        token,
      )

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
      const data = await completeShift(
        selectedCompany.id,
        selectedLocation.id,
        selectedShift.id,
        token,
      )

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
      const data = await cancelShift(
        selectedCompany.id,
        selectedLocation.id,
        selectedShift.id,
        token,
      )

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
      const data = await carryOpenItems(
        selectedCompany.id,
        selectedLocation.id,
        selectedShift.id,
        sourceHandover.shiftId,
        token,
      )

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
      const data = await createHandoverItem(
        selectedCompany.id,
        selectedLocation.id,
        selectedShift.id,
        token,
        {
          type: handoverItemType,
          title: handoverItemTitle.trim(),
          description:
            handoverItemDescription.trim() || null,
          priority: handoverItemPriority,
        },
      )

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
      const data = await login(email, password)

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

  async function handleDemoLogin() {
    setLoading(true)
    setError('')

    try {
      const data = await createDemoSession()

      localStorage.setItem(
        'shiftlink_access_token',
        data.accessToken,
      )

      setEmail('')
      setPassword('')
      setToken(data.accessToken)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se ha podido preparar la demo',
      )
    } finally {
      setLoading(false)
    }
  }

  async function handleInstallApp() {
    if (isIosDevice) {
      setShowIosInstallHelp(true)
      return
    }

    if (!deferredInstallPrompt) {
      return
    }

    await deferredInstallPrompt.prompt()
    await deferredInstallPrompt.userChoice

    setDeferredInstallPrompt(null)
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
    const isCurrentUserAssigned = assignments.some(
      (assignment) =>
        assignment.userId === currentMembership?.userId,
    )

    const canManageOutgoingHandover =
      isCurrentUserAssigned &&
      outgoingHandover?.createdByUserId ===
        currentMembership?.userId

    return (
      <div className="location-page">
        <WorkspaceNav
          subtitle={`${selectedCompany.name} · ${selectedLocation.name}`}
          actionLabel="← Volver a turnos"
          onAction={() => {
            setSelectedShift(null)
            setShowEditShiftForm(false)
            setAssignments([])
            setOutgoingHandover(null)
            setIncomingHandovers([])
          }}
        />

        <main className="shift-detail-page">

        <ShiftDetailHero
          shift={selectedShift}
          locationName={selectedLocation.name}
          canManage={
            currentMembership?.role === 'OWNER' ||
            currentMembership?.role === 'MANAGER'
          }
          changingStatus={changingShiftStatus}
          onEdit={handleOpenEditShift}
          onStart={handleStartShift}
          onCancel={handleCancelShift}
          onComplete={handleCompleteShift}
        />


        {showEditShiftForm &&
          selectedShift.status === 'SCHEDULED' &&
          (
            currentMembership?.role === 'OWNER' ||
            currentMembership?.role === 'MANAGER'
          ) && (
            <ShiftForm
              title="Editar turno"
              description="Modifica el nombre o el horario antes de iniciar el turno."
              name={editShiftName}
              startsAt={editShiftStartsAt}
              endsAt={editShiftEndsAt}
              saving={savingShiftEdit}
              submitLabel="Guardar cambios"
              savingLabel="Guardando..."
              className="shift-edit-form"
              onNameChange={setEditShiftName}
              onStartsAtChange={setEditShiftStartsAt}
              onEndsAtChange={setEditShiftEndsAt}
              onSubmit={handleUpdateShift}
              onCancel={() =>
                setShowEditShiftForm(false)
              }
            />
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
                      <AssignMemberForm
                        members={companyMembers}
                        assignments={assignments}
                        membershipId={assignmentMembershipId}
                        saving={savingAssignment}
                        onMembershipIdChange={setAssignmentMembershipId}
                        onSubmit={handleAssignMember}
                        onCancel={() => {
                          setShowAssignmentForm(false)
                          setAssignmentMembershipId('')
                        }}
                      />
                    )}
                  </div>
                )}

                {assignments.length === 0 ? (
                  <ShiftEmptyState
                    title="Sin empleados asignados"
                    description="Todavía no hay nadie asignado a este turno."
                  />
                ) : (
                  <div className="shift-people-list">
                    {assignments.map((assignment) => (
                      <ShiftPersonCard
                        key={assignment.assignmentId}
                        assignment={assignment}
                        canManage={
                          currentMembership?.role === 'OWNER' ||
                          currentMembership?.role === 'MANAGER'
                        }
                        removing={
                          removingAssignmentId ===
                          assignment.assignmentId
                        }
                        onRemove={handleRemoveAssignment}
                      />
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
                            <OutgoingHandoverItemCard
                              key={item.id}
                              item={item}
                            />
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
                <ShiftEmptyState
                  title="No hay relevos recibidos"
                  description="Los relevos enviados a este turno aparecerán aquí."
                />
              ) : (
                <div className="incoming-handovers-grid">
                  {incomingHandovers.map((handover) => (
                    <IncomingHandoverCard
                      key={handover.id}
                      handover={handover}
                      originShiftName={
                        shifts.find(
                          (shift) => shift.id === handover.shiftId,
                        )?.name ?? 'Turno anterior'
                      }
                      items={
                        incomingHandoverItems[handover.id] ?? []
                      }
                      canAcknowledge={
                        handover.status === 'SUBMITTED' &&
                        isCurrentUserAssigned &&
                        handover.createdByUserId !==
                          currentMembership?.userId
                      }
                      canResolve={isCurrentUserAssigned}
                      acknowledging={
                        acknowledgingHandoverId === handover.id
                      }
                      resolvingItemId={resolvingHandoverItemId}
                      onResolve={handleResolveIncomingItem}
                      onAcknowledge={handleAcknowledgeHandover}
                    />
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

    return (
      <div className="location-page">
        <WorkspaceNav
          subtitle={`${selectedCompany.name} · ${selectedLocation.name}`}
          actionLabel="← Volver al local"
          onAction={() => setSelectedLocation(null)}
        />

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
                  <CurrentShiftCard
                    shift={activeShift}
                    onSelect={setSelectedShift}
                  />
                ) : (
                  <AllClearState
                    title="No hay ningún turno en curso"
                    description="El siguiente turno aparecerá más abajo."
                  />
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

                  <span
                    className={
                      openItems.length === 0
                        ? 'section-count section-count-success'
                        : 'section-count section-count-alert'
                    }
                  >
                    {openItems.length}
                  </span>
                </div>

                {openItems.length === 0 ? (
                  <AllClearState
                    title="Todo al día"
                    description="No hay tareas ni incidencias pendientes."
                  />
                ) : (
                  <div className="pending-list">
                    {openItems.map((item) => (
                      <PendingItemCard
                        key={item.id}
                        item={item}
                      />
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
                  <NextShiftCard
                    shift={nextShift}
                    onSelect={setSelectedShift}
                  />
                ) : (
                  <AllClearState
                    title="No hay más turnos programados"
                    description="No hay un siguiente turno pendiente de comenzar."
                  />
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
                  <ShiftForm
                    title="Nuevo turno"
                    description="Define el nombre y el horario del turno."
                    name={newShiftName}
                    startsAt={newShiftStartsAt}
                    endsAt={newShiftEndsAt}
                    saving={savingShift}
                    submitLabel="Crear turno"
                    savingLabel="Creando..."
                    namePlaceholder="Ej.: Turno de mañana"
                    onNameChange={setNewShiftName}
                    onStartsAtChange={setNewShiftStartsAt}
                    onEndsAtChange={setNewShiftEndsAt}
                    onSubmit={handleCreateShift}
                    onCancel={() => {
                      setShowCreateShiftForm(false)
                      setNewShiftName('')
                      setNewShiftStartsAt('')
                      setNewShiftEndsAt('')
                    }}
                  />
                )}

                <div className="shifts-grid">
                  {shifts.map((shift) => (
                    <ShiftCard
                      key={shift.id}
                      shift={shift}
                      onSelect={setSelectedShift}
                    />
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
        <WorkspaceNav
          subtitle={selectedCompany.name}
          actionLabel="← Cambiar empresa"
          onAction={() => setSelectedCompany(null)}
        />

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
                <LocationCard
                  key={location.id}
                  location={location}
                  onSelect={setSelectedLocation}
                />
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
        <WorkspaceNav
          subtitle="Gestión de relevos"
          actionLabel="Cerrar sesión"
          onAction={handleLogout}
          secondaryActionLabel={
            canInstallApp
              ? 'Instalar ShiftLink'
              : undefined
          }
          onSecondaryAction={
            canInstallApp
              ? handleInstallApp
              : undefined
          }
        />

        {showIosInstallHelp && (
          <div
            className="install-help-banner"
            role="status"
          >
            <div>
              <strong>Instalar ShiftLink en iPhone o iPad</strong>
              <p>
                Abre ShiftLink en Safari, pulsa Compartir y
                selecciona Añadir a pantalla de inicio.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowIosInstallHelp(false)}
            >
              Entendido
            </button>
          </div>
        )}

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
              <CompanyCard
                key={company.id}
                company={company}
                onSelect={setSelectedCompany}
              />
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
        <div className="brand-watermark" aria-hidden="true">
          <ShiftLinkLogo
            className="brand-watermark-logo"
            title=""
          />
        </div>

        <div className="brand-content">
          <div className="brand-lockup">
            <ShiftLinkLogo className="brand-logo" />
            <span>ShiftLink</span>
          </div>

          <h1 className="brand-hero-title">
            El relevo de turno,
            <br />
            <span>claro</span> para todos.
          </h1>

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
            <ShiftLinkLogo className="brand-logo" />
            <span>ShiftLink</span>
          </div>

          <div className="login-heading">
            <p className="eyebrow">
              ACCESO A SHIFTLINK
            </p>

            <h2>Inicia sesión</h2>

            <p>Accede a tu espacio de trabajo.</p>
          </div>

          <div className="demo-access">
            <div className="demo-access-heading">
              <div>
                <p className="demo-access-label">
                  DEMO PÚBLICA
                </p>
                <strong>Prueba ShiftLink sin registrarte</strong>
              </div>
              <span className="demo-access-role">
                Entorno privado
              </span>
            </div>

            <p className="demo-access-description">
              Crearemos un espacio de demostración independiente
              para ti, con empresa, empleados, turnos, relevos,
              tareas e incidencias de ejemplo.
            </p>

            <p className="demo-access-note">
              Los cambios que hagas no afectan a las demos
              de otros visitantes.
            </p>

            <button
              type="button"
              className="demo-access-button"
              onClick={handleDemoLogin}
              disabled={loading}
            >
              {loading
                ? 'Preparando demo...'
                : 'Entrar en demo'}
            </button>
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
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>

            {error && (
              <p className="login-error">
                {error}
              </p>
            )}
          </form>

        </div>
      </section>
    </div>
  )
}

export default App
