export type Company = {
  id: string
  name: string
  slug: string
  active: boolean
  createdAt: string
  updatedAt: string
}

export type Membership = {
  membershipId: string
  userId: string
  firstName: string
  lastName: string
  email: string
  role: 'OWNER' | 'MANAGER' | 'EMPLOYEE'
  active: boolean
}

export type Location = {
  id: string
  companyId: string
  name: string
  address: string
  active: boolean
  createdAt: string
  updatedAt: string
}

export type Shift = {
  id: string
  locationId: string
  name: string
  startsAt: string
  endsAt: string
  status:
    | 'SCHEDULED'
    | 'ACTIVE'
    | 'COMPLETED'
    | 'CANCELLED'
  createdAt: string
  updatedAt: string
}

export type HandoverItem = {
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

export type ShiftAssignment = {
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

export type Handover = {
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
