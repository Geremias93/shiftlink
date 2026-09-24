type ShiftEmptyStateProps = {
  title: string
  description: string
}

export function ShiftEmptyState({
  title,
  description,
}: ShiftEmptyStateProps) {
  return (
    <div className="shift-empty-state">
      <strong>{title}</strong>
      <span>{description}</span>
    </div>
  )
}
